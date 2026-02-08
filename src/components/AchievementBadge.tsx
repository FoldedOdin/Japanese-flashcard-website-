import React from 'react';
import { Achievement } from '../types';
import { Lock, CheckCircle } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  achievement, 
  size = 'medium',
  showProgress = true 
}) => {
  const isUnlocked = achievement.unlockedAt !== undefined;
  const progressPercent = Math.min((achievement.progress / achievement.maxProgress) * 100, 100);
  const isCompleted = progressPercent === 100;

  const sizeClasses = {
    small: {
      container: 'w-16 h-16',
      icon: 'text-2xl',
      badge: 'w-4 h-4',
      badgeIcon: 'w-3 h-3'
    },
    medium: {
      container: 'w-20 h-20',
      icon: 'text-3xl',
      badge: 'w-5 h-5',
      badgeIcon: 'w-4 h-4'
    },
    large: {
      container: 'w-24 h-24',
      icon: 'text-4xl',
      badge: 'w-6 h-6',
      badgeIcon: 'w-5 h-5'
    }
  };

  const categoryColors = {
    learning: 'from-blue-400 to-blue-600',
    consistency: 'from-orange-400 to-red-600',
    mastery: 'from-purple-400 to-purple-600',
    special: 'from-yellow-400 to-amber-600'
  };

  const currentSize = sizeClasses[size];
  const gradientColor = categoryColors[achievement.category];

  return (
    <div className="relative group">
      <div 
        className={`
          ${currentSize.container} 
          ${isUnlocked ? `bg-gradient-to-br ${gradientColor}` : 'bg-gray-300 dark:bg-gray-600'}
          rounded-full flex items-center justify-center
          transition-all duration-300 transform hover:scale-105
          ${isUnlocked ? 'shadow-lg hover:shadow-xl' : 'opacity-60'}
          ${isCompleted ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''}
        `}
      >
        {/* Achievement Icon */}
        <div className={`${currentSize.icon} ${isUnlocked ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
          {isUnlocked ? achievement.icon : '🔒'}
        </div>

        {/* Status Badge */}
        <div className={`absolute -top-1 -right-1 ${currentSize.badge} rounded-full flex items-center justify-center`}>
          {isCompleted ? (
            <div className="flex items-center justify-center w-full h-full bg-green-500 rounded-full">
              <CheckCircle className={`${currentSize.badgeIcon} text-white`} />
            </div>
          ) : !isUnlocked && achievement.progress === 0 ? (
            <div className="flex items-center justify-center w-full h-full bg-gray-500 rounded-full">
              <Lock className={`${currentSize.badgeIcon} text-white`} />
            </div>
          ) : null}
        </div>

        {/* Progress Ring (for in-progress achievements) */}
        {showProgress && !isCompleted && achievement.progress > 0 && (
          <div className="absolute inset-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeDasharray={`${progressPercent * 2.83} 283`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute z-10 mb-2 transition-opacity duration-200 transform -translate-x-1/2 opacity-0 pointer-events-none bottom-full left-1/2 group-hover:opacity-100">
        <div className="px-3 py-2 text-xs text-center text-white bg-gray-900 rounded-lg dark:bg-gray-100 dark:text-gray-900 max-w-48">
          <div className="font-semibold">{achievement.title}</div>
          <div className="mt-1 text-gray-300 dark:text-gray-600">
            {achievement.description}
          </div>
          {showProgress && achievement.maxProgress > 1 && (
            <div className="mt-1 text-gray-400 dark:text-gray-500">
              {achievement.progress}/{achievement.maxProgress}
            </div>
          )}
          {achievement.unlockedAt && (
            <div className="mt-1 text-xs text-green-400 dark:text-green-600">
              Unlocked {achievement.unlockedAt.toLocaleDateString()}
            </div>
          )}
          {/* Tooltip Arrow */}
          <div className="absolute transform -translate-x-1/2 border-4 border-transparent top-full left-1/2 border-t-gray-900 dark:border-t-gray-100"></div>
        </div>
      </div>
    </div>
  );
};

export default AchievementBadge;