// GET /api/malls
// Get all available shopping malls

import { getAvailableMalls, getMallInfo } from './lib/restaurants.js';

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
    const malls = [];
    const mallIds = getAvailableMalls();
    
    for (const mallId of mallIds) {
      const info = getMallInfo(mallId);
      malls.push({
        id: mallId,
        name: info.name,
        display_name: info.display_name
      });
    }

    return res.status(200).json({ malls });
  } catch (error) {
    console.error('Error fetching malls:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

