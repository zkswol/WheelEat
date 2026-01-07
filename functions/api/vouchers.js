// GET /api/vouchers?user_id=...
// List Far Coffee vouchers for a user (and lazily expire/restock expired vouchers).

import { createCORSResponse, jsonResponse } from './lib/cors.js';
import { listFarCoffeeUserVouchers } from './lib/farCoffeeVoucher.js';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return createCORSResponse();
  if (request.method !== 'GET') return jsonResponse({ error: 'Method not allowed' }, 405);

  const url = new URL(request.url);
  const userId = url.searchParams.get('user_id');
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

    const out = await listFarCoffeeUserVouchers(env, String(userId), Date.now());
    return jsonResponse(out);
  } catch (e) {
    console.error('Voucher list error:', e);
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


