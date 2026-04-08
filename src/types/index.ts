export interface KanaCharacter {
  id: string;
  character: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  category: string;
  scriptType?: 'hiragana' | 'katakana'; // For data validation and display
  isCombo?: boolean;
  base?: string;
  strokeCount?: number;
}

export type QuestionType = 'kana_to_romaji' | 'romaji_to_kana' | 'audio_to_kana';

export interface CharacterProgress {
  characterId: string;
  seen: number;
  correct: number;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: string | null;
  lastSeenAt: string | null;
  updatedAt: string;
}

export interface KanaCityDistrict {
  districtId: string;
  status: 'locked' | 'active' | 'mastered';
  unlockedAt: string | null;
  masteredAt: string | null;
}

export interface StudySession {
  id: string;
  mode: 'flashcard' | 'quiz' | 'review' | 'writing' | 'listening';
  startedAt: string;
  endedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  durationSec: number;
}

export interface UserSettings {
  dailyGoal: number;
  autoAdvance: boolean;
  audioEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  quizQuestionCount: number;
  quizTimerEnabled: boolean;
  quizTimerSeconds: number;
  questionType: QuestionType;
}

export interface SyncState {
  status: 'idle' | 'syncing' | 'error';
  lastSyncAt: string | null;
  error: string | null;
}

export interface PendingEvent {
  id: string; // UUID for idempotency
  type: 'ANSWER_SUBMITTED' | 'SESSION_COMPLETED';
  payload: Record<string, unknown>;
  createdAt: number;
  retryCount: number;
}

export interface GamificationProfile {
  xp: number;
  level: number;
  streakShields: number;
}

export interface Mission {
  id: string;
  type: 'daily' | 'weekly';
  description: string;
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  xpReward: number;
  expiresAt: string;
}

export interface ProgressState {
  totalSeen: number;
  totalCorrect: number;
  currentStreak: number;
  bestStreak: number;
  score: number;
  lastStudyDate: string | null;
  characterProgress: Record<string, CharacterProgress>;
  studySessions: StudySession[];
  achievementUnlocks: Record<string, string>;
  kanaCity: Record<string, KanaCityDistrict>;
  settings: UserSettings;
  gamification: GamificationProfile;
  missions: Mission[];
  sync: SyncState;
  pendingEvents: PendingEvent[]; // Offline Queue
  updatedAt: string;
}

export interface QuizQuestion {
  character: KanaCharacter;
  options: string[];
  correctAnswer: string;
  questionType: QuestionType;
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
