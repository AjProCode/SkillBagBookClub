// Simplified Netlify serverless function for health check
export async function handler(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      status: 'ok',
      message: 'Skillbag Book Club API is healthy',
      time: new Date().toISOString()
    })
  };
}