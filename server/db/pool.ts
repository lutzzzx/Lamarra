import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Support both DATABASE_URL (for Vercel/Supabase/Neon) and individual DB env vars
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: process.env.NODE_ENV === 'production' 
          ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' } 
          : false,
      }
    : {
        user: process.env.DB_USER || 'lamarra_user',
        password: process.env.DB_PASSWORD || 'lamarra_password',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_NAME || 'lamarra_db',
      }
);

// Auto-run schema migration for missing columns on startup
pool.query('ALTER TABLE reminders ADD COLUMN IF NOT EXISTS due_time VARCHAR(10);')
  .then(() => console.log('✓ PostgreSQL DB schema migration check complete.'))
  .catch((err) => console.error('Migration check warning:', err.message));

// Helper for queries with logged error handling
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production') {
      console.log('Executed query', { text: text.substring(0, 80), duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};
