// test-db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Angaar1997@#',
  database: 'saas_dashboard'
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ DB connection failed:', err);
  } else {
    console.log('✅ DB connected:', res.rows);
  }
  pool.end();
});
