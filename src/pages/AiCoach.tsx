import React, { useState, useMemo } from 'react';
import { useProgressStore } from '../contexts/ProgressContext';
import { PaywallGuard } from '../components/PaywallGuard';
import { Sparkles, BrainCircuit, Target, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { getAllKana } from '../data/kanaData';

const AiCoach: React.FC = () => {
  const { state } = useProgressStore();
  const [mnemonicChar, setMnemonicChar] = useState<string>('a');
  const [mnemonicResult, setMnemonicResult] = useState<string | null>(null);
  const [loadingMnemonic, setLoadingMnemonic] = useState(false);

  const [weaknessSummary, setWeaknessSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const allKana = useMemo(() => getAllKana(), []);

  const weakestChars = useMemo(() => {
    return Object.values(state.characterProgress)
      .filter((c) => c.seen > 0)
      .sort((a, b) => (a.correct / a.seen) - (b.correct / b.seen))
      .slice(0, 5)
      .map((c) => {
        const kana = allKana.find(k => k.id === c.characterId);
        return kana ? kana.character : c.characterId;
      });
  }, [state.characterProgress, allKana]);

  const generateMnemonic = async () => {
    if (!supabase) return;
    setLoadingMnemonic(true);
    setMnemonicResult(null);
    try {
      const kanaObj = allKana.find(k => k.id === mnemonicChar);
      const charStr = kanaObj ? `${kanaObj.character} (${kanaObj.romaji})` : mnemonicChar;
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: { action: 'mnemonic', character: charStr },
      });
      if (error) throw error;
      setMnemonicResult(data.result);
    } catch (err) {
      console.error(err);
      setMnemonicResult("Sensei's mind is clouded right now. Try again later.");
    } finally {
      setLoadingMnemonic(false);
    }
  };

  const generateSummary = async () => {
    if (!supabase) return;
    setLoadingSummary(true);
    setWeaknessSummary(null);
    try {
      const weakStr = weakestChars.join(', ') || 'none';
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: { action: 'weakness', weakCharacters: weakStr },
      });
      if (error) throw error;
      setWeaknessSummary(data.result);
    } catch (err) {
      console.error(err);
      setWeaknessSummary("Could not analyze your weaknesses at this time.");
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <PaywallGuard featureName="AI Coach">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="flex items-center justify-center text-4xl font-extrabold text-ink">
            <BrainCircuit className="mr-3 h-10 w-10 text-primary-500" />
            AI Language Coach
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            Leverage Groq-powered AI to identify your weakness patterns and generate unforgettable mnemonic stories.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          
          {/* Weakness Coach */}
          <div className="bg-surface border border-border rounded-3xl p-8 shadow-soft relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Target className="w-32 h-32 text-primary-900" />
            </div>
            <h2 className="text-2xl font-bold text-ink mb-2">Weakness Pattern Analysis</h2>
            <p className="text-muted mb-6">Let the AI analyze your accuracy data to find hidden patterns in your mistakes.</p>
            
            <div className="mb-6">
              <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">Your Top 5 Struggles</h3>
              <div className="flex flex-wrap gap-2">
                {weakestChars.length > 0 ? weakestChars.map(char => (
                  <span key={char} className="w-12 h-12 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center text-2xl font-japanese shadow-sm">
                    {char}
                  </span>
                )) : (
                  <span className="text-muted italic">Not enough data yet. Complete some quizzes!</span>
                )}
              </div>
            </div>

            <button
              onClick={generateSummary}
              disabled={loadingSummary || weakestChars.length === 0}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center shadow-md transition-all active:scale-95"
            >
              {loadingSummary ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Analyze My Weaknesses'}
            </button>

            {weaknessSummary && (
              <div className="mt-6 p-5 bg-indigo-50 border border-indigo-100 rounded-xl">
                <h4 className="font-bold text-indigo-900 mb-2 flex items-center"><Sparkles className="w-4 h-4 mr-2 text-indigo-500" /> AI Insight</h4>
                <p className="text-indigo-800 leading-relaxed">{weaknessSummary}</p>
              </div>
            )}
          </div>

          {/* Mnemonic Generator */}
          <div className="bg-surface border border-border rounded-3xl p-8 shadow-soft relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles className="w-32 h-32 text-secondary-900" />
            </div>
            <h2 className="text-2xl font-bold text-ink mb-2">Mnemonic Generator</h2>
            <p className="text-muted mb-6">Select any character you struggle with and get a vivid story to burn it into memory.</p>
            
            <div className="mb-6">
              <label className="text-sm font-bold text-muted uppercase tracking-wider mb-3 block">Select Character</label>
              <select 
                value={mnemonicChar}
                onChange={(e) => setMnemonicChar(e.target.value)}
                className="w-full bg-paper border border-border rounded-xl p-4 text-lg text-ink focus:ring-2 focus:ring-secondary-500 outline-none"
              >
                {allKana.map(k => (
                  <option key={k.id} value={k.id}>{k.character} ({k.romaji}) {k.type === 'hiragana' ? ' - Hiragana' : ' - Katakana'}</option>
                ))}
              </select>
            </div>

            <button
              onClick={generateMnemonic}
              disabled={loadingMnemonic}
              className="w-full py-4 bg-secondary-600 hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center shadow-md transition-all active:scale-95"
            >
              {loadingMnemonic ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Generate Story'}
            </button>

            {mnemonicResult && (
              <div className="mt-6 p-5 bg-emerald-50 border border-emerald-100 rounded-xl">
                <h4 className="font-bold text-emerald-900 mb-2 flex items-center"><Sparkles className="w-4 h-4 mr-2 text-emerald-500" /> Memory Story</h4>
                <p className="text-emerald-800 leading-relaxed italic">"{mnemonicResult}"</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </PaywallGuard>
  );
};

export default AiCoach;
