// GET /api/health
// Simple health check endpoint to verify the API is working

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
    return jsonResponse({
      status: 'ok',
      message: 'WheelEat API is running',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return jsonResponse({
      error: 'Internal server error',
      message: error.message,
    }, 500);
  }
}

