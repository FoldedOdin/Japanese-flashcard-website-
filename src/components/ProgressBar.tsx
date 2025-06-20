import React from 'react';
import { UserProgress } from '../types';

interface ProgressBarProps {
  progress: UserProgress;
  total: number;
  title?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  total, 
  title = "Learning Progress" 
}) => {
  const percentage = total > 0 ? (progress.completedCharacters.size / total) * 100 : 0;
  const accuracy = progress.totalSeen > 0 ? (progress.totalCorrect / progress.totalSeen) * 100 : 0;

  return (
    <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      
      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Characters Mastered</span>
            <span>{progress.completedCharacters.size} / {total}</span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-right text-sm text-gray-400 mt-1">
            {percentage.toFixed(1)}%
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-dark-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-400">{progress.score}</div>
            <div className="text-sm text-gray-400">Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{accuracy.toFixed(0)}%</div>
            <div className="text-sm text-gray-400">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{progress.currentStreak}</div>
            <div className="text-sm text-gray-400">Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{progress.bestStreak}</div>
            <div className="text-sm text-gray-400">Best</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;