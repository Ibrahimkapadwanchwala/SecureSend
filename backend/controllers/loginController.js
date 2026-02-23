import pool from "../configs/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import auditLogEvent from "../services/auditService.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Both email and password are required",
    });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

   
    if (rows.length === 0) {
      await auditLogEvent({
        userId: null,
        action: "LOGIN_FAILED",
        metadata: { email, reason: "USER_NOT_FOUND" },
        ip_address: req.ip,
      });

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await auditLogEvent({
        userId: user.id,
        action: "LOGIN_FAILED",
        metadata: { reason: "INVALID_PASSWORD" },
        ip_address: req.ip,
      });

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    
    const token = jwt.sign(
      { userId: user.id ,role:user.role},
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

  res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  maxAge: 60 * 60 * 1000,
});

   
    await auditLogEvent({
      userId: user.id,
      action: "LOGIN_SUCCESS",
      ip_address: req.ip,
    });

    return res.status(200).json({
      message: "Login successful",
    });

  } catch (error) {
    console.error("Login error:", error.message);

    await auditLogEvent({
      userId: null,
      action: "LOGIN_ERROR",
      metadata: { error: "INTERNAL_ERROR" },
      ip_address: req.ip,
    });

    return res.status(500).json({
      message: "Login failed",
    });
  }
};

export default login;
