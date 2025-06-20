export interface KanaCharacter {
  id: string;
  character: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  category: string;
}

export interface UserProgress {
  totalSeen: number;
  totalCorrect: number;
  currentStreak: number;
  bestStreak: number;
  completedCharacters: Set<string>;
  score: number;
}

export interface QuizQuestion {
  character: KanaCharacter;
  options: string[];
  correctAnswer: string;
}