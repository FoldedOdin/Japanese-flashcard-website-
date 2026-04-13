import { useMemo } from 'react';
import { KanaCharacter } from '../types';
import { CharacterProgress } from '../types';

/**
 * Returns cards where the user has:
 * - seen the card more than 3 times
 * - gotten it wrong more than half the time
 *
 * These are "leech" cards — the ones causing the most friction.
 * Used by AiCoach and Statistics to give data-driven insights.
 */
export const useWeakCards = (
  characterProgress: Record<string, CharacterProgress>,
  allCards: KanaCharacter[]
): KanaCharacter[] => {
  return useMemo(() => {
    return allCards.filter((card) => {
      const progress = characterProgress[card.id];
      if (!progress) return false;
      return progress.seen > 3 && progress.correct < progress.seen / 2;
    });
  }, [characterProgress, allCards]);
};
