// Endpoint to test database connectivity
import { pool } from '../db/index.js';

export default async function handler(req, res) {
  try {
    // Simple database check
    const result = await pool.query('SELECT NOW() as time');
    
    res.status(200).json({
      status: 'success',
      message: 'Database connection successful',
      serverTime: result.rows[0].time
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
}