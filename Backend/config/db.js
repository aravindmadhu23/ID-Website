const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, // localhost
    database: process.env.DB_NAME,
    port: 1433,
    options: {
        encrypt: true,                // REQUIRED for SQL 2022
        trustServerCertificate: true  // REQUIRED for local dev
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

console.log(`Attempting connection: Server=${process.env.DB_SERVER}, User=${process.env.DB_USER}`);

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Successfully connected to MSSQL');
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed!');
        console.error(err);
        throw err;
    });

module.exports = { sql, poolPromise };