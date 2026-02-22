import pool from "../configs/db.js";
const auditLogEvent = async ({
  userId = null,
  action,
  metadata = null,
  ip_address = null,
}) => {
  try {
    await pool.execute(
      `INSERT INTO audit_logs (user_id, action, metadata, ip_address)
       VALUES (?, ?, ?, ?)`,
      [
        userId ?? null,
        action,
        metadata ? JSON.stringify(metadata) : null,
        ip_address ?? null,
      ]
    );
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
};
export default auditLogEvent;