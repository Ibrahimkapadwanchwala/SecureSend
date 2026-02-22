import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
async function initializeDb() {
  try {
    const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
 await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
 console.log("Database created");
 await connection.end();
  } catch (error) {
    console.log("Database init failed ",error.message);
    
  }

 
}
export default initializeDb;
