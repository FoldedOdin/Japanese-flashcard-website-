import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Volume2 } from 'lucide-react';
import { QuizQuestion } from '../types';
import { useAudio } from '../hooks/useAudio';

interface QuizQuestionProps {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
}

const QuizQuestionComponent: React.FC<QuizQuestionProps> = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { playPronunciation } = useAudio();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    const correct = answer === question.correctAnswer;
    
    timeoutRef.current = setTimeout(() => {
      onAnswer(correct);
      setSelectedAnswer(null);
      setShowResult(false);
    }, 1500);
  };

  const handlePlayAudio = () => {
    playPronunciation(question.character.romaji, question.character.type);
  };

  // Cleanup timeout on unmount to prevent state updates after navigation
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-dark-800 rounded-2xl p-8 border border-dark-700 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-white mb-4 relative inline-block">
          {question.character.character}
          <button
            onClick={handlePlayAudio}
            aria-label={`Play pronunciation for ${question.character.character} (${question.character.type})`}
            className="absolute -top-2 -right-12 p-2 bg-accent-500 hover:bg-accent-600 focus:ring-2 focus:ring-accent-400 focus:outline-none rounded-full text-white transition-colors"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-gray-400 text-lg">What is the romaji for this character?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === question.correctAnswer;
          
          let buttonClass = "quiz-option p-4 rounded-lg border-2 font-semibold text-lg ";
          
          if (showResult) {
            if (isCorrect) {
              buttonClass += "bg-green-500 border-green-400 text-white";
            } else if (isSelected && !isCorrect) {
              buttonClass += "bg-red-500 border-red-400 text-white";
            } else {
              buttonClass += "bg-dark-700 border-dark-600 text-gray-400";
            }
          } else {
            buttonClass += "bg-dark-700 border-dark-600 text-white hover:border-primary-500 hover:bg-dark-600 focus:ring-2 focus:ring-primary-400 focus:outline-none";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={buttonClass}
              disabled={showResult}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>{option}</span>
                {showResult && isCorrect && <Check className="h-5 w-5" />}
                {showResult && isSelected && !isCorrect && <X className="h-5 w-5" />}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="text-center mt-6" role="status" aria-live="polite">
          <div className={`text-lg font-semibold ${
            selectedAnswer === question.correctAnswer ? 'text-green-400' : 'text-red-400'
          }`}>
            {selectedAnswer === question.correctAnswer ? '正解！ (Correct!)' : '間違い (Try again!)'}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizQuestionComponent;