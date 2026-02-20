import React from 'react';
import { ProgressState } from '../types';

interface ProgressBarProps {
  progress: ProgressState;
  total: number;
  title?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  total, 
  title = "Learning Progress" 
}) => {
  const completedCount = Object.values(progress.characterProgress).filter((item) => item.correct > 0).length;
  const percentage = total > 0 ? (completedCount / total) * 100 : 0;
  const accuracy = progress.totalSeen > 0 ? (progress.totalCorrect / progress.totalSeen) * 100 : 0;

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border shadow-soft">
      <h3 className="text-lg font-semibold text-ink mb-4">{title}</h3>
      
      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-muted mb-2">
            <span>Characters Mastered</span>
            <span>{completedCount} / {total}</span>
          </div>
          <div className="w-full bg-paper2 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-right text-sm text-muted mt-1">
            {percentage.toFixed(1)}%
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{progress.score}</div>
            <div className="text-sm text-muted">Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{accuracy.toFixed(0)}%</div>
            <div className="text-sm text-muted">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-600">{progress.currentStreak}</div>
            <div className="text-sm text-muted">Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{progress.bestStreak}</div>
            <div className="text-sm text-muted">Best</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
