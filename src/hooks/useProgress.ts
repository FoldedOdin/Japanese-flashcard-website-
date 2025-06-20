import { useState, useEffect } from 'react';
import { UserProgress } from '../types';

const defaultProgress: UserProgress = {
  totalSeen: 0,
  totalCorrect: 0,
  currentStreak: 0,
  bestStreak: 0,
  completedCharacters: new Set(),
  score: 0,
};

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  useEffect(() => {
    const saved = localStorage.getItem('nihongo-flash-progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress({
          ...parsed,
          completedCharacters: new Set(parsed.completedCharacters || []),
        });
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    }
  }, []);

  const saveProgress = (newProgress: UserProgress) => {
    const toSave = {
      ...newProgress,
      completedCharacters: Array.from(newProgress.completedCharacters),
    };
    localStorage.setItem('nihongo-flash-progress', JSON.stringify(toSave));
    setProgress(newProgress);
  };

  const updateProgress = (correct: boolean, characterId: string) => {
    setProgress(current => {
      const newProgress = {
        ...current,
        totalSeen: current.totalSeen + 1,
        totalCorrect: correct ? current.totalCorrect + 1 : current.totalCorrect,
        currentStreak: correct ? current.currentStreak + 1 : 0,
        bestStreak: correct 
          ? Math.max(current.bestStreak, current.currentStreak + 1)
          : current.bestStreak,
        completedCharacters: correct 
          ? new Set([...current.completedCharacters, characterId])
          : current.completedCharacters,
        score: correct ? current.score + 10 : current.score,
      };
      
      saveProgress(newProgress);
      return newProgress;
    });
  };

  const resetProgress = () => {
    localStorage.removeItem('nihongo-flash-progress');
    setProgress(defaultProgress);
  };

  return {
    progress,
    updateProgress,
    resetProgress,
  };
};