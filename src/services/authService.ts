import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface LoginCredentials {
  email: string;
  password: string;
}

export async function signIn(credentials: LoginCredentials) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Sign in error:', err);
    throw err;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (err) {
    console.error('Sign out error:', err);
    throw err;
  }
}

export async function getSession() {
  if (!isSupabaseConfigured) return null;
  
  try {
    // Skip refreshing session on page reload to avoid lock timeouts
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error && error.message?.includes('timed out')) {
      console.warn('Session fetch timed out, using null session');
      return null;
    }
    if (error) throw error;
    return session;
  } catch (err) {
    console.warn('Failed to get session:', err);
    return null;
  }
}

export async function isAdmin(userId: string): Promise<boolean> {
  try {
    // Add a timeout wrapper to prevent hanging
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Admin check timeout')), 5000)
    );

    const checkPromise = supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .single();

    const { data } = await Promise.race([checkPromise, timeoutPromise]) as { data: { id: string } | null };
    return !!data;
  } catch (err) {
    // On any error (including timeout), default to false
    // This prevents locking up the UI
    console.warn('Failed to check admin status:', err);
    return false;
  }
}

export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  if (!isSupabaseConfigured) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  return supabase.auth.onAuthStateChange(callback);
}
