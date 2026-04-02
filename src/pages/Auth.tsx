import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Eye, EyeOff, Github } from 'lucide-react';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters.')
    .max(100, 'Password is too long.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.'),
});

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
);

const Auth: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/learn';

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (user) {
    return <Navigate to={from} replace />;
  }

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

  const checkRateLimit = () => {
    const lockoutUntil = parseInt(localStorage.getItem('auth_lockout_until') || '0', 10);
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingMinutes = Math.ceil((lockoutUntil - Date.now()) / 60000);
      setGlobalError(`Too many failed attempts. Try again in ${remainingMinutes} minute(s).`);
      return false;
    }
    if (lockoutUntil && Date.now() > lockoutUntil) {
      localStorage.removeItem('auth_attempts');
      localStorage.removeItem('auth_lockout_until');
    }
    return true;
  };

  const recordFailedAttempt = () => {
    const attempts = parseInt(localStorage.getItem('auth_attempts') || '0', 10) + 1;
    localStorage.setItem('auth_attempts', attempts.toString());
    if (attempts >= MAX_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_TIME;
      localStorage.setItem('auth_lockout_until', lockoutUntil.toString());
      return `Too many failed attempts. Try again in 15 minute(s).`;
    }
    return null;
  };

  const clearFailedAttempts = () => {
    localStorage.removeItem('auth_attempts');
    localStorage.removeItem('auth_lockout_until');
  };

  const validateForm = () => {
    try {
      const sanitizedEmail = DOMPurify.sanitize(email);
      
      const errors: Record<string, string> = {};
      let isValid = true;
      
      try {
        authSchema.parse({ email: sanitizedEmail, password });
      } catch (errRaw: unknown) {
        const error = errRaw as any;
        if (error && error.errors) {
          error.errors.forEach((err: any) => {
            if (err.path && err.path[0]) {
              errors[err.path[0] as string] = err.message;
            }
          });
          isValid = false;
        }
      }

      if (!isLogin) {
        if (!confirmPassword) {
          errors.confirmPassword = 'Please confirm your password.';
          isValid = false;
        } else if (password !== confirmPassword) {
          errors.confirmPassword = 'Passwords do not match.';
          isValid = false;
        }
      }

      setFieldErrors(errors);
      return isValid;
    } catch (e) {
       return false;
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    if (!supabase) return;
    try {
      await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin + from } });
    } catch (err) {
      if (err instanceof Error) setGlobalError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setGlobalError('Database configuration is missing. Check .env variables.');
      return;
    }
    
    if (!checkRateLimit()) return;
    if (!validateForm()) return;

    setLoading(true);
    setGlobalError(null);

    try {
      const sanitizedEmail = DOMPurify.sanitize(email);
      
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: sanitizedEmail, password });
        if (error) {
          const lockoutMsg = recordFailedAttempt();
          if (lockoutMsg) throw new Error(lockoutMsg);
          throw error;
        }
        clearFailedAttempts();
        navigate(from, { replace: true });
      } else {
        const { error } = await supabase.auth.signUp({ email: sanitizedEmail, password });
        if (error) throw error;
        navigate(from, { replace: true });
      }
    } catch (err) {
      if (err instanceof Error) {
        setGlobalError(err.message);
      } else {
        setGlobalError('An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setGlobalError(null);
    setFieldErrors({});
    setPassword('');
    setConfirmPassword('');
  };

  const shakeAnimation = {
    x: [-10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center bg-paper overflow-hidden px-4 py-8">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-warm-gradient opacity-60 mix-blend-multiply" />
      <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-300 opacity-20 blur-3xl filter" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-amber-200 opacity-20 blur-3xl filter" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-surface p-8 shadow-paper"
      >
        <div className="mb-8 text-center group">
          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-6 cursor-help transition-all duration-300">
            <motion.div 
              className="absolute inset-0 rounded-full bg-primary-400 opacity-0 group-hover:opacity-40 blur-lg transition-opacity duration-500"
            />
            <span className="relative font-japanese text-3xl font-bold z-10">扉</span>
            
            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
              扉 (Door) — Your gateway to Japanese mastery
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
          
          <h2 className="text-3xl font-display font-bold text-ink">
            {isLogin ? 'Welcome back 👋' : 'Start your Nihongo journey 🇯🇵'}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {isLogin 
              ? 'Continue your Japanese learning streak.' 
              : 'Build streaks. Learn faster. Stay consistent.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {globalError && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24, ...shakeAnimation }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden rounded-xl bg-red-50 p-4 text-sm text-red-800 border border-red-200 flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
              <p>{globalError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <motion.div animate={fieldErrors.email ? shakeAnimation : {}} className="space-y-1">
            <label className="text-sm font-semibold text-muted pl-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors({ ...fieldErrors, email: '' }); }}
                onBlur={() => { if(!email) setFieldErrors({...fieldErrors, email: 'Email is required.'}) }}
                className={`w-full rounded-2xl bg-gray-900 py-3.5 pl-12 pr-4 text-gray-200 placeholder-gray-500 transition-all border ${fieldErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-[3px] focus:ring-red-500/20' : 'border-white/10 focus:border-amber-500 focus:ring-[3px] focus:ring-amber-500/20'} focus:outline-none`}
                placeholder="you@example.com"
              />
            </div>
            {fieldErrors.email && (
              <p className="pl-1 text-xs text-red-500">{fieldErrors.email}</p>
            )}
          </motion.div>

          <motion.div animate={fieldErrors.password ? shakeAnimation : {}} className="space-y-1">
            <label className="text-sm font-semibold text-muted pl-1" htmlFor="password">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors({ ...fieldErrors, password: '' }); }}
                className={`w-full rounded-2xl bg-gray-900 py-3.5 pl-12 pr-12 text-gray-200 placeholder-gray-500 transition-all border ${fieldErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-[3px] focus:ring-red-500/20' : 'border-white/10 focus:border-amber-500 focus:ring-[3px] focus:ring-amber-500/20'} focus:outline-none`}
                placeholder={isLogin ? '••••••••' : 'Min. 6 characters'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {fieldErrors.password ? (
              <p className="pl-1 text-xs text-red-500">{fieldErrors.password}</p>
            ) : isLogin ? (
              <div className="flex justify-end mt-1">
                <button type="button" className="text-xs font-medium text-muted hover:text-primary-600 transition-colors">
                  Forgot password?
                </button>
              </div>
            ) : null}
          </motion.div>

          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <motion.div animate={fieldErrors.confirmPassword ? shakeAnimation : {}} className="space-y-1">
                  <label className="text-sm font-semibold text-muted pl-1" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors({ ...fieldErrors, confirmPassword: '' }); }}
                      className={`w-full rounded-2xl bg-gray-900 py-3.5 pl-12 pr-12 text-gray-200 placeholder-gray-500 transition-all border ${fieldErrors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-[3px] focus:ring-red-500/20' : 'border-white/10 focus:border-amber-500 focus:ring-[3px] focus:ring-amber-500/20'} focus:outline-none`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="pl-1 text-xs text-red-500">{fieldErrors.confirmPassword}</p>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="group mt-8 flex w-full items-center justify-center space-x-2 rounded-2xl bg-amber-500 px-6 py-4 text-sm font-bold text-white shadow-soft transition hover:bg-amber-600 focus:outline-none focus:ring-[3px] focus:ring-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
              </>
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
        </form>

        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-surface px-4 text-muted border border-border rounded-full py-0.5">OR</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOAuth('google')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-paper-2 focus:outline-none focus:ring-[3px] focus:ring-border group"
          >
            <div className="text-gray-500 group-hover:text-primary-600 transition-colors">
                <GoogleIcon />
            </div>
            <span>Google</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOAuth('github')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-paper-2 focus:outline-none focus:ring-[3px] focus:ring-border group"
          >
            <Github className="h-5 w-5 text-gray-500 group-hover:text-ink transition-colors" />
            <span>GitHub</span>
          </motion.button>
        </div>

        <div className="mt-8 text-center text-sm text-muted">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={toggleAuthMode}
            className="font-bold text-amber-600 hover:text-amber-700 transition underline-offset-4 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
