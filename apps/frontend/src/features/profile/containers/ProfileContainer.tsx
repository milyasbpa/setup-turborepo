import React from 'react';
import { Link } from 'react-router-dom';
import { useUserProfile, useUserStats } from '../context/ProfileContext';
import { ProfileHeader, StatsCards, AchievementBadges } from '../components';
import { QuickRecommendationsWidget } from '../components/QuickRecommendationsWidget';
import { ErrorMessage, Button, LoadingCard } from '@/core/components';
import { useTranslation } from '@/core/i18n';

/**
 * Profile Container Props
 */
interface ProfileContainerProps {
  className?: string;
}

/**
 * Profile Container
 * Renders user profile with stats and achievements
 * Pure UI component that gets data from context
 */
export const ProfileContainer: React.FC<ProfileContainerProps> = ({
  className = '',
}) => {
  const { profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useUserProfile();
  const { stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useUserStats();
  const { t } = useTranslation('profile');

  // Handle loading state
  if (profileLoading || statsLoading) {
    return (
      <div className={`space-y-8 ${className}`}>
        <LoadingCard message={t('loading.profile')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (profileError || statsError) {
    const error = profileError || statsError;
    return (
      <div className={className}>
        <ErrorMessage 
          error={error || 'Unknown error occurred'}
          onRetry={() => {
            refetchProfile();
            refetchStats();
          }}
          className="max-w-md mx-auto"
        />
      </div>
    );
  }

  // Handle missing data
  if (!profile || !stats) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-4xl mb-4">👤</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('error.profileNotAvailable')}</h2>
        <p className="text-gray-600 mb-6">We couldn't load your profile data.</p>
        <Button onClick={() => {
          refetchProfile();
          refetchStats();
        }}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
        <div className="flex-shrink-0">
          <Link to="/lessons">
            <Button className="w-full sm:w-auto">{t('actions.continueLearning')}</Button>
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <ProfileHeader profile={profile} />

      {/* Detailed Stats */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('stats.detailedStats')}</h2>
        <StatsCards stats={stats} />
      </div>

      {/* Achievements */}
      <AchievementBadges stats={stats} />

      {/* Recommendations Widget */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Recommendations</h2>
        <QuickRecommendationsWidget />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Ready for more challenges?</h3>
            <p className="opacity-90 text-sm sm:text-base leading-relaxed">
              {stats.totalLessonsCompleted >= 10 // Assume 10 lessons total for demo
                ? "You've completed all available lessons! Check back for new content."
                : `${10 - stats.totalLessonsCompleted} lessons remaining to master math.`
              }
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link to="/lessons">
              <Button variant="secondary" className="w-full sm:w-auto">
                {stats.totalLessonsCompleted >= 10 ? 'Review Lessons' : 'Continue Learning'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Last Activity Info */}
      {stats.streak.lastActiveDate && (
        <div className="text-center text-sm text-gray-500">
          Last activity: {new Date(stats.streak.lastActiveDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};
