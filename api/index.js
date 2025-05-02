// Simplified Vercel serverless function
export default function handler(req, res) {
  // Respond with basic status to test deployment
  res.status(200).json({ 
    status: 'ok',
    message: 'Skillbag Book Club API is running',
    time: new Date().toISOString()
  });
}