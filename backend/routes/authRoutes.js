import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import pool from "../configs/db.js";
import changePassword from "../controllers/changePasswordController.js";
const router = express.Router();

router.get("/me", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);
    
    const [rows] = await pool.execute(
      "SELECT id, name, email, is_active, created_at,role FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    res.json({
      success: true,
      user,
    });

  } catch (error) {
    console.log(error.message);
    
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
});
router.post("/change-password",verifyToken,changePassword)
export default router;
