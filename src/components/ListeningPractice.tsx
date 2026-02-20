import React, { useCallback, useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { KanaCharacter } from '../types';
import { useAudio } from '../hooks/useAudio';

interface ListeningPracticeProps {
  data: KanaCharacter[];
  onAnswer?: (correct: boolean, characterId: string) => void;
}

const shuffle = <T,>(items: T[]) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const ListeningPractice: React.FC<ListeningPracticeProps> = ({ data, onAnswer }) => {
  const { playPronunciation } = useAudio();
  const [current, setCurrent] = useState<KanaCharacter | null>(null);
  const [options, setOptions] = useState<KanaCharacter[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const generateQuestion = useCallback(() => {
    if (data.length === 0) return;
    const shuffled = shuffle(data);
    const next = shuffled[0];
    const optionPool = shuffle(shuffled.slice(1)).slice(0, 3);
    const nextOptions = shuffle([next, ...optionPool]);
    setCurrent(next);
    setOptions(nextOptions);
    setFeedback('idle');
  }, [data]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = (option: KanaCharacter) => {
    if (!current) return;
    const correct = option.id === current.id;
    setFeedback(correct ? 'correct' : 'incorrect');
    onAnswer?.(correct, current.id);
    setTimeout(() => generateQuestion(), 900);
  };

  if (!current) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
        <p className="text-muted">Preparing your listening practice...</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-muted">Listening</div>
          <div className="mt-1 text-lg font-semibold text-ink">Which kana did you hear?</div>
        </div>
        <button
          onClick={() => playPronunciation(current.romaji, current.type)}
          className="flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-primary-600"
        >
          <Volume2 className="h-4 w-4" />
          Play Audio
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleAnswer(option)}
            className="rounded-2xl border border-border bg-paper2 px-4 py-6 text-3xl font-japanese text-ink shadow-soft transition hover:bg-white"
          >
            {option.character}
          </button>
        ))}
      </div>

      {feedback !== 'idle' && (
        <div className={`mt-4 text-sm font-semibold ${feedback === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {feedback === 'correct' ? 'Correct! Great listening.' : 'Not quite. Try the next one.'}
        </div>
      )}
    </div>
  );
};

export default ListeningPractice;
