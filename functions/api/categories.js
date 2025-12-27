// GET /api/categories?mall_id=<mall_id>
// Get all available restaurant categories for a specific mall

import { getAllCategories } from './lib/restaurants.js';
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
    const url = new URL(request.url);
    const mallId = url.searchParams.get('mall_id') || 'sunway_square';
    const categories = getAllCategories(mallId);

    return jsonResponse({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return jsonResponse({
      error: 'Internal server error',
      message: error.message,
    }, 500);
  }
}

