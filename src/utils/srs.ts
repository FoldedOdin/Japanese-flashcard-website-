import { CharacterProgress } from '../types';

const MIN_EASE = 1.3;

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
  };
};

export const applySrs = (
  current: CharacterProgress,
  correct: boolean,
  now = new Date()
): CharacterProgress => {
  const grade = correct ? 4 : 2;
  let easeFactor = current.easeFactor;

  // SM-2 ease factor adjustment
  easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (easeFactor < MIN_EASE) {
    easeFactor = MIN_EASE;
  }

  let repetitions = current.repetitions;
  let intervalDays = current.intervalDays;

  if (correct) {
    repetitions += 1;
    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
  } else {
    repetitions = 0;
    intervalDays = 1;
  }

  const nextReviewAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return {
    ...current,
    seen: current.seen + 1,
    correct: correct ? current.correct + 1 : current.correct,
    easeFactor,
    intervalDays,
    repetitions,
    nextReviewAt: nextReviewAt.toISOString(),
    lastSeenAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
};

export const isDueForReview = (progress: CharacterProgress, now = new Date()): boolean => {
  if (!progress.nextReviewAt) {
    return true;
  }
  return new Date(progress.nextReviewAt).getTime() <= now.getTime();
};
