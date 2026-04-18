import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, PenLine, ArrowRight, AlertTriangle, Flame, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Sentry from '@sentry/react';
import { KanaCharacter } from '../types';
import { Analytics } from '../lib/analytics';
import FlashCard from '../components/FlashCard';
import ProgressBar from '../components/ProgressBar';
import WritingPractice from '../components/WritingPractice';
import ListeningPractice from '../components/ListeningPractice';
import { getAllKana, hiraganaData, katakanaData } from '../data/kanaData';
import { useProgressStore } from '../hooks/useProgressStore';
import { useWeakCards } from '../hooks/useWeakCards';
import { isSoonDue } from '../utils/srs';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeedbackToast {
  text: string;
  type: 'success' | 'warning' | 'leech';
}

/** Queue entry — carries a flag for reverse-mode exposure */
interface QueueEntry {
  card: KanaCharacter;
  /** When true: user sees romaji, must recall the kana character */
  reversed: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build the session queue following strict SRS priority:
 *   1. Due cards (sorted ASC by nextReviewAt — already sorted by getDueCharacterIds)
 *   2. Leech/weak cards injected every WEAK_INJECT_INTERVAL-th slot
 *   3. New cards — ONLY if there are no due cards
 *
 * For each card we also plan one reverse-mode follow-up after the first
 * correct answer (handled dynamically in handleSessionAnswer).
 */
const buildSessionQueue = (
  dueCards: KanaCharacter[],
  weakCards: KanaCharacter[],
  leechCards: KanaCharacter[],
  unseenCards: KanaCharacter[],
  dailyGoal: number
): QueueEntry[] => {
  const WEAK_INJECT_INTERVAL = 5; // inject a weak/leech every N slots
  const hasDue = dueCards.length > 0;

  // Combine weak + leech, deduplicate against due
  const dueIds = new Set(dueCards.map((c) => c.id));
  const extraPriority = [...leechCards, ...weakCards].filter((c) => !dueIds.has(c.id));

  const baseCards: KanaCharacter[] = hasDue ? [...dueCards] : [...unseenCards];
  const injectSource = [...extraPriority];

  const queue: QueueEntry[] = [];
  let injectIdx = 0;

  for (let i = 0; queue.length < dailyGoal && (i < baseCards.length || injectIdx < injectSource.length); i++) {
    // Inject a weak/leech card every WEAK_INJECT_INTERVAL slots
    if (i > 0 && i % WEAK_INJECT_INTERVAL === 0 && injectIdx < injectSource.length) {
      const weak = injectSource[injectIdx++];
      // Don't double-inject a card already in the queue
      if (!queue.find((q) => q.card.id === weak.id)) {
        queue.push({ card: weak, reversed: false });
      }
    }

    if (i < baseCards.length) {
      queue.push({ card: baseCards[i], reversed: false });
    }
  }

  return queue.slice(0, dailyGoal);
};

// ─── Component ────────────────────────────────────────────────────────────────

const Learn: React.FC = () => {
  const [scriptMode, setScriptMode] = useState<'hiragana' | 'katakana' | 'mixed'>('hiragana');
  const [tab, setTab] = useState<'learn' | 'review' | 'practice'>('learn');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRomaji, setShowRomaji] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'writing' | 'listening'>('writing');

  // — Session state
  const [sessionQueue, setSessionQueue] = useState<QueueEntry[] | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, incorrect: 0 });
  const [reviewFlipped, setReviewFlipped] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<FeedbackToast | null>(null);

  // — Error-loop tracking: consecutive correct answers per card within session
  const consecutiveCorrect = useRef<Map<string, number>>(new Map());
  // — Bidirectional recall: cards that have had ≥1 correct forward answer
  const reverseExposureNeeded = useRef<Set<string>>(new Set());
  // — Time pressure: when the current card was shown
  const cardStartTime = useRef<number>(Date.now());

  const { state, recordAnswer, getDueCharacterIds } = useProgressStore();

  const currentData = useMemo(() => {
    if (scriptMode === 'hiragana') return hiraganaData;
    if (scriptMode === 'katakana') return katakanaData;
    return getAllKana();
  }, [scriptMode]);

  const allKana = useMemo(() => getAllKana(), []);
  const { weakCards, leechCards } = useWeakCards(state.characterProgress, allKana);

  // Build the due/unseen queues for session planning
  const dueIds = getDueCharacterIds(); // already sorted ASC by ProgressContext
  const dueQueue = currentData.filter((c) => dueIds.includes(c.id));
  const unseenQueue = currentData.filter((c) => !state.characterProgress[c.id]);

  // Pre-forgetting alert: cards due in < 4 hours but not yet overdue
  const soonDueCount = useMemo(() => {
    return Object.values(state.characterProgress).filter((p) => isSoonDue(p)).length;
  }, [state.characterProgress]);

  // Current card (learn tab uses index; review tab uses session queue)
  const currentCharacter = sessionQueue ? sessionQueue[0]?.card : currentData[currentIndex];
  const isCurrentReversed = sessionQueue ? (sessionQueue[0]?.reversed ?? false) : false;

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % currentData.length);
    setShowRomaji(false);
  };
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + currentData.length) % currentData.length);
    setShowRomaji(false);
  };
  const handleFlip = () => setShowRomaji((v) => !v);

  const showToast = useCallback((toast: FeedbackToast) => {
    setFeedbackToast(toast);
    setTimeout(() => setFeedbackToast(null), 2500);
  }, []);

  const handleSessionAnswer = useCallback((grade: number) => {
    if (!sessionQueue || sessionQueue.length === 0) return;

    const entry = sessionQueue[0];
    const char = entry.card;
    const elapsedMs = Date.now() - cardStartTime.current;

    // Record in SRS with elapsedMs (enables time-penalty grading inside applySrs)
    recordAnswer(char.id, grade, undefined, elapsedMs);

    const isCorrect = grade >= 4;
    const prevConsecutive = consecutiveCorrect.current.get(char.id) ?? 0;
    const newConsecutive = isCorrect ? prevConsecutive + 1 : 0;
    consecutiveCorrect.current.set(char.id, newConsecutive);

    setSessionStats((prev) => ({
      reviewed: prev.reviewed + 1,
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
    }));

    // Fetch updated progress to check leech status
    const updatedProgress = state.characterProgress[char.id];
    const failCount = (updatedProgress?.failCount ?? 0) + (isCorrect ? 0 : 1);
    const wasLeech = failCount >= 4;

    // Toast feedback
    if (wasLeech && !isCorrect) {
      showToast({
        text: `🔴 Leech: ${char.character} — we'll drill this more often`,
        type: 'leech',
      });
    } else if (grade === 5) {
      showToast({ text: elapsedMs > 3000 ? '⏱ Good! (slow recall)' : 'Easy! ✨ +10 XP', type: 'success' });
    } else if (grade === 4) {
      showToast({ text: 'Good! +5 XP', type: 'success' });
    } else {
      showToast({ text: `Hard — ${char.character} will appear again soon.`, type: 'warning' });
    }

    Sentry.addBreadcrumb({
      category: 'action',
      message: 'Flashcard answered',
      level: 'info',
      data: { characterId: char.id, grade, elapsedMs },
    });
    Analytics.trackCardAnswered({
      characterId: char.id,
      difficulty: grade >= 4 ? (grade === 5 ? 'easy' : 'good') : 'hard',
      grade,
      scriptType: char.type as 'hiragana' | 'katakana',
    });

    setSessionQueue((prev) => {
      if (!prev || prev.length === 0) return prev;
      const remaining = prev.slice(1);

      // Error re-insertion: requeue at +3 if wrong OR not yet 2 consecutive correct
      const needsReinsertion = !isCorrect || (isCorrect && newConsecutive < 2 && prevConsecutive < 1);

      // Bidirectional recall: after first correct forward answer, schedule one reversed exposure
      if (isCorrect && !entry.reversed && !reverseExposureNeeded.current.has(char.id)) {
        reverseExposureNeeded.current.add(char.id);
        // Insert a reversed copy after the next 2–3 cards so the user doesn't see it back-to-back
        const insertPos = Math.min(3, remaining.length);
        const reversedEntry: QueueEntry = { card: char, reversed: true };
        const withReverse = [
          ...remaining.slice(0, insertPos),
          reversedEntry,
          ...remaining.slice(insertPos),
        ];

        if (needsReinsertion && withReverse.length > 0) {
          // Also reinsert the forward copy
          const reinsertPos = Math.min(3, withReverse.length);
          const reinserted = [
            ...withReverse.slice(0, reinsertPos),
            { ...entry },
            ...withReverse.slice(reinsertPos),
          ];
          setReviewFlipped(false);
          cardStartTime.current = Date.now();
          return reinserted;
        }

        setReviewFlipped(false);
        cardStartTime.current = Date.now();
        return withReverse;
      }

      if (needsReinsertion && remaining.length > 0) {
        const insertPos = Math.min(3, remaining.length);
        const reinserted = [...remaining.slice(0, insertPos), entry, ...remaining.slice(insertPos)];
        setReviewFlipped(false);
        cardStartTime.current = Date.now();
        return reinserted;
      }

      if (remaining.length === 0) {
        setSessionCompleted(true);
        const totalReviewed = sessionStats.reviewed + 1;
        const totalIncorrect = sessionStats.incorrect + (isCorrect ? 0 : 1);
        Analytics.trackSessionCompleted({
          accuracy: Math.round(((totalReviewed - totalIncorrect) / Math.max(1, totalReviewed)) * 100),
          cards_reviewed: totalReviewed,
        });
        return [];
      }

      setReviewFlipped(false);
      cardStartTime.current = Date.now();
      return remaining;
    });
  }, [sessionQueue, recordAnswer, state.characterProgress, sessionStats, showToast]);

  const startMicroDrill = useCallback(() => {
    // "Fix Top 5 Weak Kana" — focused 10-card session from leech+weak cards
    const drillSource = [...leechCards.slice(0, 3), ...weakCards.slice(0, 2)];
    if (drillSource.length === 0) return;
    const queue: QueueEntry[] = drillSource.map((c) => ({ card: c, reversed: false }));
    setSessionQueue(queue);
    setSessionCompleted(false);
    setSessionStats({ reviewed: 0, incorrect: 0 });
    reverseExposureNeeded.current.clear();
    consecutiveCorrect.current.clear();
    setTab('review');
    setReviewFlipped(false);
    cardStartTime.current = Date.now();
  }, [leechCards, weakCards]);

  const startSession = useCallback(() => {
    const queue = buildSessionQueue(
      dueQueue,
      weakCards,
      leechCards,
      unseenQueue,
      state.settings.dailyGoal
    );
    setSessionQueue(queue);
    setSessionCompleted(false);
    setSessionStats({ reviewed: 0, incorrect: 0 });
    reverseExposureNeeded.current.clear();
    consecutiveCorrect.current.clear();
    setTab('review');
    setReviewFlipped(false);
    cardStartTime.current = Date.now();

    Analytics.trackSessionStarted({
      due_count: dueQueue.length,
      new_count: unseenQueue.length,
    });
  }, [dueQueue, weakCards, leechCards, unseenQueue, state.settings.dailyGoal]);

  const handleModeChange = (nextMode: 'hiragana' | 'katakana' | 'mixed') => {
    setScriptMode(nextMode);
    setCurrentIndex(0);
    setShowRomaji(false);
    setReviewFlipped(false);
  };

  // ─── Keyboard shortcuts ─────────────────────────────────────────────────────

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (tab === 'learn') {
        switch (e.key) {
          case 'ArrowLeft': goToPrevious(); break;
          case 'ArrowRight': goToNext(); break;
          case ' ':
          case 'Enter':
            e.preventDefault();
            handleFlip();
            break;
        }
      } else if (tab === 'review' && sessionQueue && sessionQueue.length > 0 && !sessionCompleted) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          setReviewFlipped((v) => !v);
        } else if (reviewFlipped) {
          if (e.key === '1') { e.preventDefault(); handleSessionAnswer(3); }
          else if (e.key === '2') { e.preventDefault(); handleSessionAnswer(4); }
          else if (e.key === '3') { e.preventDefault(); handleSessionAnswer(5); }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRomaji, reviewFlipped, currentCharacter?.id, tab, sessionQueue, sessionCompleted]);

  // ─── Render ─────────────────────────────────────────────────────────────────

  const weakTotal = leechCards.length + weakCards.length;
  const newCount = Math.min(5, unseenQueue.length);

  return (
    <div className="bg-paper min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg font-bold z-50 ${
              feedbackToast.type === 'success'
                ? 'bg-emerald-500 text-white'
                : feedbackToast.type === 'leech'
                ? 'bg-red-500 text-white'
                : 'bg-primary-500 text-white'
            }`}
          >
            {feedbackToast.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08),transparent)] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">

        {/* ── Pre-Forgetting Alert Banner ── */}
        {soonDueCount > 0 && tab !== 'review' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 text-amber-800 text-sm font-medium shadow-soft"
          >
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <span>
              ⚠️ <strong>{soonDueCount} card{soonDueCount !== 1 ? 's' : ''}</strong> will be forgotten in &lt; 4 hours — review now!
            </span>
            <button
              onClick={startSession}
              className="ml-auto shrink-0 text-xs bg-amber-500 text-white font-bold px-3 py-1.5 rounded-full hover:bg-amber-600 transition"
            >
              Review Now
            </button>
          </motion.div>
        )}

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted">Today's Practice</p>

            {/* ── Guided Session Banner ── */}
            <div className="mt-2 flex flex-wrap gap-3 items-center">
              <span className="text-2xl font-semibold font-display text-ink">
                {dueQueue.length} reviews
              </span>
              {weakTotal > 0 && (
                <span className="flex items-center gap-1 text-sm bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full font-semibold">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {weakTotal} weak
                </span>
              )}
              {newCount > 0 && (
                <span className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full font-semibold">
                  <Zap className="h-3.5 w-3.5" />
                  {newCount} new
                </span>
              )}
            </div>

            {/* Only introduce new cards if no due cards exist */}
            {dueQueue.length === 0 && unseenQueue.length > 0 && (
              <p className="text-xs text-muted mt-1">No reviews due — introducing new characters.</p>
            )}
            {dueQueue.length > 0 && newCount === 0 && (
              <p className="text-xs text-muted mt-1">All new characters paused until your review queue clears.</p>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={startSession}
                disabled={dueQueue.length === 0 && unseenQueue.length === 0}
                className="flex items-center justify-center space-x-2 rounded-2xl bg-amber-500 px-8 py-3.5 text-sm font-bold text-white shadow-soft transition hover:bg-amber-600 focus:outline-none focus:ring-[3px] focus:ring-amber-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span>Start Today's Session</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Micro-drill button — visible only when there are leech/weak cards */}
              {weakTotal > 0 && (
                <button
                  onClick={startMicroDrill}
                  className="flex items-center gap-2 rounded-2xl bg-red-500 px-6 py-3.5 text-sm font-bold text-white shadow-soft transition hover:bg-red-600 active:scale-95"
                  title="Drill your 5 most-failed characters right now"
                >
                  <Flame className="h-4 w-4" />
                  Fix Top {Math.min(5, weakTotal)} Weak Kana
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['hiragana', 'katakana', 'mixed'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  scriptMode === mode ? 'bg-primary-500 text-white' : 'bg-paper2 text-muted'
                }`}
              >
                {mode === 'hiragana' ? 'ひらがな' : mode === 'katakana' ? 'カタカナ' : 'Mixed'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Navigation ── */}
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
                tab === item.id
                  ? 'bg-secondary-500 text-white shadow-md'
                  : 'bg-surface border border-border text-muted hover:text-ink hover:bg-paper2'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => (window.location.pathname = '/quiz')}
            className="rounded-full px-6 py-2.5 text-sm font-bold transition-all bg-surface border border-border text-muted hover:text-ink hover:bg-paper2"
          >
            Test (Quiz)
          </button>
        </div>

        {/* ── Learn Tab ── */}
        {tab === 'learn' && currentCharacter && (
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

        {/* ── Review Tab ── */}
        {tab === 'review' && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
            {sessionCompleted ? (
              <div className="rounded-3xl border border-border bg-surface p-12 shadow-soft flex flex-col items-center text-center">
                <div className="h-20 w-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-display font-bold text-ink mb-2">🎉 Session Complete!</h2>
                <p className="text-muted mb-8 max-w-md">Consistency is the key to mastering Japanese!</p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-10">
                  <div className="bg-paper2 border border-border rounded-2xl p-4 text-center">
                    <div className="text-3xl font-bold text-secondary-500">{sessionStats.reviewed}</div>
                    <div className="text-xs uppercase text-muted tracking-wider mt-1">Cards Reviewed</div>
                  </div>
                  <div className="bg-paper2 border border-border rounded-2xl p-4 text-center">
                    <div className="text-3xl font-bold text-amber-500">
                      {Math.round(
                        ((sessionStats.reviewed - sessionStats.incorrect) /
                          Math.max(1, sessionStats.reviewed)) *
                          100
                      )}
                      %
                    </div>
                    <div className="text-xs uppercase text-muted tracking-wider mt-1">Accuracy</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setTab('learn')}
                    className="px-6 py-3 rounded-full bg-surface border border-border text-ink font-semibold hover:bg-paper2 transition"
                  >
                    Browse Cards
                  </button>
                  <button
                    onClick={() => (window.location.pathname = '/quiz')}
                    className="px-6 py-3 rounded-full bg-amber-500 text-white font-bold shadow-soft hover:bg-amber-600 transition"
                  >
                    Take a Quiz
                  </button>
                </div>
              </div>
            ) : sessionQueue && sessionQueue.length > 0 ? (
              <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    {sessionQueue[0]?.reversed ? 'Reverse Recall' : 'Active Session'}
                  </div>
                  <div className="text-sm font-medium text-muted">
                    {sessionStats.reviewed} / {sessionStats.reviewed + sessionQueue.length} cards
                  </div>
                </div>

                {/* Reverse mode badge */}
                {sessionQueue[0]?.reversed && (
                  <div className="mb-3 text-xs bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full font-semibold">
                    🔄 Reverse recall — see the romaji, recall the kana
                  </div>
                )}

                <FlashCard
                  character={sessionQueue[0].card}
                  showRomaji={reviewFlipped}
                  onFlip={() => setReviewFlipped((v) => !v)}
                  onAnswer={handleSessionAnswer}
                  reversed={isCurrentReversed}
                />

                <div className="mt-8 text-sm text-muted text-center max-w-sm">
                  {reviewFlipped
                    ? 'Use keyboard 1, 2, 3 to grade your memory.'
                    : isCurrentReversed
                    ? 'Press space to reveal the kana character.'
                    : 'Press space to reveal the pronunciation.'}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-border bg-surface p-12 shadow-soft flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold text-ink mb-4">Ready to start?</h2>
                <p className="text-muted mb-6">Click the button above to begin today's optimized review session.</p>
              </div>
            )}

            {/* ── Right Panel ── */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted mb-4 border-b border-border pb-3">
                  Learning Context
                </div>

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
                          Next review in {state.characterProgress[currentCharacter.id].intervalDays} days
                        </div>
                      </div>
                    )}

                    {/* Leech / weak card alert */}
                    {(() => {
                      const prog = state.characterProgress[currentCharacter.id];
                      if (!prog) return null;
                      if (prog.isLeech || (prog.failCount ?? 0) >= 4) {
                        return (
                          <div className="bg-red-50 text-red-700 rounded-xl p-3 border border-red-200 text-sm">
                            <span className="font-bold flex items-center gap-1">🔴 Leech card!</span>
                            Failed {prog.failCount} times — focused drilling in progress.
                          </div>
                        );
                      }
                      if (prog.seen > 3 && prog.correct < prog.seen / 2) {
                        return (
                          <div className="bg-amber-50 text-amber-700 rounded-xl p-3 border border-amber-200 text-sm">
                            <span className="font-bold flex items-center gap-1">⚠️ Needs focus!</span>
                            You often struggle with this character.
                          </div>
                        );
                      }
                      return null;
                    })()}

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

              {/* Session progress panel */}
              <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-ink">Session Progress</span>
                    <span className="text-muted">
                      {sessionStats.reviewed} / {sessionQueue ? sessionStats.reviewed + sessionQueue.length : 0}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-paper2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary-500 transition-all duration-300"
                      style={{
                        width: `${
                          sessionQueue
                            ? (sessionStats.reviewed /
                                (sessionStats.reviewed + sessionQueue.length)) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2 mt-4">
                    <span className="font-semibold text-ink flex items-center gap-1">🔥 Daily Goal</span>
                    <span className="text-muted">
                      {Math.min(state.settings.dailyGoal, sessionStats.reviewed)}/
                      {state.settings.dailyGoal}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-paper2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          (sessionStats.reviewed / Math.max(1, state.settings.dailyGoal)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Practice Tab ── */}
        {tab === 'practice' && (
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6 flex flex-col">
              <div className="flex gap-2">
                <button
                  onClick={() => setPracticeMode('writing')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    practiceMode === 'writing'
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface text-muted border border-border'
                  }`}
                >
                  Writing
                </button>
                <button
                  onClick={() => setPracticeMode('listening')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    practiceMode === 'listening'
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface text-muted border border-border'
                  }`}
                >
                  Listening
                </button>
              </div>

              {practiceMode === 'writing' ? (
                <WritingPractice
                  character={currentCharacter!}
                  onComplete={(passed) => {
                    if (currentCharacter) {
                      // Track writing-mode result separately with mode context
                      recordAnswer(currentCharacter.id, passed ? 5 : 2, passed ? 'easy' : undefined);
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
                  : 'Use headphones for clearer pronunciation cues.'}
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
