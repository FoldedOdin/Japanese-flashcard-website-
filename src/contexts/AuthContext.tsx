import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import * as Sentry from '@sentry/react';
import posthog from 'posthog-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  onboardingCompleted: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  onboardingCompleted: false,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const handleUserUpdate = async (currentUser: User | null) => {
      setUser(currentUser);
      
      if (currentUser) {
        Sentry.setUser({ id: currentUser.id, email: currentUser.email });
        posthog.identify(currentUser.id, { email: currentUser.email });

        // Fetch subscription status
        if (supabase) {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('onboarding_completed')
            .eq('id', currentUser.id)
            .maybeSingle();
            
          if (data && !error) {
            setOnboardingCompleted(data.onboarding_completed || false);
          } else {
            console.warn("Could not fetch profile (likely missing columns). Falling back to local storage.", error);
            setOnboardingCompleted(localStorage.getItem('onboarding_fallback') === 'true');
          }
        }
      } else {
        Sentry.setUser(null);
        posthog.reset();
        setOnboardingCompleted(false);
      }
    };

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      try {
        setSession(session);
        await handleUserUpdate(session?.user ?? null);
      } finally {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        setSession(session);
        await handleUserUpdate(session?.user ?? null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, onboardingCompleted, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
