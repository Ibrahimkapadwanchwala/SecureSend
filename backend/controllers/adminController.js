import pool from "../configs/db.js";
import auditLogEvent from "../services/auditService.js";
const getAllUsers=async(req,res)=>{
    try {
        const[users]=await pool.execute(`
             SELECT 
      u.id,
      u.name,
      u.email,
      u.role,
      w.is_frozen
    FROM users u
    JOIN wallet w ON u.id = w.user_id
            WHERE role="USER"
            `)
            return res.json({success:true,data:users});
    } catch (error) {
        return res.status(500).json({success:false,message:"Failed to fetch users"});
    }
};
const walletFreeze = async (req, res) => {
  const userId = req.params.userID;
  const reason = req.body;
  try {
    const [result] = await pool.execute(
      `UPDATE wallet SET is_frozen=TRUE , freeze_reason=?
            WHERE user_id=? AND is_frozen=FALSE`,
      [reason || "No reason provided", userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Wallet is already frozen or does not exist" });
    }
        await auditLogEvent({
      userId: req.user.userId,
      action: "ADMIN_FREEZE_USER",
      metadata: { targetUserId: userId },
      ip_address: req.ip,
    });

    return res.status(200).json({ message: "Wallet frozen successfuly" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to freeze wallet", error: error.message });
  }

};
const walletUnfreeze = async (req, res) => {
  const userID = req.params.userID;
  try {
    const [result] = await pool.execute(
      `
            UPDATE wallet 
            SET is_frozen=FALSE, freeze_reason=NULL
            WHERE user_id=?
            AND is_frozen=TRUE
            `,
      [userID]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Wallet is already unfrozen or does not exist" });
    }
     await auditLogEvent({
      userId: req.user.userId,
      action: "ADMIN_UNFREEZE_USER",
      metadata: { targetUserId: userID },
      ip_address: req.ip,
    });
    return res.status(200).json({ message: "Wallet unfrozen sucessfuly" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to unfreeze wallet", error: error.message });
  }
};
export{ getAllUsers,walletFreeze,walletUnfreeze};