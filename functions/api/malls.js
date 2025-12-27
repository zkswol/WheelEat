// GET /api/malls
// Get all available shopping malls

import { getAvailableMalls, getMallInfo } from './lib/restaurants.js';
import { createCORSResponse, jsonResponse } from './lib/cors.js';

export async function onRequest(context) {
  const { request } = context;

  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return createCORSResponse();
  }

  // Only allow GET requests
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
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

    return jsonResponse({ malls });
  } catch (error) {
    console.error('Error fetching malls:', error);
    return jsonResponse({
      error: 'Internal server error',
      message: error.message,
    }, 500);
  }
}

