// POST /api/vouchers/remove
// Remove (release) a Far Coffee user voucher and restock by +1.

import { createCORSResponse, jsonResponse } from '../lib/cors.js';
import { removeFarCoffeeUserVoucher } from '../lib/farCoffeeVoucher.js';

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
  const userVoucherId = body?.user_voucher_id;
  if (!userId || !userVoucherId) {
    return jsonResponse({ detail: 'user_id and user_voucher_id are required' }, 400);
  }

  try {
    const out = await removeFarCoffeeUserVoucher(env, String(userId), String(userVoucherId), Date.now());
    return jsonResponse(out);
  } catch (e) {
    console.error('Voucher remove error:', e);
    return jsonResponse({ error: 'Internal server error', message: e.message }, 500);
  }
}


