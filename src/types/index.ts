export interface KanaCharacter {
  id: string;
  character: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  category: string;
  scriptType?: 'hiragana' | 'katakana'; // For data validation and display
}

export interface UserProgress {
  totalSeen: number;
  totalCorrect: number;
  currentStreak: number;
  bestStreak: number;
  completedCharacters: Set<string>;
  score: number;
}

export enum MasteryLevel {
  LEARNING = 'learning',
  PRACTICING = 'practicing',
  MASTERED = 'mastered'
}

export interface CharacterMastery {
  characterId: string;
  level: MasteryLevel;
  correctCount: number;
  totalSeen: number;
  accuracy: number;
  lastPracticed: Date;
  timeToMaster?: number; // in seconds
}

export interface StudySession {
  id: string;
  date: Date;
  charactersStudied: string[];
  timeSpent: number; // in minutes
  accuracy: number;
  mode: 'flashcard' | 'quiz' | 'writing';
  totalQuestions: number;
  correctAnswers: number;
}

export interface DetailedProgress extends UserProgress {
  sessionsThisWeek: number;
  averageAccuracy: number;
  weakCharacters: string[];
  strongCharacters: string[];
  dailyStreak: number;
  weeklyGoal: number;
  characterMastery: Map<string, CharacterMastery>;
  studySessions: StudySession[];
  totalStudyTime: number; // in minutes
  lastStudyDate?: Date;
  weeklyStats: {
    sessionsCompleted: number;
    totalTime: number;
    averageAccuracy: number;
    charactersLearned: number;
  };
}

export interface QuizQuestion {
  character: KanaCharacter;
  options: string[];
  correctAnswer: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  category: 'learning' | 'consistency' | 'mastery' | 'special';
}