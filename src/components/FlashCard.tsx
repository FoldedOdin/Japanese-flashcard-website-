import React, { useState } from 'react';
import { Volume2, RotateCcw } from 'lucide-react';
import { KanaCharacter } from '../types';
import { useAudio } from '../hooks/useAudio';

interface FlashCardProps {
  character: KanaCharacter;
  showRomaji?: boolean;
  onFlip?: () => void;
}

const FlashCard: React.FC<FlashCardProps> = ({ 
  character, 
  showRomaji = false,
  onFlip 
}) => {
  const [isFlipped, setIsFlipped] = useState(showRomaji);
  const { playPronunciation } = useAudio();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPronunciation(character.romaji);
  };

  return (
    <div className="relative w-80 h-80 perspective-1000">
      <div 
        className={`relative w-full h-full transition-transform duration-600 transform-style-preserve-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
      >
        {/* Front of card - Character */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl border border-dark-600 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10" />
            
            <div className="text-8xl font-bold text-white mb-4 relative z-10">
              {character.character}
            </div>
            
            <div className="text-sm text-gray-400 uppercase tracking-wider mb-4">
              {character.type}
            </div>
            
            <button
              onClick={handlePlayAudio}
              className="absolute bottom-6 right-6 p-3 bg-accent-500 hover:bg-accent-600 rounded-full text-white transition-colors shadow-lg"
            >
              <Volume2 className="h-5 w-5" />
            </button>
            
            <div className="absolute bottom-6 left-6 text-gray-500">
              <RotateCcw className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Back of card - Romaji */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-2xl border border-secondary-600 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/10 to-accent-500/10" />
            
            <div className="text-6xl font-bold text-white mb-4 relative z-10">
              {character.romaji}
            </div>
            
            <div className="text-lg text-gray-300 mb-2">
              Pronunciation
            </div>
            
            <button
              onClick={handlePlayAudio}
              className="flex items-center space-x-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 rounded-full text-white transition-colors shadow-lg"
            >
              <Volume2 className="h-5 w-5" />
              <span>Play Audio</span>
            </button>
            
            <div className="absolute bottom-6 left-6 text-gray-500">
              <RotateCcw className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;