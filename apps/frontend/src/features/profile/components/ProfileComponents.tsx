import React from 'react';
import { useTranslation } from '@/core/i18n';
import type { UserProfile, UserStats } from '@/core/api';
import { Card } from '@/core/components';
import { apiUtils } from '@/core/api';

/**
 * Profile Header Props
 */
interface ProfileHeaderProps {
  profile: UserProfile;
  className?: string;
}

/**
 * Profile Header Component
 * Displays user basic information and overall stats
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  profile, 
  className = '' 
}) => {
  const { t } = useTranslation('profile');
  return (
    <Card className={`${className}`}>
      <div className="flex items-center space-x-6">
        {/* Avatar */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {profile.username.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Basic Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {profile.username}
          </h1>
          <p className="text-gray-600 mb-3">{profile.email}</p>
          
          {/* Key Stats */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-2xl">⚡</span>
              <span className="font-medium">{apiUtils.formatXP(profile.totalXp)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-2xl">🔥</span>
              <span className="font-medium">{apiUtils.formatStreak(profile.currentStreak)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-2xl">📚</span>
              <span className="font-medium">
                {profile.lessonsCompleted} / {profile.totalLessons} lessons
              </span>
            </div>
          </div>
        </div>

        {/* Progress Circle */}
        <div className="text-center">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - profile.progressPercentage / 100)}`}
                className="text-blue-600 transition-all duration-300"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">
                {Math.round(profile.progressPercentage)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{t('progress.complete')}</p>
        </div>
      </div>
    </Card>
  );
};

/**
 * Stats Cards Props
 */
interface StatsCardsProps {
  stats: UserStats;
  className?: string;
}

/**
 * Stats Cards Component
 * Displays detailed statistics in a grid layout
 */
export const StatsCards: React.FC<StatsCardsProps> = ({ 
  stats, 
  className = '' 
}) => {
  const statItems = [
    {
      title: 'Total XP',
      value: apiUtils.formatXP(stats.totalXp),
      icon: '⚡',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Current Streak',
      value: apiUtils.formatStreak(stats.currentStreak),
      icon: '🔥',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Best Streak',
      value: apiUtils.formatStreak(stats.bestStreak),
      icon: '🏆',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Lessons Completed',
      value: `${stats.lessonsCompleted} / ${stats.totalLessons}`,
      icon: '📚',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Average Score',
      value: `${Math.round(stats.averageScore)}%`,
      icon: '📊',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Submissions',
      value: stats.totalSubmissions.toString(),
      icon: '✅',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {statItems.map((item, index) => (
        <Card key={index} className="text-center">
          <div className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
            <span className="text-2xl">{item.icon}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{item.title}</h3>
          <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
        </Card>
      ))}
    </div>
  );
};

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
      earned: stats.lessonsCompleted >= 1,
    },
    {
      id: 'streak_3',
      title: 'Getting Started',
      description: 'Maintain a 3-day streak',
      icon: '🔥',
      earned: stats.bestStreak >= 3,
    },
    {
      id: 'streak_7',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '⭐',
      earned: stats.bestStreak >= 7,
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
      earned: stats.lessonsCompleted >= stats.totalLessons && stats.totalLessons > 0,
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
