import React, { useState } from 'react';
import { useProgressStore } from '../contexts/ProgressContext';
import { HIRAGANA_DISTRICTS } from '../data/kanaDistricts';
import { PaywallGuard } from '../components/PaywallGuard';
import { Map, Lock, CheckCircle, PlayCircle, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const KanaCity: React.FC = () => {
  const { state } = useProgressStore();
  const [npcDialogue, setNpcDialogue] = useState<string | null>(null);
  const [loadingNpc, setLoadingNpc] = useState(false);

  // Evaluate active properties iteratively.
  // 1 is always unlocked.
  // A district is 'mastered' if all its characters have seen >= 20 and correct/seen >= 0.9.
  // (In a real app tracking last 20, we'd use a rolling window array. We approximate for MVP).
  const checkMastery = (kanaGroup: string[]) => {
    if (kanaGroup.length === 0) return false;
    return kanaGroup.every((k) => {
      const prog = state.characterProgress[k];
      if (!prog) return false;
      if (prog.seen < 20) return false;
      return (prog.correct / prog.seen) >= 0.9;
    });
  };

  const getDistrictStatus = (order: number, kanaGroup: string[]) => {
    // If order is 1, it's at least active.
    const isMastered = checkMastery(kanaGroup);
    if (isMastered) return 'mastered';

    if (order === 1) return 'active';

    // A district is active if the previous one is mastered.
    const prevDistrict = HIRAGANA_DISTRICTS.find((d) => d.order === order - 1);
    if (prevDistrict && checkMastery(prevDistrict.kanaGroup)) {
      return 'active';
    }

    return 'locked';
  };

  const speakToNpc = async () => {
    if (!supabase) return;
    setLoadingNpc(true);
    try {
      // Get the 5 weakest characters from state
      const weakest = Object.values(state.characterProgress)
        .filter((c) => c.seen > 0)
        .sort((a, b) => (a.correct / a.seen) - (b.correct / b.seen))
        .slice(0, 5)
        .map((c) => c.characterId)
        .join(', ');

      const { data, error } = await supabase.functions.invoke('kana-npc', {
        body: { weakCharacters: weakest || 'none yet' },
      });

      if (error) throw error;
      setNpcDialogue(data.dialogue);
    } catch (err) {
      console.error(err);
      setNpcDialogue("The spirits of the city are quiet right now...");
    } finally {
      setLoadingNpc(false);
    }
  };

  return (
    <PaywallGuard featureName="Kana City">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="flex items-center text-3xl font-extrabold text-ink sm:text-4xl">
              <Map className="mr-3 h-8 w-8 text-primary-500" />
              Kana City
            </h1>
            <p className="mt-2 text-lg text-muted">
              Your spatial memory palace. Master districts to unlock the map.
            </p>
          </div>
          <button
            onClick={speakToNpc}
            disabled={loadingNpc}
            className="flex items-center space-x-2 rounded-xl bg-surface px-4 py-2 border border-border hover:bg-paper2 transition-colors shadow-sm"
          >
            <MessageSquare className="h-5 w-5 text-indigo-500" />
            <span className="font-medium text-ink">{loadingNpc ? 'Approaching NPC...' : 'Talk to a local'}</span>
          </button>
        </div>

        {npcDialogue && (
          <div className="mb-8 rounded-xl bg-indigo-50 p-6 border border-indigo-100 shadow-soft relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 rounded-l-xl"></div>
            <h3 className="font-bold text-indigo-900 mb-2">Wandering Sensei says:</h3>
            <p className="text-indigo-800 italic leading-relaxed text-lg">{npcDialogue}</p>
            <button 
              onClick={() => setNpcDialogue(null)}
              className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Bow and walk away
            </button>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HIRAGANA_DISTRICTS.map((district) => {
            const status = getDistrictStatus(district.order, district.kanaGroup);
            
            const isMastered = status === 'mastered';
            const isActive = status === 'active';
            const isLocked = status === 'locked';

            const bgClass = isMastered 
              ? 'bg-green-50 border-green-500' 
              : isActive 
                ? 'bg-blue-50 border-blue-500' 
                : 'bg-surface border-border opacity-75 grayscale';

            return (
              <div 
                key={district.id} 
                className={`relative overflow-hidden rounded-2xl border-2 p-6 transition-all ${bgClass} ${isLocked ? 'cursor-not-allowed' : 'hover:shadow-glow hover:-translate-y-1'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className={`text-xl font-bold ${isMastered ? 'text-green-900' : isActive ? 'text-blue-900' : 'text-muted'}`}>
                    {district.name}
                  </h3>
                  {isMastered && <CheckCircle className="h-6 w-6 text-green-500" />}
                  {isActive && <PlayCircle className="h-6 w-6 text-blue-500" />}
                  {isLocked && <Lock className="h-6 w-6 text-muted" />}
                </div>
                <p className={`mb-4 text-sm ${isMastered ? 'text-green-800' : isActive ? 'text-blue-800' : 'text-muted'}`}>
                  {district.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {district.kanaGroup.map((kana) => (
                    <span 
                      key={kana} 
                      className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium ${
                        isMastered ? 'bg-green-200 text-green-900' : isActive ? 'bg-blue-200 text-blue-900' : 'bg-border text-muted'
                      }`}
                    >
                      {kana}
                    </span>
                  ))}
                </div>
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-paper/50 backdrop-blur-sm">
                    <p className="font-bold text-muted flex items-center shadow-sm bg-surface px-4 py-2 rounded-full border border-border">
                      <Lock className="h-4 w-4 mr-2" />
                      Locked
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PaywallGuard>
  );
};

export default KanaCity;
