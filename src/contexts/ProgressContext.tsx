import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { CharacterProgress, ProgressState, StudySession, UserSettings } from '../types';
import { applySrs, createCharacterProgress, isDueForReview } from '../utils/srs';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { get as idbGet, set as idbSet } from 'idb-keyval';
import { Analytics } from '../lib/analytics';

interface ProgressContextValue {
  state: ProgressState;
  recordAnswer: (characterId: string, gradeOrCorrect: boolean | number) => void;
  addSession: (session: StudySession) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetProgress: () => void;
  exportProgress: () => string;
  importProgress: (payload: string) => { success: boolean; error?: string };
  getDueCharacterIds: (now?: Date) => string[];
  scheduleReview: (characterId: string) => void;
  unlockAchievement: (achievementId: string, unlockedAt?: string) => void;
  syncWithSupabase: (userId: string) => Promise<void>;
}

const STORAGE_KEY = 'nihongo-flash-progress-v2';
const LEGACY_KEY = 'nihongo-flash-progress';

const defaultSettings: UserSettings = {
  dailyGoal: 20,
  autoAdvance: true,
  audioEnabled: true,
  theme: 'system',
  quizQuestionCount: 10,
  quizTimerEnabled: false,
  quizTimerSeconds: 20,
  questionType: 'kana_to_romaji',
};

const defaultState: ProgressState = {
  totalSeen: 0,
  totalCorrect: 0,
  currentStreak: 0,
  bestStreak: 0,
  score: 0,
  lastStudyDate: null,
  characterProgress: {},
  studySessions: [],
  achievementUnlocks: {},
  settings: defaultSettings,
  sync: {
    status: 'idle',
    lastSyncAt: null,
    error: null,
  },
  pendingEvents: [], // Offline Queue
  updatedAt: new Date().toISOString(),
};

const getISODate = (date: Date) => date.toISOString().slice(0, 10);

const isYesterday = (lastDate: string, today: string) => {
  const last = new Date(lastDate);
  const current = new Date(today);
  const diff = current.getTime() - last.getTime();
  return diff >= 24 * 60 * 60 * 1000 && diff < 2 * 24 * 60 * 60 * 1000;
};

const recalculateTotals = (characterProgress: Record<string, CharacterProgress>) => {
  const totals = Object.values(characterProgress).reduce(
    (acc, item) => {
      acc.totalSeen += item.seen;
      acc.totalCorrect += item.correct;
      return acc;
    },
    { totalSeen: 0, totalCorrect: 0 }
  );
  return {
    totalSeen: totals.totalSeen,
    totalCorrect: totals.totalCorrect,
    score: totals.totalCorrect * 10,
  };
};

const mergeCharacterProgress = (
  local: Record<string, CharacterProgress>,
  remote: Record<string, CharacterProgress>
) => {
  const merged: Record<string, CharacterProgress> = { ...local };
  Object.entries(remote).forEach(([id, item]) => {
    const existing = merged[id];
    if (!existing || new Date(item.updatedAt).getTime() > new Date(existing.updatedAt).getTime()) {
      merged[id] = item;
    }
  });
  return merged;
};

const mergeSessions = (local: StudySession[], remote: StudySession[]) => {
  const map = new Map<string, StudySession>();
  [...local, ...remote].forEach((session) => {
    const existing = map.get(session.id);
    if (!existing) {
      map.set(session.id, session);
      return;
    }
    const existingDate = new Date(existing.endedAt).getTime();
    const nextDate = new Date(session.endedAt).getTime();
    if (nextDate > existingDate) {
      map.set(session.id, session);
    }
  });
  return Array.from(map.values()).sort((a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime());
};

const migrateLegacy = (): ProgressState | null => {
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (!legacy) return null;
  try {
    const parsed = JSON.parse(legacy);
    const now = new Date();
    const migratedProgress: Record<string, CharacterProgress> = {};
    const completed = Array.isArray(parsed.completedCharacters) ? parsed.completedCharacters : [];
    completed.forEach((id: string) => {
      const base = createCharacterProgress(id, now);
      migratedProgress[id] = {
        ...base,
        seen: 1,
        correct: 1,
        intervalDays: 1,
      };
    });
    const totals = recalculateTotals(migratedProgress);
    return {
      ...defaultState,
      totalSeen: parsed.totalSeen ?? totals.totalSeen,
      totalCorrect: parsed.totalCorrect ?? totals.totalCorrect,
      score: parsed.score ?? totals.score,
      currentStreak: parsed.currentStreak ?? 0,
      bestStreak: parsed.bestStreak ?? 0,
      characterProgress: migratedProgress,
      updatedAt: now.toISOString(),
    };
  } catch (error) {
    console.warn('Failed to migrate legacy progress.', error);
    return null;
  }
};

const loadState = (): ProgressState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as ProgressState;
      return {
        ...defaultState,
        ...parsed,
        settings: { ...defaultSettings, ...(parsed.settings || {}) },
        sync: { ...defaultState.sync, ...(parsed.sync || {}) },
      };
    } catch {
       // Silent fail for load
    }
  }

  const migrated = migrateLegacy();
  if (migrated) {
    return migrated;
  }

  return defaultState;
};

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProgressState>(() => loadState());

  const persist = useCallback((nextState: ProgressState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    idbSet('pending_events', nextState.pendingEvents).catch(console.error);
    return nextState;
  }, []);

  // Load IndexedDB events after mount
  React.useEffect(() => {
    idbGet('pending_events').then(events => {
      if (events && Array.isArray(events) && events.length > 0) {
        setState(prev => ({ ...prev, pendingEvents: events }));
      }
    }).catch(console.error);
  }, []);

  const updateAchievements = (nextState: ProgressState): ProgressState => {
    // Achievements are unlocked in Achievements page evaluation; this keeps space for future logic.
    return nextState;
  };

  const recordAnswer = useCallback((characterId: string, gradeOrCorrect: boolean | number) => {
    setState((prev) => {
      const now = new Date();
      
      // ANTI-CHEAT: Prevent rapid-fire bot answers (min 300ms between answers)
      const lastAnswerTime = parseInt(sessionStorage.getItem('last_answer_time') || '0', 10);
      if (now.getTime() - lastAnswerTime < 300) {
        console.warn('Anti-cheat: Answer submitted too quickly. Ignoring.');
        return prev;
      }
      sessionStorage.setItem('last_answer_time', now.getTime().toString());

      const existing = prev.characterProgress[characterId] ?? createCharacterProgress(characterId, now);
      const updated = applySrs(existing, gradeOrCorrect, now);

      const isCorrect = typeof gradeOrCorrect === 'boolean' ? gradeOrCorrect : gradeOrCorrect >= 3;

      const today = getISODate(now);
      let currentStreak = prev.currentStreak;
      if (!prev.lastStudyDate) {
        currentStreak = 1;
      } else if (prev.lastStudyDate === today) {
        currentStreak = prev.currentStreak;
      } else if (isYesterday(prev.lastStudyDate, today)) {
        currentStreak = prev.currentStreak + 1;
      } else {
        currentStreak = 1;
      }

      const bestStreak = Math.max(prev.bestStreak, currentStreak);

      const nextState: ProgressState = {
        ...prev,
        totalSeen: prev.totalSeen + 1,
        totalCorrect: isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect,
        score: isCorrect ? prev.score + 10 : prev.score,
        currentStreak,
        bestStreak,
        lastStudyDate: today,
        characterProgress: {
          ...prev.characterProgress,
          [characterId]: updated,
        },
        pendingEvents: [...prev.pendingEvents, {
            version: 1,
            id: crypto.randomUUID(),
            type: 'ANSWER_SUBMITTED' as const,
            payload: { characterId, gradeOrCorrect, timestamp: now.toISOString() },
            createdAt: now.getTime(),
            retryCount: 0
        }].slice(-1000), // Enforce unbounded limit
        updatedAt: now.toISOString(),
      };

      return persist(updateAchievements(nextState));
    });
  }, [persist]);

  const addSession = useCallback((session: StudySession) => {
    setState((prev) => {
      // ANTI-CHEAT: Validate session realistically
      // Minimum 0.5 seconds per question answered
      if (session.totalQuestions > 0 && session.durationSec > 0) {
        if (session.durationSec / session.totalQuestions < 0.5) {
          console.warn('Anti-cheat: Session completed impossibly fast.');
          return prev;
        }
      }
      if (session.correctAnswers > session.totalQuestions) {
        console.warn('Anti-cheat: Cannot have more correct answers than total questions.');
        return prev;
      }

      const nextState: ProgressState = {
        ...prev,
        studySessions: [session, ...prev.studySessions].slice(0, 200),
        pendingEvents: [...prev.pendingEvents, {
            version: 1,
            id: crypto.randomUUID(),
            type: 'SESSION_COMPLETED' as const,
            payload: { session, timestamp: new Date().toISOString() },
            createdAt: new Date().getTime(),
            retryCount: 0
        }].slice(-1000), // Enforce unbounded limit
        updatedAt: new Date().toISOString(),
      };
      return persist(updateAchievements(nextState));
    });
  }, [persist]);

  const updateSettings = useCallback((settings: Partial<UserSettings>) => {
    setState((prev) => {
      const nextState: ProgressState = {
        ...prev,
        settings: { ...prev.settings, ...settings },
        updatedAt: new Date().toISOString(),
      };
      return persist(nextState);
    });
  }, [persist]);

  const resetProgress = useCallback(() => {
    setState((prev) => {
      const nextState: ProgressState = {
        ...defaultState,
        settings: prev.settings,
        sync: prev.sync,
        pendingEvents: [], // Reset pending events
        updatedAt: new Date().toISOString(),
      };
      return persist(nextState);
    });
  }, [persist]);

  const exportProgress = useCallback(() => JSON.stringify(state, null, 2), [state]);

  const importProgress = useCallback((payload: string) => {
    try {
      const parsed = JSON.parse(payload) as ProgressState;
      if (!parsed || !parsed.characterProgress) {
        return { success: false, error: 'Invalid progress payload.' };
      }
      setState((prev) => {
        const mergedCharacters = mergeCharacterProgress(prev.characterProgress, parsed.characterProgress);
        const totals = recalculateTotals(mergedCharacters);
        const mergedSessions = mergeSessions(prev.studySessions, parsed.studySessions || []);
        const nextState: ProgressState = {
          ...prev,
          ...parsed,
          settings: { ...prev.settings, ...(parsed.settings || {}) },
          characterProgress: mergedCharacters,
          studySessions: mergedSessions,
          totalSeen: totals.totalSeen,
          totalCorrect: totals.totalCorrect,
          score: totals.score,
          updatedAt: new Date().toISOString(),
        };
        return persist(nextState);
      });
      return { success: true };
    } catch {
      return { success: false, error: 'Unable to parse progress JSON.' };
    }
  }, [persist]);

  const getDueCharacterIds = useCallback((now = new Date()) => {
    return Object.values(state.characterProgress)
      .filter((item) => isDueForReview(item, now))
      .map((item) => item.characterId);
  }, [state.characterProgress]);

  const scheduleReview = useCallback((characterId: string) => {
    setState((prev) => {
      const now = new Date();
      const existing = prev.characterProgress[characterId] ?? createCharacterProgress(characterId, now);
      const updated = {
        ...existing,
        nextReviewAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
      const nextState: ProgressState = {
        ...prev,
        characterProgress: {
          ...prev.characterProgress,
          [characterId]: updated,
        },
        updatedAt: now.toISOString(),
      };
      return persist(nextState);
    });
  }, [persist]);

  const unlockAchievement = useCallback((achievementId: string, unlockedAt = new Date().toISOString()) => {
    setState((prev) => {
      if (prev.achievementUnlocks[achievementId]) return prev;
      const nextState: ProgressState = {
        ...prev,
        achievementUnlocks: {
          ...prev.achievementUnlocks,
          [achievementId]: unlockedAt,
        },
        updatedAt: new Date().toISOString(),
      };
      return persist(nextState);
    });
  }, [persist]);

  const syncWithSupabase = useCallback(async (userId: string) => {
    if (!supabase || !isSupabaseConfigured) {
      return;
    }

    setState((prev) =>
      persist({
        ...prev,
        sync: { ...prev.sync, status: 'syncing', error: null },
      })
    );

    try {
      if (import.meta.env.VITE_ENABLE_API_LAYER === 'true') {
         const eventsToSync = [...state.pendingEvents].sort((a, b) => a.createdAt - b.createdAt);
         if (eventsToSync.length > 0) {
           // Jitter: Thundering Herd Protection
           const baseDelay = 2000;
           const jitter = Math.random() * 3000;
           await new Promise((resolve) => setTimeout(resolve, baseDelay + jitter));

           const startList = performance.now();
           const { error: invokeError } = await supabase.functions.invoke('sync-progress', {
             body: { events: eventsToSync }
           });
           
           Analytics.trackQueueMetrics({
              queue_depth: eventsToSync.length,
              processing_time_ms: performance.now() - startList
           });

           if (!invokeError) {
             setState(prev => persist({
                ...prev,
                pendingEvents: prev.pendingEvents.filter(e => !eventsToSync.find(s => s.id === e.id))
             }));
           } else {
             console.error("Queue submission failed. Maintaining locally.", invokeError);
             setState(prev => persist({
                ...prev,
                pendingEvents: prev.pendingEvents.map(e => ({ ...e, retryCount: e.retryCount + 1 }))
             }));
             throw invokeError;
           }
         }
      }

      const [remoteProgress, remoteCharacters, remoteSessions, remoteSettings, remoteAchievements] =
        await Promise.all([
          supabase.from('user_progress').select('*').eq('user_id', userId).maybeSingle(),
          supabase.from('character_progress').select('*').eq('user_id', userId),
          supabase.from('study_sessions').select('*').eq('user_id', userId),
          supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle(),
          supabase.from('achievement_unlocks').select('*').eq('user_id', userId),
        ]);

      const remoteCharacterProgress: Record<string, CharacterProgress> = {};
      if (remoteCharacters.data) {
        remoteCharacters.data.forEach((row) => {
          remoteCharacterProgress[row.character_id] = {
            characterId: row.character_id,
            seen: row.seen,
            correct: row.correct,
            easeFactor: row.ease_factor,
            intervalDays: row.interval_days,
            repetitions: row.repetitions,
            nextReviewAt: row.next_review_at,
            lastSeenAt: row.last_seen_at,
            updatedAt: row.updated_at,
          };
        });
      }

      const remoteSessionsData: StudySession[] = (remoteSessions.data || []).map((row) => ({
        id: row.id,
        mode: row.mode,
        startedAt: row.started_at,
        endedAt: row.ended_at,
        totalQuestions: row.total_questions,
        correctAnswers: row.correct,
        accuracy: row.accuracy,
        durationSec: row.duration_sec,
      }));

      const remoteAchievementsData: Record<string, string> = {};
      (remoteAchievements.data || []).forEach((row) => {
        remoteAchievementsData[row.achievement_id] = row.unlocked_at;
      });

      const remoteState: ProgressState = {
        ...defaultState,
        totalSeen: remoteProgress.data?.total_seen ?? 0,
        totalCorrect: remoteProgress.data?.total_correct ?? 0,
        currentStreak: remoteProgress.data?.current_streak ?? 0,
        bestStreak: remoteProgress.data?.best_streak ?? 0,
        score: remoteProgress.data?.score ?? 0,
        lastStudyDate: remoteProgress.data?.last_study_date ?? null,
        characterProgress: remoteCharacterProgress,
        studySessions: remoteSessionsData,
        achievementUnlocks: remoteAchievementsData,
        settings: {
          ...defaultSettings,
          ...(remoteSettings.data
            ? {
                dailyGoal: remoteSettings.data.daily_goal,
                autoAdvance: remoteSettings.data.auto_advance,
                audioEnabled: remoteSettings.data.audio_enabled,
                theme: remoteSettings.data.theme,
                quizQuestionCount: remoteSettings.data.quiz_question_count,
                quizTimerEnabled: remoteSettings.data.quiz_timer_enabled,
                quizTimerSeconds: remoteSettings.data.quiz_timer_seconds,
                questionType: remoteSettings.data.question_type,
              }
            : {}),
        },
        sync: defaultState.sync,
        updatedAt: remoteProgress.data?.updated_at ?? new Date(0).toISOString(),
      };

      const mergedCharacterProgress = mergeCharacterProgress(state.characterProgress, remoteState.characterProgress);
      const mergedSessions = mergeSessions(state.studySessions, remoteState.studySessions);
      const totals = recalculateTotals(mergedCharacterProgress);
      const lastStudyDate =
        (state.lastStudyDate || '') > (remoteState.lastStudyDate || '') ? state.lastStudyDate : remoteState.lastStudyDate;
      // ANTI-CHEAT bounds checking
      if (totals.totalCorrect > totals.totalSeen) {
        totals.totalCorrect = totals.totalSeen;
      }
      totals.score = totals.totalCorrect * 10;

      const mergedState: ProgressState = {
        ...state,
        ...remoteState,
        characterProgress: mergedCharacterProgress,
        studySessions: mergedSessions,
        achievementUnlocks: { ...remoteState.achievementUnlocks, ...state.achievementUnlocks },
        totalSeen: totals.totalSeen,
        totalCorrect: totals.totalCorrect,
        score: totals.score,
        lastStudyDate,
        bestStreak: Math.max(state.bestStreak, remoteState.bestStreak),
        currentStreak:
          lastStudyDate === state.lastStudyDate ? state.currentStreak : remoteState.currentStreak,
        updatedAt: new Date().toISOString(),
      };

      // Ensure streak anomaly prevention (backend authoritative preference but we enforce sanity check)
      if (mergedState.currentStreak > mergedState.bestStreak) {
         mergedState.bestStreak = mergedState.currentStreak;
      }

      const now = new Date().toISOString();

      await supabase.from('user_progress').upsert({
        user_id: userId,
        total_seen: mergedState.totalSeen,
        total_correct: mergedState.totalCorrect,
        score: mergedState.score,
        current_streak: mergedState.currentStreak,
        best_streak: mergedState.bestStreak,
        last_study_date: mergedState.lastStudyDate,
        updated_at: now,
      });

      await supabase.from('user_profiles').upsert({
        id: userId,
        display_name: 'Learner',
        created_at: now,
      });

      await supabase.from('user_settings').upsert({
        user_id: userId,
        daily_goal: mergedState.settings.dailyGoal,
        auto_advance: mergedState.settings.autoAdvance,
        audio_enabled: mergedState.settings.audioEnabled,
        theme: mergedState.settings.theme,
        quiz_question_count: mergedState.settings.quizQuestionCount,
        quiz_timer_enabled: mergedState.settings.quizTimerEnabled,
        quiz_timer_seconds: mergedState.settings.quizTimerSeconds,
        question_type: mergedState.settings.questionType,
        updated_at: now,
      });

      const characterRows = Object.values(mergedState.characterProgress).map((item) => ({
        user_id: userId,
        character_id: item.characterId,
        seen: item.seen,
        correct: item.correct,
        ease_factor: item.easeFactor,
        interval_days: item.intervalDays,
        repetitions: item.repetitions,
        next_review_at: item.nextReviewAt,
        last_seen_at: item.lastSeenAt,
        updated_at: item.updatedAt,
      }));

      if (characterRows.length > 0) {
        await supabase.from('character_progress').upsert(characterRows, {
          onConflict: 'user_id,character_id',
        });
      }

      if (mergedState.studySessions.length > 0) {
        const sessionRows = mergedState.studySessions.map((session) => ({
          id: session.id,
          user_id: userId,
          mode: session.mode,
          started_at: session.startedAt,
          ended_at: session.endedAt,
          total_questions: session.totalQuestions,
          correct: session.correctAnswers,
          accuracy: session.accuracy,
          duration_sec: session.durationSec,
        }));
        await supabase.from('study_sessions').upsert(sessionRows, { onConflict: 'id' });
      }

      const achievementRows = Object.entries(mergedState.achievementUnlocks).map(([id, unlockedAt]) => ({
        user_id: userId,
        achievement_id: id,
        unlocked_at: unlockedAt,
        updated_at: now,
      }));
      if (achievementRows.length > 0) {
        await supabase.from('achievement_unlocks').upsert(achievementRows, {
          onConflict: 'user_id,achievement_id',
        });
      }

      setState(() =>
        persist({
          ...mergedState,
          sync: { status: 'idle', lastSyncAt: now, error: null },
        })
      );
    } catch {
      setState((prev) =>
        persist({
          ...prev,
          sync: { status: 'error', lastSyncAt: prev.sync.lastSyncAt, error: 'Sync failed' },
        })
      );
    }
  }, [state, persist]);

  const value = useMemo(
    () => ({
      state,
      recordAnswer,
      addSession,
      updateSettings,
      resetProgress,
      exportProgress,
      importProgress,
      getDueCharacterIds,
      scheduleReview,
      unlockAchievement,
      syncWithSupabase,
    }),
    [state, recordAnswer, addSession, updateSettings, resetProgress, exportProgress, importProgress, getDueCharacterIds, scheduleReview, unlockAchievement, syncWithSupabase]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export const useProgressStore = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgressStore must be used within a ProgressProvider');
  }
  return context;
};
