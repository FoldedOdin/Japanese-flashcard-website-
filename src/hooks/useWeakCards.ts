import { useMemo } from 'react';
import { KanaCharacter } from '../types';
import { CharacterProgress } from '../types';

/**
 * Identifies cards that need focused attention.
 *
 * weakCards   — seen > 3× but < 50% accuracy (struggling)
 * leechCards  — isLeech=true OR failCount >= 4 (deeply stuck; triggers escalation)
 *
 * Both are injected into sessions by Learn.tsx to drive user behavior,
 * not just observed in Statistics.tsx.
 */
export const useWeakCards = (
  characterProgress: Record<string, CharacterProgress>,
  allCards: KanaCharacter[]
): { weakCards: KanaCharacter[]; leechCards: KanaCharacter[] } => {
  return useMemo(() => {
    const weakCards: KanaCharacter[] = [];
    const leechCards: KanaCharacter[] = [];

    allCards.forEach((card) => {
      const progress = characterProgress[card.id];
      if (!progress) return;

      const isWeak = progress.seen > 3 && progress.correct < progress.seen / 2;
      const isLeech = (progress.isLeech === true) || (progress.failCount ?? 0) >= 4;

      // Leeches are a strict superset of weak cards — they've graduated to needing escalation
      if (isLeech) {
        leechCards.push(card);
      } else if (isWeak) {
        weakCards.push(card);
      }
    });

    // Sort by accuracy ASC (worst first) for both lists
    const byAccuracy = (a: KanaCharacter, b: KanaCharacter) => {
      const pa = characterProgress[a.id];
      const pb = characterProgress[b.id];
      const accA = pa ? pa.correct / Math.max(1, pa.seen) : 0;
      const accB = pb ? pb.correct / Math.max(1, pb.seen) : 0;
      return accA - accB;
    };

    return {
      weakCards: weakCards.sort(byAccuracy),
      leechCards: leechCards.sort(byAccuracy),
    };
  }, [characterProgress, allCards]);
};
