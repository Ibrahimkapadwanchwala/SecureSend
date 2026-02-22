import pool from "../configs/db.js";


export const getAuditLogs = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  try {
    const [logs] = await pool.execute(
      `
      SELECT 
        a.id,
        a.user_id,
        u.name,
        a.action,
        a.metadata,
        a.ip_address AS ip_address,
        a.created_at
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
     LIMIT ${limit} OFFSET ${offset}
      `,
      [limit, offset]
    );

    return res.json({
      page,
      limit,
      logs:logs,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch audit logs",
    });
  }
};
export default getAuditLogs;