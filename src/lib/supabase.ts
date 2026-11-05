import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string) ?? '';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ?? '';

/** Only true when both URL and key are set (non-empty). */
export const isSupabaseConfigured =
  typeof supabaseUrl === 'string' &&
  typeof supabaseAnonKey === 'string' &&
  supabaseUrl.length > 0 &&
  supabaseAnonKey.length > 0;

// Fail fast in production if Supabase not configured
if (import.meta.env.PROD && !isSupabaseConfigured) {
  console.error('❌ CRITICAL: Supabase credentials not configured!');
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
  throw new Error('Supabase credentials are required in production');
}

const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDB9.placeholder'
);

export { supabase };
