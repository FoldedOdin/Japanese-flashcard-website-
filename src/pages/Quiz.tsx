import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { RotateCcw, Trophy, ArrowRight, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import QuizQuestionComponent from '../components/QuizQuestion';
import ProgressBar from '../components/ProgressBar';
import { hiraganaData, katakanaData, getAllKana } from '../data/kanaData';
import { KanaCharacter, QuestionType, QuizQuestion, StudySession } from '../types';
import { useProgressStore } from '../hooks/useProgressStore';
import { fireConfetti } from '../utils/confetti';

const fisherYatesShuffle = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Quiz: React.FC = () => {
  const { state, recordAnswer, addSession, updateSettings, scheduleReview } = useProgressStore();
  const [mode, setMode] = useState<'hiragana' | 'katakana' | 'mixed'>('mixed');
  const [questionType, setQuestionType] = useState<QuestionType>(state.settings.questionType);
  const [questionCount, setQuestionCount] = useState(state.settings.quizQuestionCount);
  const [timerEnabled, setTimerEnabled] = useState(state.settings.quizTimerEnabled);
  const [timerSeconds, setTimerSeconds] = useState(state.settings.quizTimerSeconds);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [mistakes, setMistakes] = useState<KanaCharacter[]>([]);
  const [sessionStart, setSessionStart] = useState(() => new Date());
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);

  const sourceData: KanaCharacter[] = useMemo(() => {
    switch (mode) {
      case 'hiragana':
        return hiraganaData;
      case 'katakana':
        return katakanaData;
      default:
        return getAllKana();
    }
  }, [mode]);

  const generateQuestions = useCallback((count: number = 10, type: QuestionType): QuizQuestion[] => {
    const shuffled = fisherYatesShuffle(sourceData);
    const selectedChars = shuffled.slice(0, count);

    return selectedChars.map((char) => {
      if (type === 'kana_to_romaji') {
        const wrongAnswers = fisherYatesShuffle(
          sourceData.filter((c) => c.romaji !== char.romaji)
        )
          .slice(0, 3)
          .map((c) => c.romaji);
        const options = fisherYatesShuffle([char.romaji, ...wrongAnswers]);
        return {
          character: char,
          options,
          correctAnswer: char.romaji,
          questionType: type,
        };
      }

      const wrongCharacters = fisherYatesShuffle(
        sourceData.filter((c) => c.id !== char.id)
      ).slice(0, 3);
      const options = fisherYatesShuffle([char, ...wrongCharacters]).map((c) => c.character);

      return {
        character: char,
        options,
        correctAnswer: char.character,
        questionType: type,
      };
    });
  }, [sourceData]);

  const startQuiz = useCallback(() => {
    const newQuestions = generateQuestions(questionCount, questionType);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setIsQuizComplete(false);
    setSessionScore(0);
    setSessionCorrect(0);
    setSessionTotal(0);
    setMistakes([]);
    setSessionStart(new Date());
    setTimeLeft(timerSeconds);
    setIsAnswerLocked(false);

    updateSettings({
      quizQuestionCount: questionCount,
      questionType,
      quizTimerEnabled: timerEnabled,
      quizTimerSeconds: timerSeconds,
    });
  }, [questionCount, questionType, timerEnabled, timerSeconds, generateQuestions, updateSettings]);

  const finalizeSession = useCallback((total = sessionTotal, correct = sessionCorrect) => {
    const end = new Date();
    const durationSec = Math.max(1, Math.round((end.getTime() - sessionStart.getTime()) / 1000));
    const session: StudySession = {
      id: crypto.randomUUID(),
      mode: 'quiz',
      startedAt: sessionStart.toISOString(),
      endedAt: end.toISOString(),
      totalQuestions: total,
      correctAnswers: correct,
      accuracy: total > 0 ? correct / total : 0,
      durationSec,
    };
    addSession(session);
  }, [sessionTotal, sessionCorrect, sessionStart, addSession]);

  const handleAnswer = useCallback((correct: boolean, confidence?: 'easy' | 'medium' | 'hard') => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    setIsAnswerLocked(true);

    recordAnswer(currentQuestion.character.id, correct, confidence);
    const nextTotal = sessionTotal + 1;
    const nextCorrect = correct ? sessionCorrect + 1 : sessionCorrect;
    const nextScore = correct ? sessionScore + 10 : sessionScore;

    setSessionTotal(nextTotal);
    setSessionCorrect(nextCorrect);
    setSessionScore(nextScore);

    if (!correct) {
      setMistakes((prev) => {
        if (prev.some((item) => item.id === currentQuestion.character.id)) return prev;
        return [...prev, currentQuestion.character];
      });
    }

    if (currentQuestionIndex + 1 >= questions.length) {
      setIsQuizComplete(true);
      finalizeSession(nextTotal, nextCorrect);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [questions, currentQuestionIndex, recordAnswer, sessionTotal, sessionCorrect, sessionScore, finalizeSession]);

  useEffect(() => {
    startQuiz();
  }, [mode, startQuiz]);

  useEffect(() => {
    if (isQuizComplete) {
      const percentage = sessionTotal > 0 ? (sessionCorrect / sessionTotal) * 100 : 0;
      if (percentage >= 80) {
        fireConfetti();
      }
    }
  }, [isQuizComplete, sessionCorrect, sessionTotal]);

  useEffect(() => {
    setIsAnswerLocked(false);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (!timerEnabled || isQuizComplete || isAnswerLocked) return;
    setTimeLeft(timerSeconds);
    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          handleAnswer(false);
          return timerSeconds;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [currentQuestionIndex, timerEnabled, timerSeconds, isQuizComplete, isAnswerLocked, handleAnswer]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center text-muted">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p>Preparing your quiz...</p>
        </div>
      </div>
    );
  }

  if (isQuizComplete) {
    const percentage = sessionTotal > 0 ? (sessionCorrect / sessionTotal) * 100 : 0;

    return (
      <div className="min-h-screen bg-paper py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
              <Trophy className="h-10 w-10 text-primary-600" />
            </div>
            <h1 className="text-3xl font-semibold font-display text-ink mb-2">Quiz Complete!</h1>
            <p className="text-muted">Review your results and reinforce any weak spots.</p>
          </div>

          <div className="bg-surface rounded-3xl p-8 border border-border shadow-soft mb-8">
            <h2 className="text-xl font-semibold text-ink mb-6 text-center">Your Results</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">{sessionScore}</div>
                <div className="text-muted">Points Earned</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">{percentage.toFixed(0)}%</div>
                <div className="text-muted">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary-600 mb-2">{sessionCorrect}/{sessionTotal}</div>
                <div className="text-muted">Correct Answers</div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className={`text-lg font-semibold ${
                percentage >= 80 ? 'text-emerald-600' :
                percentage >= 60 ? 'text-amber-600' : 'text-rose-600'
              }`}>
                {percentage >= 80 ? '素晴らしい！ (Excellent!)' :
                 percentage >= 60 ? '良い！ (Good!)' : '頑張って！ (Keep trying!)'}
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={startQuiz}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-semibold transition-colors"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Try Again</span>
                </button>

                <Link
                  to="/learn"
                  className="flex items-center space-x-2 px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white rounded-full font-semibold transition-colors"
                >
                  <span>Practice More</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          {mistakes.length > 0 && (
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-soft mb-8">
              <h3 className="text-lg font-semibold text-ink mb-4">Mistakes to Review</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {mistakes.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-border bg-paper2 px-4 py-3">
                    <div>
                      <div className="text-2xl font-japanese">{item.character}</div>
                      <div className="text-sm text-muted">{item.romaji}</div>
                    </div>
                    <button
                      onClick={() => scheduleReview(item.id)}
                      className="rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold text-white"
                    >
                      Add to Review
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ProgressBar progress={state} total={getAllKana().length} title="Overall Progress" />
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-paper py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold font-display text-ink mb-2">Japanese Kana Quiz</h1>
          <p className="text-muted">Customize your session and sharpen recall.</p>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft mb-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-xs uppercase text-muted">Mode</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {['hiragana', 'katakana', 'mixed'].map((value) => (
                  <button
                    key={value}
                    onClick={() => setMode(value as typeof mode)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      mode === value ? 'bg-primary-500 text-white' : 'bg-paper2 text-muted'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Questions</label>
              <input
                type="number"
                min={5}
                max={30}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-border bg-paper2 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Question Type</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                className="mt-2 w-full rounded-xl border border-border bg-paper2 px-3 py-2 text-sm"
              >
                <option value="kana_to_romaji">Kana → Romaji</option>
                <option value="romaji_to_kana">Romaji → Kana</option>
                <option value="audio_to_kana">Audio → Kana</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Timer</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={timerEnabled}
                  onChange={(e) => setTimerEnabled(e.target.checked)}
                />
                <input
                  type="number"
                  min={10}
                  max={60}
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(Number(e.target.value))}
                  className="w-20 rounded-xl border border-border bg-paper2 px-2 py-1 text-sm"
                />
                <span className="text-xs text-muted">sec</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={startQuiz}
              className="rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Restart Quiz
            </button>
            <div className="text-sm text-muted">Question {currentQuestionIndex + 1} of {questions.length}</div>
            {timerEnabled && (
              <div className="ml-auto flex items-center gap-2 text-sm text-muted">
                <Timer className="h-4 w-4" />
                {timeLeft}s
              </div>
            )}
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-4 bg-surface rounded-full px-6 py-2 border border-border shadow-soft">
            <div className="text-sm text-muted">Score:</div>
            <div className="text-lg font-bold text-primary-600">{sessionScore}</div>
            <div className="text-sm text-muted">|</div>
            <div className="text-sm text-muted">Correct:</div>
            <div className="text-lg font-bold text-emerald-600">{sessionCorrect}/{sessionTotal}</div>
          </div>
        </div>

        <QuizQuestionComponent
          key={currentQuestionIndex}
          question={currentQuestion}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
};

export default Quiz;
