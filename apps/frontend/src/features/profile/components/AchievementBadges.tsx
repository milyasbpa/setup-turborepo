import React from 'react';
import { useTranslation } from '@/core/i18n';
import type { UserStats } from '@/core/api';
import { Card } from '@/core/components';

/**
 * Achievement Badges Props
 */
interface AchievementBadgesProps {
  stats: UserStats;
  className?: string;
}

/**
 * Achievement Badges Component
 * Shows earned achievements based on user stats
 */
export const AchievementBadges: React.FC<AchievementBadgesProps> = ({ 
  stats, 
  className = '' 
}) => {
  const { t } = useTranslation('profile');
  const achievements = [
    {
      id: 'first_lesson',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      earned: stats.totalLessonsCompleted >= 1,
    },
    {
      id: 'streak_3',
      title: 'Getting Started',
      description: 'Maintain a 3-day streak',
      icon: '🔥',
      earned: stats.streak.longest >= 3,
    },
    {
      id: 'streak_7',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '⭐',
      earned: stats.streak.longest >= 7,
    },
    {
      id: 'xp_1000',
      title: 'Knowledge Seeker',
      description: 'Earn 1,000 XP',
      icon: '⚡',
      earned: stats.totalXp >= 1000,
    },
    {
      id: 'perfect_score',
      title: 'Perfectionist',
      description: 'Maintain 90%+ average score',
      icon: '💯',
      earned: stats.averageScore >= 90,
    },
    {
      id: 'all_lessons',
      title: 'Master Student',
      description: 'Complete all available lessons',
      icon: '👑',
      earned: stats.totalLessonsCompleted >= 10, // Assume master at 10 lessons
    },
  ];

  const earnedAchievements = achievements.filter(a => a.earned);
  const unearnedAchievements = achievements.filter(a => !a.earned);

  return (
    <Card className={className}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('achievements.title')}</h2>
      
      {/* Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Earned ({earnedAchievements.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {earnedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <h4 className="font-medium text-green-800">{achievement.title}</h4>
                  <p className="text-sm text-green-600">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unearned Achievements */}
      {unearnedAchievements.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Not Yet Earned ({unearnedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unearnedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-60"
              >
                <span className="text-2xl grayscale">{achievement.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-700">{achievement.title}</h4>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No achievements yet */}
      {achievements.every(a => !a.earned) && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🏆</div>
          <p className="text-gray-600">Complete lessons to start earning achievements!</p>
        </div>
      )}
    </Card>
  );
};
