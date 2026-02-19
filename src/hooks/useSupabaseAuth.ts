import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export interface AuthState {
  user: User | null;
  isReady: boolean;
}

export const useSupabaseAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isReady: false,
  });

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setState({ user: null, isReady: true });
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setState({ user: data.session?.user ?? null, isReady: true });
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setState({ user: session?.user ?? null, isReady: true });
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error('Supabase is not configured.');
    }
    return supabase.auth.signUp({ email, password });
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error('Supabase is not configured.');
    }
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    if (!supabase || !isSupabaseConfigured) {
      return;
    }
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error('Supabase is not configured.');
    }
    return supabase.auth.resetPasswordForEmail(email);
  };

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isSupabaseConfigured,
  };
};
