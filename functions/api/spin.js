// POST /api/spin
// Spin the wheel and return a random restaurant from selected categories

import { getRestaurantsByCategories } from './lib/restaurants.js';
import { createSupabaseClient } from './lib/supabase.js';
import { createCORSResponse, jsonResponse } from './lib/cors.js';

export async function onRequest(context) {
  const { request, env } = context;

  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return createCORSResponse();
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return jsonResponse({ detail: 'Invalid JSON in request body' }, 400);
    }
    
    if (!body || !body.selected_categories || body.selected_categories.length === 0) {
      return jsonResponse({ detail: 'At least one category must be selected' }, 400);
    }

    const mallId = body.mall_id || 'sunway_square';
    const selectedCategories = body.selected_categories;

    // Get all restaurants in the selected categories for the specified mall
    const availableRestaurants = getRestaurantsByCategories(selectedCategories, mallId);

    if (availableRestaurants.length === 0) {
      return jsonResponse({ detail: 'No restaurants found in selected categories' }, 400);
    }

    // Random selection with equal probability
    const selectedRestaurant = availableRestaurants[Math.floor(Math.random() * availableRestaurants.length)];

    // Log the spin to Supabase database
    try {
      const supabase = createSupabaseClient(env);
      const { data: spinLog, error: dbError } = await supabase
        .from('spin_logs')
        .insert({
          restaurant_name: selectedRestaurant.name,
          restaurant_unit: selectedRestaurant.unit,
          restaurant_floor: selectedRestaurant.floor,
          category: selectedRestaurant.category,
          dietary_need: body.dietary_need || 'any',
          mall_id: mallId,
          selected_categories: JSON.stringify(selectedCategories),
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        // Continue even if database insert fails
      }

      return jsonResponse({
        restaurant_name: selectedRestaurant.name,
        restaurant_unit: selectedRestaurant.unit,
        restaurant_floor: selectedRestaurant.floor,
        category: selectedRestaurant.category,
        timestamp: spinLog?.timestamp || new Date().toISOString(),
        spin_id: spinLog?.id || null,
        logo: selectedRestaurant.logo
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Return result even if database insert fails
      return jsonResponse({
        restaurant_name: selectedRestaurant.name,
        restaurant_unit: selectedRestaurant.unit,
        restaurant_floor: selectedRestaurant.floor,
        category: selectedRestaurant.category,
        timestamp: new Date().toISOString(),
        spin_id: null,
        logo: selectedRestaurant.logo
      });
    }
  } catch (error) {
    console.error('Error in spin endpoint:', error);
    return jsonResponse({
      error: 'Internal server error',
      message: error.message,
    }, 500);
  }
}

