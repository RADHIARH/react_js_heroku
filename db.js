var mysql = require("mysql2");
var dbConn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "reactjs!nodejs$ingenieurinformatique",
  database: "mydatabase",
  multipleStatements: true,
});
module.exports = dbConn;
