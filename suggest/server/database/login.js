const mysql = require('mysql')
const { errorFn } = require('../api/error')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'sino',
  port: 3300
})
connection.connect();
module.exports = {
  login: function (req, res, callback) {
    let sql = `select * from customer where customer_username="${req.body.username}"`
    connection.query(sql, (err, data) => {
      if (err) errorFn(res, err.message);
      callback(data)
    })
  }
}