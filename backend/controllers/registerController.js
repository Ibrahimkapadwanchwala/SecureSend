import pool from "../configs/db.js";
import bcrypt from "bcrypt";
const register = async (req, res) => {
 
  
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [
      existing,
    ] = await connection.execute("SELECT id from users WHERE email=?", [email]);
    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [
      result,
    ] = await connection.execute(
      "INSERT INTO users(name,email,password) VALUES(?,?,?)",
      [name, email, hashedPassword]
    );
    const userId = result.insertId;
    await connection.execute(
      "INSERT INTO wallet(user_id,balance) VALUES(?,0.00)",
      [userId]
    );
    await connection.commit();
    return res.status(201).json({
      message: "User registered successfully",
      userId,
    });
  } catch (error) {
    await connection.rollback();

    return res
      .status(501)
      .json({ message: "Registration failed", error: error.message });
  } finally {
    connection.release();
  }
};
export default register;
