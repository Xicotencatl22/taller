const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  user: 'user1_abd',
  password: '123',
  database: "SanJorge",
  port: 5432,
});

module.exports = pool;