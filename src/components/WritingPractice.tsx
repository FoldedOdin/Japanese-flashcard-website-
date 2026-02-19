import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, CheckCircle } from 'lucide-react';
import { KanaCharacter } from '../types';

interface WritingPracticeProps {
  character: KanaCharacter;
  onComplete?: (passed: boolean) => void;
}

const WritingPractice: React.FC<WritingPracticeProps> = ({ character, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [coverage, setCoverage] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const ratio = window.devicePixelRatio || 1;
    const size = 320;
    canvas.width = size * ratio;
    canvas.height = size * ratio;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    context.scale(ratio, ratio);
    context.lineWidth = 14;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#d97706';
  }, [character.id]);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return;
    setIsDrawing(true);
    const { x, y } = getPoint(event);
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return;
    const { x, y } = getPoint(event);
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setCoverage(0);
  };

  const calculateCoverage = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return 0;
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let count = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] > 0) {
        count += 1;
      }
    }
    return count / (canvas.width * canvas.height);
  };

  const handleCheck = () => {
    const ratio = calculateCoverage();
    setCoverage(ratio);
    const passed = ratio > 0.02;
    onComplete?.(passed);
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-muted">Writing Practice</div>
          <div className="mt-1 text-lg font-semibold text-ink">{character.romaji}</div>
        </div>
        <div className="text-sm text-muted">Strokes: {character.strokeCount ?? 3}</div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center text-7xl font-japanese text-muted opacity-30">
            {character.character}
          </div>
          <canvas
            ref={canvasRef}
            className="relative rounded-3xl border border-border bg-paper2"
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={clearCanvas}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-paper2 px-4 py-2 text-sm font-semibold text-muted hover:bg-white"
          >
            <RotateCcw className="h-4 w-4" />
            Clear
          </button>
          <button
            onClick={handleCheck}
            className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-primary-600"
          >
            <CheckCircle className="h-4 w-4" />
            Check
          </button>
        </div>
        <div className="text-sm text-muted">
          Coverage: {(coverage * 100).toFixed(1)}% {coverage > 0.02 ? 'Nice work!' : 'Keep tracing the guide.'}
        </div>
      </div>
    </div>
  );
};

export default WritingPractice;
