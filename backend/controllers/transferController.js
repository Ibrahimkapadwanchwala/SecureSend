import pool from "../configs/db.js";
import auditLogEvent from "../services/auditService.js";
const MAX_RETRIES = 3;

const transfer = async (req, res) => {
  const senderId = req.user.userId;
  const { receiverId, amount, idempotencyKey } = req.body;
  const numericAmount = Number(amount);

  if (!receiverId || !numericAmount || numericAmount <= 0 || !idempotencyKey) {
    return res
      .status(400)
      .json({ message: "Valid receiver, amount and idempotency key required" });
  }

  if (senderId === receiverId) {
    return res.status(400).json({ message: "Cannot transfer to yourself" });
  }

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [txResult] = await connection.execute(
        `INSERT INTO transactions 
         (sender_id, receiver_id, amount, status, idempotency_key)
         VALUES (?, ?, ?, 'PENDING', ?)`,
        [senderId, receiverId, numericAmount, idempotencyKey]
      );

      const transferId = txResult.insertId;

      const ids = [senderId, receiverId].sort((a, b) => a - b);

      const [walletRows] = await connection.execute(
        `SELECT user_id, balance,is_frozen
         FROM wallet
         WHERE user_id IN (?, ?)
         FOR UPDATE`,
        ids
      );

      const walletMap = {};
      walletRows.forEach((w) => {
        walletMap[w.user_id] = w;
      });

      const senderWallet = walletMap[senderId];
      const receiverWallet = walletMap[receiverId];

      if (!senderWallet) throw new Error("Sender wallet not found");
      if (!receiverWallet) throw new Error("Receiver wallet not found");

      if (senderWallet.is_frozen) {
        throw new Error("Sender wallet is frozen");
      }
      if (receiverWallet.is_frozen) {
        throw new Error("receiver wallet is frozen");
      }
      if (senderWallet.balance < numericAmount) {
        throw new Error("Insufficient balance");
      }

      await connection.execute(
        `INSERT INTO ledger_entries
         (wallet_id, transfer_id, amount, entry_type)
         VALUES (?, ?, ?, 'DEBIT')`,
        [senderId, transferId, -numericAmount]
      );

      await connection.execute(
        `INSERT INTO ledger_entries
         (wallet_id, transfer_id, amount, entry_type)
         VALUES (?, ?, ?, 'CREDIT')`,
        [receiverId, transferId, numericAmount]
      );

      await connection.execute(
        `UPDATE wallet SET balance = balance - ? WHERE user_id = ?`,
        [numericAmount, senderId]
      );

      await connection.execute(
        `UPDATE wallet SET balance = balance + ? WHERE user_id = ?`,
        [numericAmount, receiverId]
      );

      await connection.execute(
        `UPDATE transactions
         SET status = 'SUCCESS'
         WHERE id = ? AND sender_id = ?`,
        [transferId, senderId]
      );

      await connection.commit();

      connection.release();
      await auditLogEvent({
        userId: senderId,
        action: "TRANSFER_SUCCESS",
        metadata: {
          receiver: receiverId,
          amount: numericAmount,
          transferId,
        },
        ip_address: req.ip,
      });
      return res.status(200).json({
        message: "Transfer successful",
        transferId,
      });
    } catch (error) {
      await connection.rollback();
      connection.release();

      if (
        (error.code === "ER_LOCK_DEADLOCK" ||
          error.code === "ER_LOCK_WAIT_TIMEOUT") &&
        attempt < MAX_RETRIES - 1
      ) {
        console.log(`Retrying transaction (attempt ${attempt + 1})`);
        continue;
      }

      if (error.code === "ER_DUP_ENTRY") {
        const [existingTx] = await pool.execute(
          `SELECT * FROM transactions
           WHERE sender_id = ? AND idempotency_key = ?`,
          [senderId, idempotencyKey]
        );

        return res.status(200).json({
          message: "Transaction already processed",
          transaction: existingTx[0],
        });
      }
      await auditLogEvent({
        userId: senderId,
        action: "TRANSFER_FAILED",
        metadata: {
          receiver: receiverId,
          amount: numericAmount,
          reason: error.message,
          ip_address: req.ip,
        },
      });
      return res.status(400).json({ message: error.message });
    }
  }

  return res.status(500).json({
    message: "Transfer failed after multiple retries",
  });
};

export default transfer;
