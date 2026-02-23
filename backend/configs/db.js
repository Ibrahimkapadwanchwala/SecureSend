import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionLimit: 20,
  waitForConnections: true,
  queueLimit: 0,
  connectTimeout: 20000
});

export default pool;