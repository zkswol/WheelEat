// CORS helper for Cloudflare Pages Functions
// This ensures CORS headers are ALWAYS set

export function setCORSHeaders(headers) {
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  headers.set('Access-Control-Max-Age', '86400');
}

export function createCORSResponse() {
  const headers = new Headers();
  setCORSHeaders(headers);
  return new Response(null, { status: 200, headers });
}

export function jsonResponse(data, status = 200) {
  const headers = new Headers();
  setCORSHeaders(headers);
  headers.set('Content-Type', 'application/json');
  return new Response(JSON.stringify(data), { status, headers });
}

