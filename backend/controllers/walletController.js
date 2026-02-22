import pool from "../configs/db.js";
const getBalance = async (req, res) => {
  try {
    const id = req.user.userId;
    const [
      rows,
    ] = await pool.execute("SELECT balance FROM wallet WHERE user_id=?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    return res.status(200).json({ balance: rows[0].balance });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch balance", error: error.message });
  }
};
const getTransactions = async (req, res) => {
  const userId = req.user.userId;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await pool.execute(
      `
      SELECT 
        l.id AS ledger_id,
        l.transfer_id,
        l.amount,
        l.created_at,
        t.status,
        CASE 
          WHEN l.amount < 0 THEN 'DEBIT'
          ELSE 'CREDIT'
        END AS direction
      FROM ledger_entries l
      JOIN transactions t ON l.transfer_id = t.id
      WHERE l.wallet_id = ?
      ORDER BY l.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
      `,
      [userId]
    );

    return res.status(200).json({
      page,
      limit,
      transactions: rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Could not fetch ledger history",
      error: error.message,
    });
  }
};


export { getBalance, getTransactions};
