// GET /api/categories?mall_id=<mall_id>
// Get all available restaurant categories for a specific mall

import { getAllCategories } from './lib/restaurants.js';

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
    const mallId = req.query.mall_id || 'sunway_square';
    const categories = getAllCategories(mallId);

    return res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

