const mysql = require('mysql');
const { promisify } = require('util');

const database = {
    host: 'localhost',
    user: 'root',
    database: 'p3_web'
}

const pool = mysql.createPool(database);

pool.getConnection((err, conn) => {
    if(err) console.error(err);
    if(conn) conn.release();
    console.log('Connected to DB');
    return;
});

pool.query = promisify(pool.query);

module.exports = pool;
module.exports.database = database;