import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  // Learning Category
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Complete your first flashcard session',
    icon: '👟',
    maxProgress: 1,
    progress: 0,
    category: 'learning'
  },
  {
    id: 'hiragana_basics',
    title: 'Hiragana Explorer',
    description: 'Learn your first 10 Hiragana characters',
    icon: 'あ',
    maxProgress: 10,
    progress: 0,
    category: 'learning'
  },
  {
    id: 'katakana_basics',
    title: 'Katakana Explorer',
    description: 'Learn your first 10 Katakana characters',
    icon: 'ア',
    maxProgress: 10,
    progress: 0,
    category: 'learning'
  },
  {
    id: 'half_hiragana',
    title: 'Hiragana Scholar',
    description: 'Master 23 Hiragana characters (50%)',
    icon: '🎓',
    maxProgress: 23,
    progress: 0,
    category: 'learning'
  },
  {
    id: 'full_hiragana',
    title: 'Hiragana Master',
    description: 'Master all 46 Hiragana characters',
    icon: '👑',
    maxProgress: 46,
    progress: 0,
    category: 'mastery'
  },
  {
    id: 'full_katakana',
    title: 'Katakana Master',
    description: 'Master all 46 Katakana characters',
    icon: '🏆',
    maxProgress: 46,
    progress: 0,
    category: 'mastery'
  },

  // Consistency Category
  {
    id: 'daily_learner',
    title: 'Daily Learner',
    description: 'Practice 3 days in a row',
    icon: '📅',
    maxProgress: 3,
    progress: 0,
    category: 'consistency'
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Maintain a 7-day study streak',
    icon: '🔥',
    maxProgress: 7,
    progress: 0,
    category: 'consistency'
  },
  {
    id: 'dedication',
    title: 'Dedication',
    description: 'Practice for 30 days straight',
    icon: '💎',
    maxProgress: 30,
    progress: 0,
    category: 'consistency'
  },

  // Mastery Category
  {
    id: 'accuracy_expert',
    title: 'Accuracy Expert',
    description: 'Achieve 90% accuracy in a quiz session',
    icon: '🎯',
    maxProgress: 1,
    progress: 0,
    category: 'mastery'
  },
  {
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Get 100% on any quiz',
    icon: '⭐',
    maxProgress: 1,
    progress: 0,
    category: 'mastery'
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Answer 50 questions correctly in under 2 minutes',
    icon: '⚡',
    maxProgress: 50,
    progress: 0,
    category: 'mastery'
  },

  // Special Category
  {
    id: 'quiz_master',
    title: 'Quiz Master',
    description: 'Complete 25 quiz sessions',
    icon: '🧠',
    maxProgress: 25,
    progress: 0,
    category: 'special'
  },
  {
    id: 'flashcard_enthusiast',
    title: 'Flashcard Enthusiast',
    description: 'Review 100 flashcards',
    icon: '🃏',
    maxProgress: 100,
    progress: 0,
    category: 'special'
  },
  {
    id: 'point_collector',
    title: 'Point Collector',
    description: 'Earn 1000 points',
    icon: '💰',
    maxProgress: 1000,
    progress: 0,
    category: 'special'
  },
  {
    id: 'completionist',
    title: 'Completionist',
    description: 'Master all Hiragana and Katakana characters',
    icon: '🎊',
    maxProgress: 92,
    progress: 0,
    category: 'special'
  }
];

export const getAchievementsByCategory = (category: Achievement['category']) => {
  return ACHIEVEMENTS.filter(achievement => achievement.category === category);
};

export const getUnlockedAchievements = (achievements: Achievement[]) => {
  return achievements.filter(achievement => achievement.unlockedAt);
};

export const getAchievementById = (id: string) => {
  return ACHIEVEMENTS.find(achievement => achievement.id === id);
};