const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Change to your MySQL password
  database: 'employee_db'
});
connection.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});
module.exports = connection;