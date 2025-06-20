import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import FlashCard from '../components/FlashCard';
import ProgressBar from '../components/ProgressBar';
import { hiraganaData, katakanaData } from '../data/kanaData';
import { KanaCharacter } from '../types';
import { useProgress } from '../hooks/useProgress';

const Learn: React.FC = () => {
  const [mode, setMode] = useState<'hiragana' | 'katakana'>('hiragana');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRomaji, setShowRomaji] = useState(false);
  const { progress, updateProgress } = useProgress();

  const currentData = mode === 'hiragana' ? hiraganaData : katakanaData;
  const currentCharacter = currentData[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % currentData.length);
    setShowRomaji(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + currentData.length) % currentData.length);
    setShowRomaji(false);
  };

  const handleFlip = () => {
    if (!showRomaji) {
      updateProgress(true, currentCharacter.id);
    }
    setShowRomaji(!showRomaji);
  };

  const switchMode = (newMode: 'hiragana' | 'katakana') => {
    setMode(newMode);
    setCurrentIndex(0);
    setShowRomaji(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case ' ':
          e.preventDefault();
          handleFlip();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showRomaji, currentCharacter.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Learn Japanese Kana</h1>
          <p className="text-gray-400 text-lg">Master Hiragana and Katakana with interactive flashcards</p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-dark-800 rounded-full p-1 border border-dark-700">
            <button
              onClick={() => switchMode('hiragana')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                mode === 'hiragana'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ひらがな Hiragana
            </button>
            <button
              onClick={() => switchMode('katakana')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                mode === 'katakana'
                  ? 'bg-secondary-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              カタカナ Katakana
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="text-center mb-8">
          <div className="text-sm text-gray-400 mb-2">
            Character {currentIndex + 1} of {currentData.length}
          </div>
          <div className="w-full max-w-md mx-auto bg-dark-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / currentData.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Card Area */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex items-center space-x-8">
            <button
              onClick={goToPrevious}
              className="p-4 bg-dark-800 hover:bg-dark-700 rounded-full border border-dark-600 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <FlashCard 
              character={currentCharacter} 
              showRomaji={showRomaji}
              onFlip={handleFlip}
            />

            <button
              onClick={goToNext}
              className="p-4 bg-dark-800 hover:bg-dark-700 rounded-full border border-dark-600 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={handleFlip}
              className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-semibold transition-colors"
            >
              {showRomaji ? 'Show Character' : 'Show Romaji'}
            </button>
            
            <Link
              to="/quiz"
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
            >
              Take Quiz
            </Link>
          </div>

          <div className="text-sm text-gray-500">
            Use arrow keys to navigate • Press spacebar to flip card
          </div>
        </div>

        {/* Progress Stats */}
        <div className="max-w-4xl mx-auto">
          <ProgressBar 
            progress={progress} 
            total={hiraganaData.length + katakanaData.length}
            title="Overall Progress"
          />
        </div>

        {/* Character Info */}
        <div className="max-w-2xl mx-auto mt-8 bg-dark-800 rounded-lg p-6 border border-dark-700">
          <h3 className="text-lg font-semibold text-white mb-4">Character Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">Character</div>
              <div className="text-2xl font-bold text-white">{currentCharacter.character}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Romaji</div>
              <div className="text-2xl font-bold text-white">{currentCharacter.romaji}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Type</div>
              <div className="text-lg text-white capitalize">{currentCharacter.type}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Category</div>
              <div className="text-lg text-white">{currentCharacter.category}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;