// GET /api/users
// Example endpoint that connects to Supabase and returns data

import { createSupabaseClient } from './lib/supabase.js';
import { createCORSResponse, jsonResponse } from './lib/cors.js';

export async function onRequest(context) {
  const { request, env } = context;

  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return createCORSResponse();
  }

  // Only allow GET requests
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    // Query Supabase for users
    const supabase = createSupabaseClient(env);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(10); // Limit to 10 results for demo

    if (error) {
      console.error('Supabase error:', error);
      return jsonResponse({
        error: 'Database error',
        message: error.message,
        hint: 'Make sure the "users" table exists in Supabase',
      }, 500);
    }

    return jsonResponse({
      success: true,
      count: data ? data.length : 0,
      users: data || [],
    });
  } catch (error) {
    console.error('API error:', error);
    return jsonResponse({
      error: 'Internal server error',
      message: error.message,
    }, 500);
  }
}

