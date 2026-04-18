import { CharacterProgress } from '../types';

const MIN_EASE = 1.3;
const LEECH_THRESHOLD = 4;        // failCount >= this → leech
const SLOW_ANSWER_MS = 3000;       // > this ms on a grade-5 → downgrade to 4

export const createCharacterProgress = (characterId: string, now = new Date()): CharacterProgress => {
  const timestamp = now.toISOString();
  return {
    characterId,
    seen: 0,
    correct: 0,
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    nextReviewAt: timestamp,
    lastSeenAt: null,
    updatedAt: timestamp,
    failCount: 0,
    isLeech: false,
    lastAnswerMs: null,
    perModeCorrect: { recognition: 0, writing: 0 },
  };
};

/**
 * Penalize slow answers. Fluency = speed + accuracy.
 * If a user takes > SLOW_ANSWER_MS on what they marked "Easy" (grade 5),
 * treat it as "Good" (grade 4). Slow recognition is not fluent recognition.
 */
export const penalizeSlowAnswer = (grade: number, elapsedMs: number): number => {
  if (grade === 5 && elapsedMs > SLOW_ANSWER_MS) {
    return 4;
  }
  return grade;
};

/**
 * Apply leech escalation when a card has been consistently failed.
 * Overrides the SM-2 interval to force high-frequency review.
 */
export const applyLeechEscalation = (
  progress: CharacterProgress,
  failCount: number
): Pick<CharacterProgress, 'intervalDays' | 'easeFactor' | 'isLeech'> => {
  if (failCount < LEECH_THRESHOLD) {
    return {
      intervalDays: progress.intervalDays,
      easeFactor: progress.easeFactor,
      isLeech: false,
    };
  }
  return {
    intervalDays: 0.5, // Review in 12 hours
    easeFactor: Math.max(MIN_EASE, progress.easeFactor - 0.3),
    isLeech: true,
  };
};

export const applySrs = (
  current: CharacterProgress,
  gradeOrCorrect: boolean | number,
  confidence?: 'easy' | 'medium' | 'hard',
  now = new Date(),
  elapsedMs?: number
): CharacterProgress => {
  let grade: number;
  let isCorrect: boolean;

  if (typeof gradeOrCorrect === 'boolean') {
    isCorrect = gradeOrCorrect;
    if (isCorrect) {
      if (confidence === 'easy') grade = 5;
      else if (confidence === 'hard') grade = 3;
      else grade = 4; // medium
    } else {
      grade = 2; // incorrect
    }
  } else {
    grade = gradeOrCorrect;
    isCorrect = grade >= 3;
  }

  // Apply time penalty before SM-2 calculation
  if (elapsedMs !== undefined) {
    grade = penalizeSlowAnswer(grade, elapsedMs);
    isCorrect = grade >= 3;
  }

  let easeFactor = current.easeFactor;

  // SM-2 ease factor adjustment
  easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (easeFactor < MIN_EASE) {
    easeFactor = MIN_EASE;
  }

  let repetitions = current.repetitions;
  let intervalDays = current.intervalDays;
  // Track cross-session fail count (resets on correct answer)
  const newFailCount = isCorrect ? 0 : (current.failCount ?? 0) + 1;
  let isLeech = current.isLeech ?? false;

  if (isCorrect) {
    repetitions += 1;
    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    // Correct answer clears leech status if failCount reset
    isLeech = false;
  } else {
    repetitions = 0;
    intervalDays = 1;
  }

  // Apply leech escalation override if threshold reached
  if (newFailCount >= LEECH_THRESHOLD) {
    const escalation = applyLeechEscalation(
      { ...current, easeFactor, intervalDays },
      newFailCount
    );
    intervalDays = escalation.intervalDays;
    easeFactor = escalation.easeFactor;
    isLeech = escalation.isLeech;
  }

  const nextReviewAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return {
    ...current,
    seen: current.seen + 1,
    correct: isCorrect ? current.correct + 1 : current.correct,
    easeFactor,
    intervalDays,
    repetitions,
    nextReviewAt: nextReviewAt.toISOString(),
    lastSeenAt: now.toISOString(),
    updatedAt: now.toISOString(),
    failCount: newFailCount,
    isLeech,
    lastAnswerMs: elapsedMs ?? current.lastAnswerMs ?? null,
    perModeCorrect: current.perModeCorrect ?? { recognition: 0, writing: 0 },
  };
};

export const isDueForReview = (progress: CharacterProgress, now = new Date()): boolean => {
  if (!progress.nextReviewAt) {
    return true;
  }
  return new Date(progress.nextReviewAt).getTime() <= now.getTime();
};

export const isSoonDue = (progress: CharacterProgress, withinMs = 4 * 60 * 60 * 1000, now = new Date()): boolean => {
  if (!progress.nextReviewAt) return false;
  const dueAt = new Date(progress.nextReviewAt).getTime();
  const nowMs = now.getTime();
  // Due in the future but within the window
  return dueAt > nowMs && dueAt <= nowMs + withinMs;
};
