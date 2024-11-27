import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

var pool;

export const getPool = () => {
  if (pool) return pool;
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT,
  });
  return pool;
};

