import { describe, it, expect, beforeEach, vi } from 'vitest';
import { applySrs, createCharacterProgress, isDueForReview } from './srs';

describe('srs logic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-03T00:00:00.000Z'));
  });

  it('creates initial character progress correctly', () => {
    const progress = createCharacterProgress('h1');
    expect(progress.characterId).toBe('h1');
    expect(progress.seen).toBe(0);
    expect(progress.correct).toBe(0);
    expect(progress.easeFactor).toBe(2.5);
    expect(progress.intervalDays).toBe(0);
    expect(progress.repetitions).toBe(0);
    expect(progress.nextReviewAt).toBe('2026-04-03T00:00:00.000Z');
  });

  it('handles first correct answer (grade 4)', () => {
    const initial = createCharacterProgress('h1');
    const updated = applySrs(initial, 4);

    expect(updated.seen).toBe(1);
    expect(updated.correct).toBe(1);
    expect(updated.repetitions).toBe(1);
    expect(updated.intervalDays).toBe(1);
    expect(updated.nextReviewAt).toBe('2026-04-04T00:00:00.000Z'); // 1 day later
  });

  it('handles first correct answer (grade 5)', () => {
    const initial = createCharacterProgress('h1');
    const updated = applySrs(initial, 5);

    expect(updated.seen).toBe(1);
    expect(updated.correct).toBe(1);
    expect(updated.repetitions).toBe(1);
    expect(updated.intervalDays).toBe(1);
    expect(updated.easeFactor).toBe(2.6); // Increased ease
    expect(updated.nextReviewAt).toBe('2026-04-04T00:00:00.000Z'); // 1 day later
  });

  it('handles incorrect answer (grade < 3)', () => {
    let progress = createCharacterProgress('h1');
    // First answer correctly
    progress = applySrs(progress, 4); // rep = 1, interval = 1
    // Then incorrectly
    progress = applySrs(progress, 2);

    expect(progress.seen).toBe(2);
    expect(progress.correct).toBe(1); // Didn't increment
    expect(progress.repetitions).toBe(0); // Reset to 0
    expect(progress.intervalDays).toBe(1); // Reset to 1 day interval
    expect(progress.easeFactor < 2.5).toBe(true); // Ease factor dropped
  });

  it('progresses intervals correctly on sequential correct answers', () => {
    let progress = createCharacterProgress('h1');
    
    // Repetition 1
    progress = applySrs(progress, 4);
    expect(progress.intervalDays).toBe(1);
    
    // Repetition 2
    progress = applySrs(progress, 4);
    expect(progress.intervalDays).toBe(6);
    
    // Repetition 3
    progress = applySrs(progress, 4);
    expect(progress.intervalDays).toBe(15); // 6 * 2.5 = 15

    expect(progress.repetitions).toBe(3);
  });

  it('handles edge case: extremely low ease factor floors at 1.3', () => {
    let progress = createCharacterProgress('h1');
    // Fail repeatedly to bottom out easeFactor
    for (let i = 0; i < 10; i++) {
      progress = applySrs(progress, 1);
    }
    expect(progress.easeFactor).toBe(1.3);
  });

  it('reports due correctly', () => {
    let progress = createCharacterProgress('h1');
    
    // Immediately due
    expect(isDueForReview(progress)).toBe(true);

    progress = applySrs(progress, 4);
    
    // Interval was set to 1 day later
    expect(isDueForReview(progress)).toBe(false);

    // Fast forward 1.5 days
    vi.setSystemTime(new Date('2026-04-04T12:00:00.000Z'));
    expect(isDueForReview(progress)).toBe(true);
  });
});
