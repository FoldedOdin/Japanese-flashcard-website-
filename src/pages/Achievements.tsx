import React, { useEffect, useMemo } from 'react';
import { Trophy, Award, Target, Zap } from 'lucide-react';
import AchievementBadge from '../components/AchievementBadge';
import { ACHIEVEMENTS, getAchievementsByCategory } from '../data/achievements';
import { useProgressStore } from '../hooks/useProgressStore';
import { Achievement } from '../types';
import { getAllKana } from '../data/kanaData';

const Achievements: React.FC = () => {
  const { state, unlockAchievement } = useProgressStore();
  const allKana = getAllKana();

  const progressByType = useMemo(() => {
    const hiraganaIds = new Set(allKana.filter((item) => item.type === 'hiragana').map((item) => item.id));
    const katakanaIds = new Set(allKana.filter((item) => item.type === 'katakana').map((item) => item.id));

    const mastered = Object.values(state.characterProgress).filter((item) => item.correct > 0).map((item) => item.characterId);

    return {
      hiragana: mastered.filter((id) => hiraganaIds.has(id)).length,
      katakana: mastered.filter((id) => katakanaIds.has(id)).length,
      total: mastered.length,
    };
  }, [state.characterProgress, allKana]);

  const computedAchievements: Achievement[] = useMemo(() => {
    return ACHIEVEMENTS.map((achievement) => {
      let progress = 0;

      switch (achievement.id) {
        case 'first_steps':
          progress = state.totalSeen > 0 ? 1 : 0;
          break;
        case 'hiragana_basics':
          progress = Math.min(progressByType.hiragana, achievement.maxProgress);
          break;
        case 'katakana_basics':
          progress = Math.min(progressByType.katakana, achievement.maxProgress);
          break;
        case 'half_hiragana':
          progress = Math.min(progressByType.hiragana, achievement.maxProgress);
          break;
        case 'full_hiragana':
          progress = Math.min(progressByType.hiragana, achievement.maxProgress);
          break;
        case 'full_katakana':
          progress = Math.min(progressByType.katakana, achievement.maxProgress);
          break;
        case 'daily_learner':
          progress = Math.min(state.currentStreak, achievement.maxProgress);
          break;
        case 'streak_master':
          progress = Math.min(state.currentStreak, achievement.maxProgress);
          break;
        case 'dedication':
          progress = Math.min(state.currentStreak, achievement.maxProgress);
          break;
        case 'accuracy_expert':
          progress = state.studySessions.some(
            (session) => session.mode === 'quiz' && session.accuracy >= 0.9
          )
            ? 1
            : 0;
          break;
        case 'perfect_score':
          progress = state.studySessions.some(
            (session) => session.mode === 'quiz' && session.accuracy === 1
          )
            ? 1
            : 0;
          break;
        case 'speed_demon':
          progress = state.studySessions.some(
            (session) =>
              session.mode === 'quiz' &&
              session.correctAnswers >= 50 &&
              session.durationSec <= 120
          )
            ? achievement.maxProgress
            : 0;
          break;
        case 'quiz_master':
          progress = Math.min(
            state.studySessions.filter((session) => session.mode === 'quiz').length,
            achievement.maxProgress
          );
          break;
        case 'flashcard_enthusiast':
          progress = Math.min(state.totalSeen, achievement.maxProgress);
          break;
        case 'point_collector':
          progress = Math.min(state.score, achievement.maxProgress);
          break;
        case 'completionist':
          progress = Math.min(progressByType.total, achievement.maxProgress);
          break;
        default:
          progress = 0;
      }

      return {
        ...achievement,
        progress,
        unlockedAt: state.achievementUnlocks[achievement.id]
          ? new Date(state.achievementUnlocks[achievement.id])
          : undefined,
      };
    });
  }, [state, progressByType]);

  useEffect(() => {
    computedAchievements.forEach((achievement) => {
      if (achievement.progress >= achievement.maxProgress && !state.achievementUnlocks[achievement.id]) {
        unlockAchievement(achievement.id);
      }
    });
  }, [computedAchievements, state.achievementUnlocks, unlockAchievement]);

  const categoryData = [
    {
      id: 'learning',
      name: 'Learning',
      icon: Target,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
      achievements: getAchievementsByCategory('learning').map((a) =>
        computedAchievements.find((ua) => ua.id === a.id)!
      ),
    },
    {
      id: 'consistency',
      name: 'Consistency',
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      achievements: getAchievementsByCategory('consistency').map((a) =>
        computedAchievements.find((ua) => ua.id === a.id)!
      ),
    },
    {
      id: 'mastery',
      name: 'Mastery',
      icon: Trophy,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      achievements: getAchievementsByCategory('mastery').map((a) =>
        computedAchievements.find((ua) => ua.id === a.id)!
      ),
    },
    {
      id: 'special',
      name: 'Special',
      icon: Zap,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      achievements: getAchievementsByCategory('special').map((a) =>
        computedAchievements.find((ua) => ua.id === a.id)!
      ),
    },
  ];

  const totalAchievements = computedAchievements.length;
  const unlockedAchievements = computedAchievements.filter((a) => a.unlockedAt).length;
  const completionPercentage = Math.round((unlockedAchievements / totalAchievements) * 100);

  return (
    <div className="min-h-screen py-10 bg-paper">
      <div className="px-4 mx-auto max-w-6xl sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-semibold font-display text-ink">Achievements</h1>
          <p className="mb-6 text-muted">Unlock badges and celebrate your learning milestones.</p>

          <div className="max-w-md p-6 mx-auto bg-surface border border-border rounded-2xl shadow-soft">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary-600">
                {unlockedAchievements}/{totalAchievements}
              </div>
              <div className="mb-3 text-sm text-muted">Achievements Unlocked</div>
              <div className="w-full h-3 mb-2 bg-paper2 rounded-full">
                <div
                  className="h-3 transition-all duration-500 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="text-sm font-medium text-muted">{completionPercentage}% Complete</div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {categoryData.map((category) => {
            const unlockedInCategory = category.achievements.filter((a) => a.unlockedAt).length;

            return (
              <div key={category.id} className={`${category.bgColor} rounded-2xl p-6 border border-border`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 ${category.color} mr-3`}>
                      <category.icon className="w-full h-full" />
                    </div>
                    <div>
                      <h2 className={`text-xl font-semibold ${category.color}`}>{category.name}</h2>
                      <p className="text-sm text-muted">
                        {unlockedInCategory}/{category.achievements.length} unlocked
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${category.color}`}>
                      {Math.round((unlockedInCategory / category.achievements.length) * 100)}%
                    </div>
                    <div className="text-xs text-muted">Complete</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                  {category.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex flex-col items-center space-y-2">
                      <AchievementBadge achievement={achievement} size="medium" showProgress={true} />
                      <div className="text-center">
                        <div className="text-xs font-medium leading-tight text-ink">
                          {achievement.title}
                        </div>
                        {achievement.maxProgress > 1 && (
                          <div className="mt-1 text-xs text-muted">
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

        <div className="mt-12">
          <h3 className="mb-6 text-xl font-semibold text-ink">Recent Achievements</h3>
          <div className="overflow-hidden bg-surface border border-border rounded-2xl shadow-soft">
            <div className="divide-y divide-border">
              {computedAchievements
                .filter((a) => a.unlockedAt)
                .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
                .slice(0, 5)
                .map((achievement) => (
                  <div key={achievement.id} className="flex items-center p-4 space-x-4">
                    <AchievementBadge achievement={achievement} size="small" showProgress={false} />
                    <div className="flex-1">
                      <div className="font-medium text-ink">{achievement.title}</div>
                      <div className="text-sm text-muted">{achievement.description}</div>
                    </div>
                    <div className="text-sm text-muted">
                      {achievement.unlockedAt?.toLocaleDateString()}
                    </div>
                  </div>
                ))}

              {computedAchievements.filter((a) => a.unlockedAt).length === 0 && (
                <div className="p-8 text-center text-muted">
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
