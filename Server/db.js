// const { Pool } = require("pg");

// const client = new Pool({
//   user: "postgres",
//   host: "192.168.137.167",
//   database: "bypldb",
//   password: "1234",
//   port: 5432, // Default PostgreSQL port
// });


// module.exports = client;

// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "postgres",  // Service name of PostgreSQL container in Docker Compose
  database: "bypldb",
  password: "1234",
  port: 5432,
  idleTimeoutMillis: 200000,
  connectionTimeoutMillis: 200000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Export the pool instead of client
module.exports = pool;
