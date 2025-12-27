// Supabase connection utility for Cloudflare Pages Functions
// This file handles connecting to Supabase PostgreSQL database

import { createClient } from '@supabase/supabase-js';

// Create Supabase client using environment variables
export function createSupabaseClient(env) {
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_ANON_KEY;

  // Validate environment variables
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Please set SUPABASE_URL and SUPABASE_ANON_KEY in Cloudflare Pages.'
    );
  }

  // Create and return Supabase client
  return createClient(supabaseUrl, supabaseKey);
}

