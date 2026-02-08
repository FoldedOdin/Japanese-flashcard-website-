import React, { useMemo } from 'react';
import { Trophy, Award, Target, Zap } from 'lucide-react';
import AchievementBadge from '../components/AchievementBadge';
import { ACHIEVEMENTS, getAchievementsByCategory } from '../data/achievements';
import { useProgress } from '../hooks/useProgress';
import { Achievement } from '../types';

const Achievements: React.FC = () => {
  const { progress } = useProgress();

  // Mock achievements progress based on current user progress
  const userAchievements: Achievement[] = useMemo(() => {
    return ACHIEVEMENTS.map((achievement) => {
      let currentProgress = 0;
      let unlockedAt: Date | undefined;

      switch (achievement.id) {
        case 'first_steps':
          currentProgress = progress.totalSeen > 0 ? 1 : 0;
          unlockedAt = currentProgress > 0 ? new Date(Date.now() - 86400000) : undefined;
          break;
        case 'hiragana_basics':
          currentProgress = Math.min(progress.completedCharacters.size, 10);
          unlockedAt = currentProgress >= 10 ? new Date(Date.now() - 86400000 * 2) : undefined;
          break;
        case 'streak_master':
          currentProgress = progress.currentStreak;
          unlockedAt = currentProgress >= 7 ? new Date(Date.now() - 86400000 * 3) : undefined;
          break;
        case 'accuracy_expert':
          currentProgress = progress.totalSeen > 0 && (progress.totalCorrect / progress.totalSeen) >= 0.9 ? 1 : 0;
          unlockedAt = currentProgress > 0 ? new Date(Date.now() - 86400000) : undefined;
          break;
        case 'point_collector':
          currentProgress = Math.min(progress.score, 1000);
          unlockedAt = currentProgress >= 1000 ? new Date(Date.now() - 86400000 * 5) : undefined;
          break;
        case 'daily_learner':
          currentProgress = Math.min(progress.currentStreak, 3);
          unlockedAt = currentProgress >= 3 ? new Date(Date.now() - 86400000 * 4) : undefined;
          break;
        default:
          currentProgress = Math.floor(Math.random() * achievement.maxProgress * 0.3); // Random progress for demo
      }

      return {
        ...achievement,
        progress: currentProgress,
        unlockedAt
      };
    });
  }, [progress]);

  const categoryData = [
    {
      id: 'learning',
      name: 'Learning',
      icon: Target,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      achievements: getAchievementsByCategory('learning').map(a => 
        userAchievements.find(ua => ua.id === a.id)!
      )
    },
    {
      id: 'consistency',
      name: 'Consistency',
      icon: Award,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      achievements: getAchievementsByCategory('consistency').map(a => 
        userAchievements.find(ua => ua.id === a.id)!
      )
    },
    {
      id: 'mastery',
      name: 'Mastery',
      icon: Trophy,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      achievements: getAchievementsByCategory('mastery').map(a => 
        userAchievements.find(ua => ua.id === a.id)!
      )
    },
    {
      id: 'special',
      name: 'Special',
      icon: Zap,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      achievements: getAchievementsByCategory('special').map(a => 
        userAchievements.find(ua => ua.id === a.id)!
      )
    }
  ];

  const totalAchievements = userAchievements.length;
  const unlockedAchievements = userAchievements.filter(a => a.unlockedAt).length;
  const completionPercentage = Math.round((unlockedAchievements / totalAchievements) * 100);

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-dark-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Achievements
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Unlock badges and celebrate your learning milestones
          </p>

          {/* Progress Overview */}
          <div className="max-w-md p-6 mx-auto bg-white border border-gray-200 rounded-lg dark:bg-dark-800 dark:border-dark-700">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary-600 dark:text-primary-400">
                {unlockedAchievements}/{totalAchievements}
              </div>
              <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                Achievements Unlocked
              </div>
              <div className="w-full h-3 mb-2 bg-gray-200 rounded-full dark:bg-dark-700">
                <div 
                  className="h-3 transition-all duration-500 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {completionPercentage}% Complete
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Categories */}
        <div className="space-y-8">
          {categoryData.map((category) => {
            const unlockedInCategory = category.achievements.filter(a => a.unlockedAt).length;
            
            return (
              <div key={category.id} className={`${category.bgColor} rounded-xl p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 ${category.color} mr-3`}>
                      <category.icon className="w-full h-full" />
                    </div>
                    <div>
                      <h2 className={`text-xl font-semibold ${category.color}`}>
                        {category.name}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {unlockedInCategory}/{category.achievements.length} unlocked
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${category.color}`}>
                      {Math.round((unlockedInCategory / category.achievements.length) * 100)}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Complete
                    </div>
                  </div>
                </div>

                {/* Achievement Grid */}
                <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                  {category.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex flex-col items-center space-y-2">
                      <AchievementBadge 
                        achievement={achievement} 
                        size="medium"
                        showProgress={true}
                      />
                      <div className="text-center">
                        <div className="text-xs font-medium leading-tight text-gray-700 dark:text-gray-300">
                          {achievement.title}
                        </div>
                        {achievement.maxProgress > 1 && (
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {achievement.progress}/{achievement.maxProgress}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Achievements */}
        <div className="mt-12">
          <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            Recent Achievements
          </h3>
          
          <div className="overflow-hidden bg-white border border-gray-200 dark:bg-dark-800 rounded-xl dark:border-dark-700">
            <div className="divide-y divide-gray-200 dark:divide-dark-700">
              {userAchievements
                .filter(a => a.unlockedAt)
                .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
                .slice(0, 5)
                .map((achievement) => (
                  <div key={achievement.id} className="flex items-center p-4 space-x-4">
                    <AchievementBadge 
                      achievement={achievement} 
                      size="small"
                      showProgress={false}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {achievement.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {achievement.unlockedAt?.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              
              {userAchievements.filter(a => a.unlockedAt).length === 0 && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No achievements unlocked yet.</p>
                  <p className="mt-1 text-sm">Start learning to earn your first badge!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;