// GET /api/restaurants?categories=<categories>&mall_id=<mall_id>
// Get restaurants, optionally filtered by categories (comma-separated) and mall

import { getRestaurantsByCategories, getAllCategories } from './lib/restaurants.js';
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
    let restaurants;

    const categoriesParam = url.searchParams.get('categories');
    if (categoriesParam) {
      // Filter by categories
      const categoryList = categoriesParam.split(',').map(c => c.trim());
      restaurants = getRestaurantsByCategories(categoryList, mallId);
    } else {
      // Get all restaurants
      const allCategories = getAllCategories(mallId);
      restaurants = getRestaurantsByCategories(allCategories, mallId);
    }

    return jsonResponse({
      restaurants,
      count: restaurants.length
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return jsonResponse({
      error: 'Internal server error',
      message: error.message,
    }, 500);
  }
}

