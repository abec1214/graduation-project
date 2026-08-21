const mysql = require("mysql2/promise");

module.exports = async (req, res) => {
  let conn;

  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false,
      },
      connectTimeout: 5000,
    });

    const [rows] = await conn.query("SELECT 1 AS ok");

    res.status(200).json({
      success: true,
      message: "MYSQL CONNECT OK",
      result: rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
    });
  } finally {
    if (conn) {
      await conn.end().catch(() => {});
    }
  }
};
