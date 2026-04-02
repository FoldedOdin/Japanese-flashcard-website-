import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, PenLine, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KanaCharacter } from '../types';
import FlashCard from '../components/FlashCard';
import ProgressBar from '../components/ProgressBar';
import WritingPractice from '../components/WritingPractice';
import ListeningPractice from '../components/ListeningPractice';
import { getAllKana, hiraganaData, katakanaData } from '../data/kanaData';
import { useProgressStore } from '../hooks/useProgressStore';

const Learn: React.FC = () => {
  const [scriptMode, setScriptMode] = useState<'hiragana' | 'katakana' | 'mixed'>('hiragana');
  const [tab, setTab] = useState<'learn' | 'review' | 'practice' | 'test'>('learn');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRomaji, setShowRomaji] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'writing' | 'listening'>('writing');
  const [sessionQueue, setSessionQueue] = useState<KanaCharacter[] | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, incorrect: 0 });
  const [reviewFlipped, setReviewFlipped] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<{ text: string, type: 'success' | 'warning' } | null>(null);
  const { state, recordAnswer, getDueCharacterIds } = useProgressStore();

  const currentData = useMemo(() => {
    if (scriptMode === 'hiragana') return hiraganaData;
    if (scriptMode === 'katakana') return katakanaData;
    return getAllKana();
  }, [scriptMode]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % currentData.length);
    setShowRomaji(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + currentData.length) % currentData.length);
    setShowRomaji(false);
  };

  const handleFlip = () => {
    setShowRomaji(!showRomaji);
  };

  const currentCharacter = sessionQueue ? sessionQueue[0] : currentData[currentIndex];

  const handleSessionAnswer = (grade: number) => {
    if (!sessionQueue || sessionQueue.length === 0) return;
    
    const char = sessionQueue[0];
    recordAnswer(char.id, grade);
    
    setSessionStats(prev => ({
      reviewed: prev.reviewed + 1,
      incorrect: prev.incorrect + (grade < 4 ? 1 : 0)
    }));

    if (grade === 5) setFeedbackToast({ text: 'Easy! +10 XP', type: 'success' });
    else if (grade === 4) setFeedbackToast({ text: 'Good! +5 XP', type: 'success' });
    else setFeedbackToast({ text: "Hard. We'll show this again soon.", type: 'warning' });
    
    setTimeout(() => setFeedbackToast(null), 2000);

    if (sessionQueue.length > 1) {
      setSessionQueue(sessionQueue.slice(1));
      setReviewFlipped(false);
    } else {
      setSessionQueue([]);
      setSessionCompleted(true);
    }
  };

  const startSession = () => {
    const queue = [...dueQueue, ...unseenQueue.slice(0, Math.max(0, state.settings.dailyGoal - dueQueue.length))].slice(0, state.settings.dailyGoal);
    setSessionQueue(queue);
    setSessionCompleted(false);
    setSessionStats({ reviewed: 0, incorrect: 0 });
    setTab('review');
    setReviewFlipped(false);
  };

  const handleModeChange = (nextMode: 'hiragana' | 'katakana' | 'mixed') => {
    setScriptMode(nextMode);
    setCurrentIndex(0);
    setShowRomaji(false);
    setReviewFlipped(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (tab === 'learn') {
        switch (e.key) {
          case 'ArrowLeft':
            goToPrevious();
            break;
          case 'ArrowRight':
            goToNext();
            break;
          case ' ':
            e.preventDefault();
            handleFlip();
            break;
        }
      } else if (tab === 'review' && sessionQueue && sessionQueue.length > 0 && !sessionCompleted) {
        if (e.key === ' ') {
          e.preventDefault();
          setReviewFlipped(!reviewFlipped);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRomaji, reviewFlipped, currentCharacter?.id, tab, sessionQueue, sessionCompleted]);

  const dueIds = getDueCharacterIds();
  const dueQueue = currentData.filter((char) => dueIds.includes(char.id));
  const unseenQueue = currentData.filter((char) => !state.characterProgress[char.id]);


  return (
    <div className="bg-paper min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <AnimatePresence>
        {feedbackToast && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg font-bold z-50 ${
              feedbackToast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-primary-500 text-white'
            }`}
          >
            {feedbackToast.text}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Visual Depth Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08),transparent)] pointer-events-none" />
      
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted">Today's Practice</p>
            <h1 className="mt-2 text-3xl font-semibold font-display text-ink">
              {dueQueue.length} reviews • {Math.min(5, unseenQueue.length)} new characters
            </h1>
            <button 
              onClick={startSession}
              disabled={dueQueue.length === 0 && unseenQueue.length === 0}
              className="mt-6 flex items-center justify-center space-x-2 rounded-2xl bg-amber-500 px-8 py-3.5 text-sm font-bold text-white shadow-soft transition hover:bg-amber-600 focus:outline-none focus:ring-[3px] focus:ring-amber-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span>Start Today's Session</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleModeChange('hiragana')}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                scriptMode === 'hiragana' ? 'bg-primary-500 text-white' : 'bg-paper2 text-muted'
              }`}
            >
              ひらがな
            </button>
            <button
              onClick={() => handleModeChange('katakana')}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                scriptMode === 'katakana' ? 'bg-primary-500 text-white' : 'bg-paper2 text-muted'
              }`}
            >
              カタカナ
            </button>
            <button
              onClick={() => handleModeChange('mixed')}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                scriptMode === 'mixed' ? 'bg-primary-500 text-white' : 'bg-paper2 text-muted'
              }`}
            >
              Mixed
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {[
            { id: 'learn', label: 'Learn (Cards)' },
            { id: 'review', label: 'Review (SRS)' },
            { id: 'practice', label: 'Practice' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as typeof tab)}
              className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                tab === item.id ? 'bg-secondary-500 text-white shadow-md' : 'bg-surface border border-border text-muted hover:text-ink hover:bg-paper2'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => window.location.pathname = '/quiz'}
            className="rounded-full px-6 py-2.5 text-sm font-bold transition-all bg-surface border border-border text-muted hover:text-ink hover:bg-paper2"
          >
            Test (Quiz)
          </button>
        </div>

        {tab === 'learn' && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-6">
                <button
                  onClick={goToPrevious}
                  className="rounded-full border border-border bg-surface p-3 text-muted shadow-soft hover:text-ink"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <FlashCard character={currentCharacter} showRomaji={showRomaji} onFlip={handleFlip} />
                <button
                  onClick={goToNext}
                  className="rounded-full border border-border bg-surface p-3 text-muted shadow-soft hover:text-ink"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="text-sm text-muted">Press space to flip, arrows to navigate.</div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
                <div className="text-sm uppercase tracking-[0.2em] text-muted">Character</div>
                <div className="mt-2 text-5xl font-japanese text-ink">{currentCharacter.character}</div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-muted">
                  <div>
                    <div className="text-xs uppercase">Romaji</div>
                    <div className="text-lg font-semibold text-ink">{currentCharacter.romaji}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase">Strokes</div>
                    <div className="text-lg font-semibold text-ink">{currentCharacter.strokeCount ?? 3}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase">Category</div>
                    <div className="text-lg font-semibold text-ink">{currentCharacter.category}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase">Type</div>
                    <div className="text-lg font-semibold text-ink capitalize">{currentCharacter.type}</div>
                  </div>
                </div>
              </div>
              <ProgressBar progress={state} total={getAllKana().length} title="Database Mastery" />
            </div>
          </div>
        )}

        {tab === 'review' && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
            {sessionCompleted ? (
              <div className="rounded-3xl border border-border bg-surface p-12 shadow-soft flex flex-col items-center text-center">
                <div className="h-20 w-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-display font-bold text-ink mb-2">🎉 Session Complete!</h2>
                <p className="text-muted mb-8 max-w-md">You've finished your daily reviews. Consistency is the key to mastering Japanese!</p>
                
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-10">
                  <div className="bg-paper2 border border-border rounded-2xl p-4 text-center">
                    <div className="text-3xl font-bold text-secondary-500">{sessionStats.reviewed}</div>
                    <div className="text-xs uppercase text-muted tracking-wider mt-1">Cards Reviewed</div>
                  </div>
                  <div className="bg-paper2 border border-border rounded-2xl p-4 text-center">
                    <div className="text-3xl font-bold text-amber-500">
                      {Math.round(((sessionStats.reviewed - sessionStats.incorrect) / Math.max(1, sessionStats.reviewed)) * 100)}%
                    </div>
                    <div className="text-xs uppercase text-muted tracking-wider mt-1">Accuracy</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setTab('learn')} className="px-6 py-3 rounded-full bg-surface border border-border text-ink font-semibold hover:bg-paper2 transition">
                    Browse Cards
                  </button>
                  <button onClick={() => window.location.pathname = '/quiz'} className="px-6 py-3 rounded-full bg-amber-500 text-white font-bold shadow-soft hover:bg-amber-600 transition">
                    Take a Quiz
                  </button>
                </div>
              </div>
            ) : sessionQueue && sessionQueue.length > 0 ? (
              <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Active Session
                  </div>
                  <div className="text-sm font-medium text-muted">
                    {sessionStats.reviewed} / {sessionStats.reviewed + sessionQueue.length} cards
                  </div>
                </div>
                
                <FlashCard
                  character={sessionQueue[0]}
                  showRomaji={reviewFlipped}
                  onFlip={() => setReviewFlipped(!reviewFlipped)}
                  onAnswer={handleSessionAnswer}
                />
                
                <div className="mt-8 text-sm text-muted text-center max-w-sm">
                  {reviewFlipped ? 'Use keyboard 1, 2, 3 to grade your memory.' : 'Press space to reveal the pronunciation.'}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-border bg-surface p-12 shadow-soft flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold text-ink mb-4">Ready to start?</h2>
                <p className="text-muted mb-6">Click the button above to begin today's optimized review session.</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Learning Context Panel */}
              <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted mb-4 border-b border-border pb-3">Learning Context</div>
                
                {currentCharacter ? (
                  <div className="space-y-5">
                    <div>
                      <div className="text-4xl font-japanese text-ink mb-1">{currentCharacter.character}</div>
                      <div className="text-lg font-medium text-muted">{currentCharacter.romaji}</div>
                    </div>
                    
                    {state.characterProgress[currentCharacter.id] && (
                      <div className="bg-paper2 rounded-xl p-3 border border-border">
                        <div className="text-xs uppercase text-muted mb-1">SRS Interval</div>
                        <div className="font-semibold text-secondary-600">
                          Next due in {state.characterProgress[currentCharacter.id].intervalDays} days
                        </div>
                      </div>
                    )}
                    
                    {state.characterProgress[currentCharacter.id]?.correct < state.characterProgress[currentCharacter.id]?.seen / 2 && state.characterProgress[currentCharacter.id]?.seen > 3 && (
                      <div className="bg-red-50 text-red-700 rounded-xl p-3 border border-red-200 text-sm">
                        <span className="font-bold flex items-center gap-1">⚠️ Needs focus!</span>
                        You often struggle with this character.
                      </div>
                    )}

                    <div>
                      <div className="text-xs uppercase text-muted mb-2 font-semibold">Mnemonic Idea</div>
                      <div className="text-sm bg-primary-50 text-primary-700 p-3 rounded-xl">
                        💡 Imagine "{currentCharacter.romaji}" when looking at the shape of {currentCharacter.character}.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted italic">Context will appear during sessions.</div>
                )}
              </div>

              {/* Progress Panel */}
              <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-ink">Session Progress</span>
                    <span className="text-muted">{sessionStats.reviewed} / {sessionQueue ? sessionStats.reviewed + sessionQueue.length : 0}</span>
                  </div>
                  <div className="h-2 w-full bg-paper2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary-500 transition-all duration-300"
                      style={{ width: `${sessionQueue ? (sessionStats.reviewed / (sessionStats.reviewed + sessionQueue.length)) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2 mt-4">
                    <span className="font-semibold text-ink flex items-center gap-1">🔥 Daily Goal</span>
                    <span className="text-muted">{Math.min(state.settings.dailyGoal, sessionStats.reviewed)}/{state.settings.dailyGoal}</span>
                  </div>
                  <div className="h-2 w-full bg-paper2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 transition-all duration-300"
                      style={{ width: `${Math.min(100, (sessionStats.reviewed / Math.max(1, state.settings.dailyGoal)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'practice' && (
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6 flex flex-col">
               <div className="flex gap-2">
                 <button onClick={() => setPracticeMode('writing')} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${practiceMode === 'writing' ? 'bg-primary-500 text-white' : 'bg-surface text-muted border border-border'}`}>Writing</button>
                 <button onClick={() => setPracticeMode('listening')} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${practiceMode === 'listening' ? 'bg-primary-500 text-white' : 'bg-surface text-muted border border-border'}`}>Listening</button>
               </div>
               
               {practiceMode === 'writing' ? (
                  <WritingPractice
                    character={currentCharacter}
                    onComplete={(passed) => {
                      if (passed) {
                        recordAnswer(currentCharacter.id, 5); // 5 = Easy
                      }
                    }}
                  />
               ) : (
                  <ListeningPractice
                    data={currentData}
                    onAnswer={(correct, id) => recordAnswer(id, correct ? 5 : 2)}
                  />
               )}
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-paper2 p-4 text-sm text-muted">
                {practiceMode === 'writing' 
                  ? 'Trace the guide character. A little coverage goes a long way.'
                  : 'Use headphones for clearer pronunciation cues. Listening mode reinforces recognition before reading.'}
              </div>
              {practiceMode === 'writing' && (
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % currentData.length)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-soft hover:bg-primary-600 transition"
                >
                  <PenLine className="h-4 w-4" />
                  Next Character
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;
