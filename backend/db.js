const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  connectTimeout: 20000,
};

async function query(sql, params) {
  const connection = await mysql.createConnection(dbConfig);

  try {
    return await connection.query(sql, params);
  } finally {
    await connection.end();
  }
}

module.exports = {
  query,
};
