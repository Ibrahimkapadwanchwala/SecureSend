import mysql from "mysql2/promise";
import dotenv from 'dotenv';
dotenv.config();
async function initializeDb() {
  try {
    const connection = await mysql.createConnection({
      uri: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      connectTimeout: 20000
    });

    console.log("Database connected successfully");
    await connection.end();
  } catch (error) {
    console.log("Database connection failed:", error.message);
  }
}

export default initializeDb;