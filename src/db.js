const mysql = require('mysql');
const { promisify } = require('util');

// const database = {
//     host: 'localhost',
//     user: 'root',
//     database: 'Jobs_Hub'
// }

const database = {
    host: 'sql9.freemysqlhosting.net',
    user: 'sql9348199',
    password: 'BpM6JY7Blk',
    database: 'sql9348199'
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