import React, { useState, useEffect } from 'react';
import { Volume2, RotateCcw } from 'lucide-react';
import { KanaCharacter } from '../types';
import { useAudio } from '../hooks/useAudio';

interface FlashCardProps {
  character: KanaCharacter;
  showRomaji?: boolean;
  onFlip?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onAnswer?: (grade: number) => void;
}

const FlashCard: React.FC<FlashCardProps> = ({ 
  character, 
  showRomaji = false,
  onFlip,
  onNext,
  onPrevious,
  onAnswer
}) => {
  const [isFlipped, setIsFlipped] = useState(showRomaji);
  const { playPronunciation } = useAudio();

  // Sync isFlipped with showRomaji prop to avoid state drift
  useEffect(() => {
    setIsFlipped(showRomaji);
  }, [showRomaji]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  const handlePlayAudio = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    playPronunciation(character.romaji, character.type);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    } else if (e.key === 'ArrowRight' && onNext) {
      e.preventDefault();
      onNext();
    } else if (e.key === 'ArrowLeft' && onPrevious) {
      e.preventDefault();
      onPrevious();
    } else if (isFlipped && onAnswer) {
      if (e.key === '1') {
        e.preventDefault();
        e.stopPropagation();
        onAnswer(3);
      } else if (e.key === '2') {
        e.preventDefault();
        e.stopPropagation();
        onAnswer(4);
      } else if (e.key === '3') {
        e.preventDefault();
        e.stopPropagation();
        onAnswer(5);
      }
    }
  };

  return (
    <div className="relative w-80 h-80 perspective-1000">
      <div 
        className={`flashcard relative w-full h-full transform-style-preserve-3d cursor-pointer transition-transform duration-300 hover:scale-[1.02] ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={`Flash card showing ${character.character}. ${isFlipped ? 'Showing pronunciation' : 'Press to reveal pronunciation'}`}
      >
        {/* Front of card - Character */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="w-full h-full rounded-3xl border border-border bg-surface shadow-paper flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-paper-texture opacity-60" />
            
            <div 
              className="text-8xl font-bold text-ink mb-4 relative z-10 font-japanese"
              id={`pronunciation-${character.id}`}
            >
              {character.character}
            </div>
            
            <div className="text-sm text-muted uppercase tracking-wider mb-4">
              {character.type} • {character.category}
            </div>
            
            <button
              onClick={handlePlayAudio}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  handlePlayAudio(e);
                }
              }}
              aria-label={`Replay pronunciation for ${character.character} (${character.type})`}
              className="absolute bottom-6 right-6 p-3 bg-primary-500 hover:bg-primary-600 focus:ring-2 focus:ring-primary-400 focus:outline-none rounded-full text-white transition-colors shadow-lg"
            >
              <Volume2 className="h-5 w-5" />
            </button>
            
            <div className="absolute bottom-6 left-6 text-muted" aria-hidden="true">
              <RotateCcw className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Back of card - Romaji */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full rounded-3xl border border-border bg-paper2 shadow-paper flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-paper-texture opacity-60" />
            
            <div className="text-6xl font-bold text-ink mb-4 relative z-10" aria-live="polite">
              {character.romaji}
            </div>
            
            <div className="text-lg text-muted mb-2 flex items-center justify-center gap-2">
              Pronunciation
              <button
                onClick={(e) => { e.stopPropagation(); handlePlayAudio(e); }}
                className="p-1.5 bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 rounded-full transition-colors"
                aria-label="Play audio"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            
            {onAnswer ? (
              <div className="flex flex-col items-center gap-3 mt-4 w-full px-6" onClick={e => e.stopPropagation()}>
                <div className="text-xs text-muted uppercase tracking-wider font-semibold">How well did you know this?</div>
                <div className="flex justify-center gap-2 w-full">
                  <button
                    onClick={(e) => { e.stopPropagation(); onAnswer(3); }}
                    className="flex-1 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all border border-red-500/20 text-sm hover:scale-105 active:scale-95"
                  >
                    Hard <span className="opacity-60 ml-1 px-1 rounded bg-black/10 font-mono text-[10px]">1</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onAnswer(4); }}
                    className="flex-1 py-3 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-xl font-bold transition-all border border-amber-500/20 text-sm hover:scale-105 active:scale-95"
                  >
                    Good <span className="opacity-60 ml-1 px-1 rounded bg-black/10 font-mono text-[10px]">2</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onAnswer(5); }}
                    className="flex-1 py-3 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl font-bold transition-all border border-emerald-500/20 text-sm hover:scale-105 active:scale-95"
                  >
                    Easy <span className="opacity-60 ml-1 px-1 rounded bg-black/10 font-mono text-[10px]">3</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handlePlayAudio}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    handlePlayAudio(e);
                  }
                }}
                aria-label={`Replay pronunciation for ${character.character} (${character.type})`}
                className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 focus:ring-2 focus:ring-primary-400 focus:outline-none rounded-full text-white transition-colors shadow-lg mt-2"
              >
                <Volume2 className="h-5 w-5" />
                <span>Play Audio</span>
              </button>
            )}
            
            <div className="absolute bottom-6 left-6 text-muted" aria-hidden="true">
              <RotateCcw className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
