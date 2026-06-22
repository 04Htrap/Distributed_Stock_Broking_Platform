const { Pool } = require('pg');

const pool = new Pool({
  user: 'parth',
  host: 'localhost',
  database: 'trading_system',
  password: 'parth123', // whatever you set
  port: 5432,
});

module.exports = pool;