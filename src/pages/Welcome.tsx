import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle2, ChevronRight, Trophy } from 'lucide-react';
import posthog from 'posthog-js';

const Welcome: React.FC = () => {
  const [step, setStep] = useState(1);
  const [script, setScript] = useState<'hiragana' | 'katakana'>('hiragana');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const finishOnboarding = async () => {
    if (user && supabase) {
      await supabase
        .from('user_profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
    }
    posthog.capture('onboarding_completed');
    navigate('/upgrade');
  };

  const currentProgress = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-soft p-8 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1.5 bg-border">
          <div 
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500" 
            style={{ width: currentProgress + '%' }}
          />
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-3xl font-extrabold text-ink text-center">What do you want to learn?</h1>
            <p className="text-muted text-center">Choose a script to start your journey.</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { setScript('hiragana'); handleNext(); }}
                className="p-6 border-2 border-border hover:border-primary-500 rounded-xl bg-paper hover:bg-primary-50 transition-colors flex flex-col items-center gap-3"
              >
                <span className="text-5xl font-japanese text-primary-600">あ</span>
                <span className="font-bold text-ink">Hiragana</span>
              </button>
              <button 
                onClick={() => { setScript('katakana'); handleNext(); }}
                className="p-6 border-2 border-border hover:border-primary-500 rounded-xl bg-paper hover:bg-primary-50 transition-colors flex flex-col items-center gap-3"
              >
                <span className="text-5xl font-japanese text-primary-600">ア</span>
                <span className="font-bold text-ink">Katakana</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-3xl font-extrabold text-ink text-center">Proficiency Check</h1>
            <p className="text-muted text-center">Let's see what you already know about {script}.</p>
            <div className="p-8 border border-border rounded-xl bg-paper text-center">
              <p className="text-xl font-medium mb-6 text-ink">Can you read this character?</p>
              <div className="text-6xl font-japanese text-primary-600 mb-8">{script === 'hiragana' ? 'か' : 'カ'}</div>
              <div className="grid grid-cols-2 gap-4">
                {['sa', 'ka', 'ta', 'na'].map(opt => (
                  <button 
                    key={opt}
                    onClick={handleNext}
                    className="py-3 px-4 bg-surface border border-border rounded-lg hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 transition-colors font-medium"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-3xl font-extrabold text-ink text-center">Your First Win</h1>
            <p className="text-muted text-center">You're a natural! Let's lock in your first 5 characters.</p>
            <div className="flex justify-center flex-wrap gap-3 my-8">
              {['a', 'i', 'u', 'e', 'o'].map(k => (
                <div key={k} className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xl font-bold shadow-sm">
                  {k}
                </div>
              ))}
            </div>
            <button 
              onClick={handleNext}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-soft transition-all hover:scale-[1.02]"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-ink">Ready to Master Japanese?</h1>
            <p className="text-muted max-w-md mx-auto">
              Unlock <strong>Kana City</strong>, our spatial memory palace, and get AI-powered mnemonic stories tailored to your weak points. 
            </p>
            
            <div className="bg-paper p-6 rounded-xl border-2 border-primary-500 my-8 text-left space-y-4 shadow-glow">
              <h3 className="font-bold text-lg text-ink">Premium unlocks:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-ink"><CheckCircle2 className="w-4 h-4 text-primary-500" /> Full Kana City Districts (Hiragana & Katakana)</li>
                <li className="flex items-center gap-2 text-sm text-ink"><CheckCircle2 className="w-4 h-4 text-primary-500" /> AI Weakness Coach & Mnemonic Generator</li>
                <li className="flex items-center gap-2 text-sm text-ink"><CheckCircle2 className="w-4 h-4 text-primary-500" /> Weekly Challenges & 2x Streak Shields</li>
              </ul>
            </div>

            <button 
              onClick={finishOnboarding}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90 text-white rounded-xl font-bold text-lg shadow-glow transition-all hover:-translate-y-1"
            >
              Start My Premium Trial
            </button>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 text-sm text-muted hover:text-ink font-medium"
            >
              Continue to free version
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Welcome;
