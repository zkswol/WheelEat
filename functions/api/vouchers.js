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
    const out = await listFarCoffeeUserVouchers(env, String(userId), Date.now());
    return jsonResponse(out);
  } catch (e) {
    console.error('Voucher list error:', e);
    return jsonResponse({ error: 'Internal server error', message: e.message }, 500);
  }
}


