import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { signIn, signOut, isAdmin, onAuthStateChange } from '../services/authService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdminUser: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isUnmounted = false;

    // Use onAuthStateChange to avoid lock contention from concurrent getSession/refreshSession
    try {
      const { data: { subscription } } = onAuthStateChange(async (_event, s) => {
        if (!isUnmounted) {
          const sess = s as Session | null;
          setSession(sess);
          setUser(sess?.user ?? null);
          if (sess?.user) {
            try {
              const admin = await isAdmin(sess.user.id);
              if (!isUnmounted) setIsAdminUser(admin);
            } catch (err) {
              if (!isUnmounted) {
                console.warn('Failed to check admin status:', err);
                setIsAdminUser(false);
              }
            }
          } else {
            setIsAdminUser(false);
          }
          if (!isUnmounted) setLoading(false);
        }
      });

      return () => {
        isUnmounted = true;
        subscription.unsubscribe();
      };
    } catch (err) {
      // Supabase not configured
      setLoading(false);
      return () => {
        isUnmounted = true;
      };
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: u } = await signIn({ email, password });
      setUser(u);
      // Don't check admin status here - it will cause lock contention
      // The RLS policies will prevent non-admins from accessing admin features
      // Admin status will be loaded from onAuthStateChange listener
      setIsAdminUser(false); // Default to false, will be updated by listener
    } catch (err) {
      // Reset state on login failure
      setUser(null);
      setIsAdminUser(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } finally {
      setUser(null);
      setSession(null);
      setIsAdminUser(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdminUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
