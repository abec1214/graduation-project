const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Z86c4rpP",
  database: "graduation_app",
});

module.exports = db;
