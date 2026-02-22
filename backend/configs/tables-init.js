import pool from "./db.js";

async function createTable() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS wallet(
        user_id INT PRIMARY KEY,
        balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP,
        is_frozen BOOLEAN DEFAULT FALSE,
        freeze_reason VARCHAR(255) NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS transactions(
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        status ENUM('PENDING','SUCCESS','FAILED') NOT NULL,
        idempotency_key VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_idempotency (sender_id, idempotency_key),
        FOREIGN KEY(sender_id) REFERENCES users(id),
        FOREIGN KEY(receiver_id) REFERENCES users(id)
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ledger_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        wallet_id INT NOT NULL,
        transfer_id INT NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        entry_type ENUM('DEBIT', 'CREDIT') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (wallet_id) REFERENCES wallet(user_id) ON DELETE CASCADE,
        FOREIGN KEY (transfer_id) REFERENCES transactions(id) ON DELETE CASCADE,

        INDEX (wallet_id),
        INDEX (transfer_id)
      )
    `);
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS audit_logs(
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action VARCHAR(255) NOT NULL,
        metadata JSON,
        ip_address VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        index(user_id),
        index(action),
        index(created_at)
        );
        `)
    console.log("Tables created successfully");
  } catch (error) {
    console.error(error.message);
  }
}

export default createTable;
