const db = require("../db");

module.exports = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS ok");

    res.status(200).json({
      success: true,
      message: "POOL CONNECT OK",
      result: rows,
    });
  } catch (err) {
    console.error("POOL ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message,
      code: err.code,
      errno: err.errno,
    });
  }
};
