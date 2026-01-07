// POST /api/vouchers/spin
// Demo: Far Coffee RM10 voucher spin (guaranteed win if stock available + before expiry)

import { createCORSResponse, jsonResponse } from '../lib/cors.js';
import { spinFarCoffeeVoucher } from '../lib/farCoffeeVoucher.js';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return createCORSResponse();
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ detail: 'Invalid JSON in request body' }, 400);
  }

  const userId = body?.user_id;
  if (!userId) return jsonResponse({ detail: 'user_id is required' }, 400);

  try {
    // Check if DB binding exists
    if (!env.DB) {
      console.error('Missing D1 database binding. env.DB is undefined.');
      return jsonResponse({ 
        error: 'Database not configured', 
        message: 'D1 database binding is missing. Please configure it in Cloudflare Pages Settings > Functions > D1 Database bindings.',
        hint: 'Variable name should be "DB" and database should be "wheeleat-db"'
      }, 500);
    }

    const nowMs = Date.now();
    const out = await spinFarCoffeeVoucher(env, String(userId), nowMs);
    return jsonResponse(out);
  } catch (e) {
    console.error('Voucher spin error:', e);
    console.error('Error stack:', e.stack);
    return jsonResponse({ 
      error: 'Internal server error', 
      message: e.message,
      hint: e.message?.includes('Missing D1 database binding') 
        ? 'Please configure D1 database binding in Cloudflare Pages Settings > Functions'
        : 'Check Cloudflare Pages logs for more details'
    }, 500);
  }
}


