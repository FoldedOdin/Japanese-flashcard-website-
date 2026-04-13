import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Target, Clock, Brain, Calendar, Zap, AlertTriangle } from 'lucide-react';
import StatisticsCard from '../components/StatisticsCard';
import { useProgressStore } from '../hooks/useProgressStore';
import { useWeakCards } from '../hooks/useWeakCards';
import { getAllKana } from '../data/kanaData';

const Statistics: React.FC = () => {
  const { state } = useProgressStore();

  const allKana = useMemo(() => getAllKana(), []);
  const weakCards = useWeakCards(state.characterProgress, allKana);

  const analytics = useMemo(() => {
    const totalCharacters = allKana.length;
    const completedCharacters = Object.values(state.characterProgress).filter((item) => item.correct > 0).length;
    const completionRate = totalCharacters > 0 ? completedCharacters / totalCharacters : 0;
    const accuracy = state.totalSeen > 0 ? state.totalCorrect / state.totalSeen : 0;

    // 7-day retention rate: correct answers in last 7 days / total attempts in last 7 days
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentSessions = state.studySessions.filter((s) => new Date(s.endedAt) >= weekAgo);
    const recentCorrect = recentSessions.reduce((sum, s) => sum + s.correctAnswers, 0);
    const recentTotal = recentSessions.reduce((sum, s) => sum + s.totalQuestions, 0);
    const retentionRate = recentTotal > 0 ? Math.round((recentCorrect / recentTotal) * 100) : null;

    const sessionsThisWeek = recentSessions.length;

    return {
      completionRate: Math.round(completionRate * 100),
      accuracy: Math.round(accuracy * 100),
      totalCharacters,
      completedCharacters,
      averageScore: state.totalSeen > 0 ? Math.round(state.score / state.totalSeen) : 0,
      sessionsThisWeek,
      studyStreak: state.currentStreak,
      retentionRate,
    };
  }, [state, allKana]);

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
            title="Retention Rate (7d)"
            value={analytics.retentionRate !== null ? `${analytics.retentionRate}%` : 'No data'}
            subtitle="Correct answers this week"
            icon={TrendingUp}
            color="green"
          />
          <StatisticsCard
            title="Current Streak"
            value={state.currentStreak}
            subtitle={
              <span className="flex items-center space-x-1">
                <span>Best: {state.bestStreak} days</span>
                {state.gamification?.streakShields > 0 && (
                  <span className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                    🛡️ {state.gamification.streakShields} Active
                  </span>
                )}
              </span>
            }
            icon={Zap}
            color="accent"
          />
          <StatisticsCard
            title="Leech Cards"
            value={weakCards.length}
            subtitle="Cards needing focused practice"
            icon={AlertTriangle}
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

        {/* Missions Section */}
        {state.missions && state.missions.length > 0 && (
          <div className="p-6 bg-surface border border-border rounded-2xl shadow-soft mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center text-lg font-semibold text-ink">
                <Target className="w-5 h-5 mr-2 text-rose-500" />
                Active Missions
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.missions.map(mission => (
                <div key={mission.id} className="p-4 border border-border rounded-xl bg-paper flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm text-ink pr-4">{mission.description}</span>
                    <span className="text-xs font-bold bg-primary-100 text-primary-700 px-2 py-1 rounded-md shrink-0">+{mission.xpReward} XP</span>
                  </div>
                  <div className="mt-auto pt-4">
                    <div className="flex justify-between text-xs text-muted mb-1">
                      <span>{mission.currentValue} / {mission.targetValue}</span>
                      <span>{mission.isCompleted ? 'Done!' : `${Math.round((mission.currentValue / mission.targetValue) * 100)}%`}</span>
                    </div>
                    <div className="w-full h-2 bg-paper2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${mission.isCompleted ? 'bg-emerald-500' : 'bg-primary-500'}`}
                        style={{ width: `${Math.min((mission.currentValue / mission.targetValue) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leech Cards Section */}
        {weakCards.length > 0 && (
          <div className="p-6 bg-surface border border-red-200 rounded-2xl shadow-soft mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center text-lg font-semibold text-ink">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                Leech Cards — Needs Focused Practice
              </h3>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">
                {weakCards.length} card{weakCards.length !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-sm text-muted mb-4">
              These characters have been seen 3+ times but remain below 50% accuracy. The SRS system will prioritize them — or go to <strong>Learn → Review</strong> to drill them now.
            </p>
            <div className="flex flex-wrap gap-2">
              {weakCards.slice(0, 20).map((card) => {
                const progress = state.characterProgress[card.id];
                const acc = progress ? Math.round((progress.correct / progress.seen) * 100) : 0;
                return (
                  <div
                    key={card.id}
                    className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-red-50 border border-red-200 cursor-default"
                    title={`${card.romaji} — ${acc}% accuracy (${progress?.correct}/${progress?.seen})`}
                  >
                    <span className="text-xl font-japanese text-ink">{card.character}</span>
                    <span className="text-[10px] text-red-500 font-bold">{acc}%</span>
                  </div>
                );
              })}
              {weakCards.length > 20 && (
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-paper2 border border-border text-xs text-muted font-bold">
                  +{weakCards.length - 20}
                </div>
              )}
            </div>
          </div>
        )}

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
