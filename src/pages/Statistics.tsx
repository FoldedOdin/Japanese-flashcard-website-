import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Target, Clock, Award, Brain, Calendar, Zap } from 'lucide-react';
import StatisticsCard from '../components/StatisticsCard';
import { useProgressStore } from '../hooks/useProgressStore';
import { getAllKana } from '../data/kanaData';

const Statistics: React.FC = () => {
  const { state } = useProgressStore();

  const analytics = useMemo(() => {
    const totalCharacters = getAllKana().length;
    const completedCharacters = Object.values(state.characterProgress).filter((item) => item.correct > 0).length;
    const completionRate = totalCharacters > 0 ? completedCharacters / totalCharacters : 0;
    const accuracy = state.totalSeen > 0 ? state.totalCorrect / state.totalSeen : 0;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    const sessionsThisWeek = state.studySessions.filter(
      (session) => new Date(session.endedAt) >= weekAgo
    ).length;

    return {
      completionRate: Math.round(completionRate * 100),
      accuracy: Math.round(accuracy * 100),
      totalCharacters,
      completedCharacters,
      averageScore: state.totalSeen > 0 ? Math.round(state.score / state.totalSeen) : 0,
      sessionsThisWeek,
      studyStreak: state.currentStreak,
    };
  }, [state]);

  const weeklyData = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      return { date, label: date.toLocaleDateString(undefined, { weekday: 'short' }) };
    });

    return days.map((day) => {
      const sessions = state.studySessions.filter((session) =>
        new Date(session.endedAt).toDateString() === day.date.toDateString()
      );
      const accuracy = sessions.length
        ? Math.round(
            (sessions.reduce((sum, session) => sum + session.accuracy, 0) / sessions.length) * 100
          )
        : 0;
      return {
        day: day.label,
        sessions: sessions.length,
        accuracy,
      };
    });
  }, [state.studySessions]);

  return (
    <div className="min-h-screen py-10 bg-paper">
      <div className="px-4 mx-auto max-w-6xl sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-semibold font-display text-ink">Learning Statistics</h1>
          <p className="text-muted">Track your progress and see how you're improving over time.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <StatisticsCard
            title="Overall Progress"
            value={`${analytics.completionRate}%`}
            subtitle={`${analytics.completedCharacters} of ${analytics.totalCharacters} characters`}
            icon={Target}
            color="primary"
          />
          <StatisticsCard
            title="Accuracy Rate"
            value={`${analytics.accuracy}%`}
            subtitle={`${state.totalCorrect} correct out of ${state.totalSeen}`}
            icon={TrendingUp}
            color="green"
          />
          <StatisticsCard
            title="Current Streak"
            value={state.currentStreak}
            subtitle={`Best: ${state.bestStreak} days`}
            icon={Zap}
            color="accent"
          />
          <StatisticsCard
            title="Total Score"
            value={state.score.toLocaleString()}
            subtitle="Points earned"
            icon={Award}
            color="secondary"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
          <div className="p-6 bg-surface border border-border rounded-2xl shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center text-lg font-semibold text-ink">
                <Calendar className="w-5 h-5 mr-2 text-primary-500" />
                Weekly Activity
              </h3>
            </div>
            <div className="space-y-4">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 text-sm font-medium text-muted">{day.day}</div>
                    <div className="flex-1">
                      <div className="w-full h-2 bg-paper2 rounded-full">
                        <div
                          className="h-2 transition-all duration-300 rounded-full bg-primary-500"
                          style={{ width: `${Math.min(day.sessions * 25, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted">{day.sessions} sessions</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-surface border border-border rounded-2xl shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center text-lg font-semibold text-ink">
                <Brain className="w-5 h-5 mr-2 text-secondary-500" />
                Character Mastery
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Mastered</span>
                <span className="font-medium text-emerald-600">
                  {Math.round(analytics.completedCharacters * 0.7)} characters
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Practicing</span>
                <span className="font-medium text-amber-600">
                  {Math.round(analytics.completedCharacters * 0.3)} characters
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Learning</span>
                <span className="font-medium text-secondary-600">
                  {analytics.totalCharacters - analytics.completedCharacters} characters
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="w-full h-3 bg-paper2 rounded-full">
                <div
                  className="h-3 transition-all duration-300 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-secondary-500"
                  style={{ width: `${analytics.completionRate}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted">Overall mastery progress: {analytics.completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-surface border border-border rounded-2xl shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center text-lg font-semibold text-ink">
              <BarChart3 className="w-5 h-5 mr-2 text-accent-500" />
              Performance Insights
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-primary-600">{analytics.accuracy}%</div>
              <div className="text-sm text-muted">Average Accuracy</div>
              <div className="text-xs text-muted">
                {analytics.accuracy >= 80 ? 'Excellent!' : analytics.accuracy >= 60 ? 'Good progress' : 'Keep practicing'}
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-secondary-600">{analytics.sessionsThisWeek}</div>
              <div className="text-sm text-muted">Sessions This Week</div>
              <div className="text-xs text-muted">Goal: 7 sessions</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-accent-600">{analytics.averageScore}</div>
              <div className="text-sm text-muted">Avg Score per Answer</div>
              <div className="text-xs text-muted">Points per question</div>
            </div>
          </div>
        </div>

        <div className="p-6 mt-8 border bg-paper2 border-border rounded-2xl shadow-soft">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-ink">
            <Clock className="w-5 h-5 mr-2 text-primary-500" />
            Recommendations
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {analytics.accuracy < 70 && (
              <div className="p-4 bg-surface rounded-xl border border-border">
                <div className="mb-1 text-sm font-medium text-ink">Focus on Accuracy</div>
                <div className="text-xs text-muted">
                  Your accuracy is below 70%. Try reviewing characters more carefully before answering.
                </div>
              </div>
            )}
            {state.currentStreak < 3 && (
              <div className="p-4 bg-surface rounded-xl border border-border">
                <div className="mb-1 text-sm font-medium text-ink">Build Consistency</div>
                <div className="text-xs text-muted">Practice daily to build a learning streak.</div>
              </div>
            )}
            {analytics.completionRate < 50 && (
              <div className="p-4 bg-surface rounded-xl border border-border">
                <div className="mb-1 text-sm font-medium text-ink">Explore More Characters</div>
                <div className="text-xs text-muted">
                  You've mastered {analytics.completionRate}% of characters. Try learning new ones!
                </div>
              </div>
            )}
            {analytics.sessionsThisWeek >= 5 && (
              <div className="p-4 bg-surface rounded-xl border border-border">
                <div className="mb-1 text-sm font-medium text-ink">Great Progress!</div>
                <div className="text-xs text-muted">You're doing excellent this week. Keep it up!</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
