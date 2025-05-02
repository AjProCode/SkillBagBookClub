// Simple health check endpoint
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
}