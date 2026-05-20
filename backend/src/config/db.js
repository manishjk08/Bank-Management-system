import dotenv from 'dotenv';
import pg from 'pg';


dotenv.config();

const { Pool } = pg;

const pool = new Pool({
   host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});



// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Database connected successfully.');
    release();
  }
});

export default pool;