import React from 'react';
import { Shield, Sparkles, Brain, Trophy, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Upgrade: React.FC = () => {
  const { user } = useAuth();

  const handleSubscribe = () => {
    // In a real app, this would be your Stripe Payment Link.
    // We pass the user's UUID as the client_reference_id so the webhook knows who paid.
    const stripeLink = `https://buy.stripe.com/test_123?client_reference_id=${user?.id}`;
    window.location.href = stripeLink;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl mb-4">
          Unlock Your Full Potential
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto">
          Go Premium to access advanced AI tools, exclusive learning modes, and powerful gamification features.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto items-start">
        {/* Features List */}
        <div className="space-y-6">
          <div className="flex items-start space-x-4 p-4 rounded-xl bg-surface border border-border">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ink text-lg">AI Mnemonic Generator</h3>
              <p className="text-muted text-sm mt-1">Get custom, memorable stories for the characters you struggle with most, generated instantly by AI.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-xl bg-surface border border-border">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ink text-lg">AI Weakness Coach</h3>
              <p className="text-muted text-sm mt-1">A smart tutor that targets your 5 weakest characters with dynamic, contextual stories and quizzes.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-xl bg-surface border border-border">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ink text-lg">Streak Shields</h3>
              <p className="text-muted text-sm mt-1">Life happens. Get 2 automatic streak shields per month to protect your hard-earned progress if you miss a day.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-xl bg-surface border border-border">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ink text-lg">Expanded Kana City</h3>
              <p className="text-muted text-sm mt-1">Unlock Katakana and mixed districts in the spatial memory palace. Level up your mastery.</p>
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="p-8 rounded-2xl bg-paper border-2 border-primary-500 shadow-glow relative">
          <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm">
            Most Popular
          </div>
          
          <h2 className="text-2xl font-bold text-ink text-center mb-2">Premium Mastery</h2>
          <div className="flex justify-center items-end space-x-1 mb-6">
            <span className="text-5xl font-extrabold text-ink">$4.99</span>
            <span className="text-muted font-medium pb-1">/ month</span>
          </div>

          <ul className="space-y-4 mb-8 text-sm">
            <li className="flex items-center space-x-3 text-ink">
              <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
              <span>Everything in Free</span>
            </li>
            <li className="flex items-center space-x-3 text-ink">
              <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
              <span>AI Mnemonic Generator</span>
            </li>
            <li className="flex items-center space-x-3 text-ink">
              <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
              <span>AI Weakness Coach</span>
            </li>
            <li className="flex items-center space-x-3 text-ink">
              <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
              <span>2 Streak Shields / month</span>
            </li>
            <li className="flex items-center space-x-3 text-ink">
              <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
              <span>Full Katakana City Districts</span>
            </li>
          </ul>

          <button 
            onClick={handleSubscribe}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg hover:shadow-glow hover:scale-[1.02] transition-all"
          >
            Start Premium Trial
          </button>
          <p className="text-center text-xs text-muted mt-4">
            Cancel anytime. Secure payment via Stripe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
