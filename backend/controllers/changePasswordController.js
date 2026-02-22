import bcrypt from "bcrypt";
import pool from "../configs/db.js";
import auditLogEvent from "../services/auditService.js";
const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both current and new password are required",
      });
    }
    if (newPassword.length < 6) {
      return res.status(500).json({
        success: false,
        message: "Password must be atleast  6 characters",
      });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "old and new passwords cannot be same",
      });
    }
    const [rows] = await pool.execute(
      `
    SELECT password FROM users 
    WHERE id=? 
    `,
      [userId]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "The current password is incorrect" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      `
    UPDATE users 
    SET password=?
    WHERE id=?
    `,
      [hashedPassword, userId]
    );
    await logAuditEvent({
      userId,
      action: "PASSWORD_CHANGED",
      ipAddress: req.ip,
    });

    return res.json({ success: true, message: "Password changed sucessfully" });
  } catch (error) {
    console.log(error.message);

    return res
      .status(500)
      .json({ success: false, message: "Error updating password" });
  }
};
export default changePassword;
