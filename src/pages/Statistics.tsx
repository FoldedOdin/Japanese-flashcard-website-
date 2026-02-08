import React, { useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock, 
  Award, 
  Brain,
  Calendar,
  Zap
} from 'lucide-react';
import StatisticsCard from '../components/StatisticsCard';
import { useProgress } from '../hooks/useProgress';
import { hiraganaData, katakanaData } from '../data/kanaData';

const Statistics: React.FC = () => {
  const { progress } = useProgress();

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalCharacters = hiraganaData.length + katakanaData.length;
    const completionRate = progress.completedCharacters.size / totalCharacters;
    const accuracy = progress.totalSeen > 0 ? (progress.totalCorrect / progress.totalSeen) : 0;
    
    return {
      completionRate: Math.round(completionRate * 100),
      accuracy: Math.round(accuracy * 100),
      totalCharacters,
      averageScore: progress.totalSeen > 0 ? Math.round(progress.score / progress.totalSeen) : 0,
      sessionsThisWeek: 5, // Mock data - would be calculated from study sessions
      studyStreak: progress.currentStreak
    };
  }, [progress]);

  // Mock weekly data - in real implementation, this would come from stored sessions
  const weeklyData = [
    { day: 'Mon', sessions: 2, accuracy: 85 },
    { day: 'Tue', sessions: 1, accuracy: 92 },
    { day: 'Wed', sessions: 3, accuracy: 78 },
    { day: 'Thu', sessions: 0, accuracy: 0 },
    { day: 'Fri', sessions: 2, accuracy: 88 },
    { day: 'Sat', sessions: 1, accuracy: 95 },
    { day: 'Sun', sessions: 0, accuracy: 0 }
  ];

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-dark-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Learning Statistics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and see how you're improving over time
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <StatisticsCard
            title="Overall Progress"
            value={`${analytics.completionRate}%`}
            subtitle={`${progress.completedCharacters.size} of ${analytics.totalCharacters} characters`}
            icon={Target}
            color="primary"
            trend={{ value: 12, isPositive: true }}
          />
          
          <StatisticsCard
            title="Accuracy Rate"
            value={`${analytics.accuracy}%`}
            subtitle={`${progress.totalCorrect} correct out of ${progress.totalSeen}`}
            icon={TrendingUp}
            color="green"
            trend={{ value: 8, isPositive: true }}
          />
          
          <StatisticsCard
            title="Current Streak"
            value={progress.currentStreak}
            subtitle={`Best: ${progress.bestStreak} days`}
            icon={Zap}
            color="accent"
          />
          
          <StatisticsCard
            title="Total Score"
            value={progress.score.toLocaleString()}
            subtitle="Points earned"
            icon={Award}
            color="secondary"
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Weekly Activity */}
        <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
          <div className="p-6 bg-white border border-gray-200 dark:bg-dark-800 dark:border-dark-700 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                <Calendar className="w-5 h-5 mr-2 text-primary-500" />
                Weekly Activity
              </h3>
            </div>
            
            <div className="space-y-4">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {day.day}
                    </div>
                    <div className="flex-1">
                      <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-dark-700">
                        <div 
                          className="h-2 transition-all duration-300 rounded-full bg-primary-500"
                          style={{ width: `${Math.min(day.sessions * 25, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {day.sessions} sessions
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 dark:bg-dark-800 dark:border-dark-700 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                <Brain className="w-5 h-5 mr-2 text-secondary-500" />
                Character Mastery
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Mastered</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {Math.round(progress.completedCharacters.size * 0.7)} characters
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Practicing</span>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">
                  {Math.round(progress.completedCharacters.size * 0.3)} characters
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Learning</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {analytics.totalCharacters - progress.completedCharacters.size} characters
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="w-full h-3 bg-gray-200 rounded-full dark:bg-dark-700">
                <div className="h-3 transition-all duration-300 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-blue-500"
                     style={{ width: `${analytics.completionRate}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Overall mastery progress: {analytics.completionRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Performance */}
        <div className="p-6 bg-white border border-gray-200 dark:bg-dark-800 dark:border-dark-700 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <BarChart3 className="w-5 h-5 mr-2 text-accent-500" />
              Performance Insights
            </h3>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-primary-600 dark:text-primary-400">
                {analytics.accuracy}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Accuracy</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {analytics.accuracy >= 80 ? 'Excellent!' : analytics.accuracy >= 60 ? 'Good progress' : 'Keep practicing'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                {analytics.sessionsThisWeek}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sessions This Week</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Goal: 7 sessions
              </div>
            </div>
            
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-accent-600 dark:text-accent-400">
                {Math.round(progress.score / Math.max(progress.totalSeen, 1))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Score per Session</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Points per question
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-6 mt-8 border bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-800 dark:to-dark-800 border-primary-200 dark:border-dark-700 rounded-xl">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            <Clock className="w-5 h-5 mr-2 text-primary-500" />
            Recommendations
          </h3>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {analytics.accuracy < 70 && (
              <div className="p-4 bg-white rounded-lg dark:bg-dark-700">
                <div className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Focus on Accuracy
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Your accuracy is below 70%. Try reviewing characters more carefully before answering.
                </div>
              </div>
            )}
            
            {progress.currentStreak < 3 && (
              <div className="p-4 bg-white rounded-lg dark:bg-dark-700">
                <div className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Build Consistency
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Practice daily to build a learning streak. Even 5 minutes helps!
                </div>
              </div>
            )}
            
            {analytics.completionRate < 50 && (
              <div className="p-4 bg-white rounded-lg dark:bg-dark-700">
                <div className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Explore More Characters
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  You've mastered {analytics.completionRate}% of characters. Try learning new ones!
                </div>
              </div>
            )}
            
            {analytics.sessionsThisWeek >= 5 && (
              <div className="p-4 bg-white rounded-lg dark:bg-dark-700">
                <div className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Great Progress!
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  You're doing excellent with {analytics.sessionsThisWeek} sessions this week. Keep it up!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;