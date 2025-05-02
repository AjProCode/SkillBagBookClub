// Simplified Netlify serverless function for database testing
import { db } from "../../db";
import { sql } from "drizzle-orm";

export async function handler(event, context) {
  try {
    // Simple database connection test
    const result = await db.execute(sql`SELECT 1 as connected`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        status: 'ok',
        message: 'Database connection successful',
        result: result[0],
        time: new Date().toISOString()
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
        time: new Date().toISOString()
      })
    };
  }
}