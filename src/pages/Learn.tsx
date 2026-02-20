import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, PenLine, Headphones } from 'lucide-react';
import FlashCard from '../components/FlashCard';
import ProgressBar from '../components/ProgressBar';
import WritingPractice from '../components/WritingPractice';
import ListeningPractice from '../components/ListeningPractice';
import { getAllKana, hiraganaData, katakanaData } from '../data/kanaData';
import { useProgressStore } from '../hooks/useProgressStore';

const Learn: React.FC = () => {
  const [scriptMode, setScriptMode] = useState<'hiragana' | 'katakana' | 'mixed'>('hiragana');
  const [tab, setTab] = useState<'flashcards' | 'review' | 'writing' | 'listening'>('flashcards');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRomaji, setShowRomaji] = useState(false);
  const [reviewFlipped, setReviewFlipped] = useState(false);
  const { state, recordAnswer, getDueCharacterIds } = useProgressStore();

  const currentData = useMemo(() => {
    if (scriptMode === 'hiragana') return hiraganaData;
    if (scriptMode === 'katakana') return katakanaData;
    return getAllKana();
  }, [scriptMode]);

  const currentCharacter = currentData[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % currentData.length);
    setShowRomaji(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + currentData.length) % currentData.length);
    setShowRomaji(false);
  };

  const handleFlip = () => {
    if (!showRomaji) {
      recordAnswer(currentCharacter.id, true);
      if (state.settings.autoAdvance) {
        setTimeout(goToNext, 900);
      }
    }
    setShowRomaji(!showRomaji);
  };

  const handleModeChange = (nextMode: 'hiragana' | 'katakana' | 'mixed') => {
    setScriptMode(nextMode);
    setCurrentIndex(0);
    setShowRomaji(false);
    setReviewFlipped(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (tab !== 'flashcards') return;
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
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showRomaji, currentCharacter.id, tab]);

  const dueIds = getDueCharacterIds();
  const dueQueue = currentData.filter((char) => dueIds.includes(char.id));
  const unseenQueue = currentData.filter((char) => !state.characterProgress[char.id]);
  const reviewQueue = dueQueue.length > 0 ? dueQueue : unseenQueue.slice(0, 20);
  const reviewCharacter = reviewQueue[0];

  const handleReviewAnswer = (correct: boolean) => {
    if (!reviewCharacter) return;
    recordAnswer(reviewCharacter.id, correct);
    setReviewFlipped(false);
  };

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted">Learn</p>
            <h1 className="mt-2 text-3xl font-semibold font-display">Build your kana practice ritual</h1>
            <p className="mt-2 text-muted">Switch between flashcards, review, writing, and listening.</p>
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
            { id: 'flashcards', label: 'Flashcards' },
            { id: 'review', label: 'Review' },
            { id: 'writing', label: 'Writing' },
            { id: 'listening', label: 'Listening' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as typeof tab)}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                tab === item.id ? 'bg-secondary-500 text-white' : 'bg-paper2 text-muted'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'flashcards' && (
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
              <ProgressBar progress={state} total={getAllKana().length} title="Overall Progress" />
            </div>
          </div>
        )}

        {tab === 'review' && (
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-muted">Review</div>
                  <div className="mt-1 text-lg font-semibold text-ink">
                    {dueQueue.length > 0 ? 'Due for review' : 'New characters'}
                  </div>
                </div>
                <div className="text-sm text-muted">Queue: {reviewQueue.length}</div>
              </div>
              {reviewCharacter ? (
                <div className="mt-8 flex flex-col items-center gap-6">
                  <FlashCard
                    character={reviewCharacter}
                    showRomaji={reviewFlipped}
                    onFlip={() => setReviewFlipped((prev) => !prev)}
                  />
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleReviewAnswer(true)}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-soft"
                    >
                      <CheckCircle className="h-4 w-4" />
                      I Got It
                    </button>
                    <button
                      onClick={() => handleReviewAnswer(false)}
                      className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-soft"
                    >
                      <XCircle className="h-4 w-4" />
                      Again
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 text-muted">No items to review right now. Great job!</div>
              )}
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-paper2 p-4 text-sm text-muted">
                Review items are scheduled by spaced repetition to keep practice efficient.
              </div>
              <ProgressBar progress={state} total={getAllKana().length} title="Overall Progress" />
            </div>
          </div>
        )}

        {tab === 'writing' && (
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
            <WritingPractice
              character={currentCharacter}
              onComplete={(passed) => {
                if (passed) {
                  recordAnswer(currentCharacter.id, true);
                }
              }}
            />
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-paper2 p-4 text-sm text-muted">
                Trace the guide character. A little coverage goes a long way.
              </div>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % currentData.length)}
                className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-soft"
              >
                <PenLine className="h-4 w-4" />
                Next Character
              </button>
            </div>
          </div>
        )}

        {tab === 'listening' && (
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
            <ListeningPractice
              data={currentData}
              onAnswer={(correct, id) => recordAnswer(id, correct)}
            />
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-paper2 p-4 text-sm text-muted">
                Use headphones for clearer pronunciation cues.
              </div>
              <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted flex items-center gap-2">
                <Headphones className="h-4 w-4" />
                Listening mode reinforces recognition before reading.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;
