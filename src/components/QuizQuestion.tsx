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

  const prompt =
    question.questionType === 'kana_to_romaji'
      ? 'What is the romaji for this character?'
      : question.questionType === 'romaji_to_kana'
        ? 'Select the kana for this romaji.'
        : 'Listen and choose the correct kana.';

  const display = question.questionType === 'romaji_to_kana'
    ? question.character.romaji
    : question.questionType === 'audio_to_kana'
      ? 'Listen'
      : question.character.character;

  return (
    <div className="bg-surface rounded-3xl p-8 border border-border shadow-soft max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-ink mb-4 relative inline-flex items-center justify-center space-x-3">
          <span className={question.questionType === 'romaji_to_kana' ? 'text-4xl font-semibold' : 'font-japanese'}>
            {display}
          </span>
          <button
            onClick={handlePlayAudio}
            aria-label={`Play pronunciation for ${question.character.character} (${question.character.type})`}
            className="p-2 bg-primary-500 hover:bg-primary-600 focus:ring-2 focus:ring-primary-400 focus:outline-none rounded-full text-white transition-colors"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-muted text-lg">{prompt}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === question.correctAnswer;
          
          let buttonClass = "quiz-option p-4 rounded-2xl border-2 font-semibold text-lg ";
          
          if (showResult) {
            if (isCorrect) {
              buttonClass += "bg-emerald-500 border-emerald-400 text-white";
            } else if (isSelected && !isCorrect) {
              buttonClass += "bg-rose-500 border-rose-400 text-white";
            } else {
              buttonClass += "bg-paper2 border-border text-muted";
            }
          } else {
            buttonClass += "bg-paper2 border-border text-ink hover:border-primary-500 hover:bg-white focus:ring-2 focus:ring-primary-400 focus:outline-none";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={buttonClass}
              disabled={showResult}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className={question.questionType !== 'kana_to_romaji' ? 'font-japanese text-2xl' : ''}>
                  {option}
                </span>
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
            selectedAnswer === question.correctAnswer ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {selectedAnswer === question.correctAnswer ? '正解！ (Correct!)' : '間違い (Try again!)'}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizQuestionComponent;
