import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PaywallGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  featureName?: string;
}

export const PaywallGuard: React.FC<PaywallGuardProps> = ({ 
  children, 
  fallback,
  featureName = 'This feature'
}) => {
  const { subscriptionStatus, loading } = useAuth();

  if (loading) return null;

  if (subscriptionStatus === 'premium' || subscriptionStatus === 'trial') {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-paper rounded-2xl border border-border shadow-soft max-w-md mx-auto my-8">
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
        <Lock className="w-8 h-8 text-yellow-600" />
      </div>
      <h3 className="text-xl font-bold text-ink mb-2">Premium Required</h3>
      <p className="text-muted mb-6">
        {featureName} is only available to Premium subscribers. Upgrade to unlock powerful AI features and exclusive capabilities.
      </p>
      <Link 
        to="/upgrade"
        className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full shadow-soft hover:shadow-glow hover:scale-105 transition-all"
      >
        Upgrade to Premium
      </Link>
    </div>
  );
};
