import React, { useState, useEffect, useMemo } from 'react';
import { RotateCcw, Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import QuizQuestionComponent from '../components/QuizQuestion';
import ProgressBar from '../components/ProgressBar';
import { hiraganaData, katakanaData } from '../data/kanaData';
import { KanaCharacter, QuizQuestion } from '../types';
import { useProgress } from '../hooks/useProgress';

// Fisher-Yates shuffle for unbiased randomization
const fisherYatesShuffle = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Quiz: React.FC = () => {
  const [mode, setMode] = useState<'hiragana' | 'katakana' | 'mixed'>('mixed');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const { progress, updateProgress } = useProgress();

  const generateQuestions = (count: number = 10): QuizQuestion[] => {
    let sourceData: KanaCharacter[] = [];
    
    switch (mode) {
      case 'hiragana':
        sourceData = hiraganaData;
        break;
      case 'katakana':
        sourceData = katakanaData;
        break;
      case 'mixed':
        sourceData = [...hiraganaData, ...katakanaData];
        break;
    }

    const shuffled = fisherYatesShuffle(sourceData);
    const selectedChars = shuffled.slice(0, count);

    return selectedChars.map(char => {
      // Get 3 random wrong answers
      const wrongAnswers = fisherYatesShuffle(
        sourceData.filter(c => c.romaji !== char.romaji || c.type !== char.type)
      )
        .slice(0, 3)
        .map(c => {
          // In mixed mode, add script type label to avoid duplicate romaji confusion
          if (mode === 'mixed') {
            return `${c.romaji} [${c.type === 'hiragana' ? 'Hiragana' : 'Katakana'}]`;
          }
          return c.romaji;
        });

      // Format correct answer with script type label in mixed mode
      const correctAnswer = mode === 'mixed' 
        ? `${char.romaji} [${char.type === 'hiragana' ? 'Hiragana' : 'Katakana'}]`
        : char.romaji;

      // Shuffle all options using Fisher-Yates
      const options = fisherYatesShuffle([correctAnswer, ...wrongAnswers]);

      return {
        character: char,
        options,
        correctAnswer,
      };
    });
  };

  const startQuiz = () => {
    const newQuestions = generateQuestions();
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setIsQuizComplete(false);
    setSessionScore(0);
    setSessionCorrect(0);
    setSessionTotal(0);
  };

  const handleAnswer = (correct: boolean) => {
    const currentQuestion = questions[currentQuestionIndex];
    updateProgress(correct, currentQuestion.character.id);
    
    setSessionTotal(prev => prev + 1);
    if (correct) {
      setSessionCorrect(prev => prev + 1);
      setSessionScore(prev => prev + 10);
    }

    if (currentQuestionIndex + 1 >= questions.length) {
      setIsQuizComplete(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const restartQuiz = () => {
    startQuiz();
  };

  useEffect(() => {
    startQuiz();
  }, [mode]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p>Preparing your quiz...</p>
        </div>
      </div>
    );
  }

  if (isQuizComplete) {
    const percentage = sessionTotal > 0 ? (sessionCorrect / sessionTotal) * 100 : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h1>
            <p className="text-xl text-gray-400">Well done on completing the quiz!</p>
          </div>

          {/* Results */}
          <div className="bg-dark-800 rounded-2xl p-8 border border-dark-700 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Results</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-400 mb-2">{sessionScore}</div>
                <div className="text-gray-400">Points Earned</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">{percentage.toFixed(0)}%</div>
                <div className="text-gray-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{sessionCorrect}/{sessionTotal}</div>
                <div className="text-gray-400">Correct Answers</div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className={`text-lg font-semibold ${
                percentage >= 80 ? 'text-green-400' : 
                percentage >= 60 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {percentage >= 80 ? '素晴らしい！ (Excellent!)' :
                 percentage >= 60 ? '良い！ (Good!)' : '頑張って！ (Keep trying!)'}
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={restartQuiz}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Try Again</span>
                </button>
                
                <Link
                  to="/learn"
                  className="flex items-center space-x-2 px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg font-semibold transition-colors"
                >
                  <span>Practice More</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Overall Progress */}
          <ProgressBar 
            progress={progress} 
            total={hiraganaData.length + katakanaData.length}
            title="Overall Progress"
          />
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Japanese Kana Quiz</h1>
          <p className="text-gray-400 text-lg">Test your knowledge and improve your skills</p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-dark-800 rounded-full p-1 border border-dark-700">
            <button
              onClick={() => setMode('hiragana')}
              className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                mode === 'hiragana'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Hiragana
            </button>
            <button
              onClick={() => setMode('katakana')}
              className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                mode === 'katakana'
                  ? 'bg-secondary-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Katakana
            </button>
            <button
              onClick={() => setMode('mixed')}
              className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                mode === 'mixed'
                  ? 'bg-accent-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Mixed
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="text-center mb-8">
          <div className="text-sm text-gray-400 mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="w-full max-w-md mx-auto bg-dark-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Score */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-4 bg-dark-800 rounded-full px-6 py-2 border border-dark-700">
            <div className="text-sm text-gray-400">Score:</div>
            <div className="text-lg font-bold text-accent-400">{sessionScore}</div>
            <div className="text-sm text-gray-400">|</div>
            <div className="text-sm text-gray-400">Correct:</div>
            <div className="text-lg font-bold text-green-400">{sessionCorrect}/{sessionTotal}</div>
          </div>
        </div>

        {/* Question */}
        <QuizQuestionComponent
          question={currentQuestion}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
};

export default Quiz;