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
        console.log('Connected to PostgreSQL');
    } catch (err) {
        console.error('PostgreSQL connection error:', err);
        process.exit(1);
    }
};

export { pool, connectDB };