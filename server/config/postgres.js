import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const connectDB = async () => {
    try {
        await pool.query('SELECT NOW()');
        console.log('Database Connected');
    } catch (err) {
        console.error('Database Connection Error:', err);
        process.exit(1);
    }
};

export { pool, connectDB };