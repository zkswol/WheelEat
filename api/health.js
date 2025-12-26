// GET /api/health
// Simple health check endpoint to verify the API is working

export default async function handler(req, res) {
  // Set CORS headers first - always set them
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    return res.status(200).json({
      status: 'ok',
      message: 'WheelEat API is running',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

