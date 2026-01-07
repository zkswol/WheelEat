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
    const nowMs = Date.now();
    const out = await spinFarCoffeeVoucher(env, String(userId), nowMs);
    return jsonResponse(out);
  } catch (e) {
    console.error('Voucher spin error:', e);
    return jsonResponse({ error: 'Internal server error', message: e.message }, 500);
  }
}


