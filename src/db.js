const mysql = require('mysql');
const { promisify } = require('util');

const database = {
    host: 'localhost',
    user: 'root',
    database: 'Jobs_Hub'
}

const pool = mysql.createPool(database);

pool.getConnection((err, conn) => {
    if (err) throw err;
    if (conn) conn.release();
    console.log('Connected to DB');
    return 1;
});

pool.query = promisify(pool.query);

module.exports = pool;
module.exports.database = database;