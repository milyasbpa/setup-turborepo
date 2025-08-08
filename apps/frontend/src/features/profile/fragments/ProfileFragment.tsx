import React, { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { profileService, QUERY_KEYS } from '@/core/api';
import { ProfileProvider } from '../context/ProfileContext';
import { ErrorScreen, LoadingScreen } from '@/core/components';
import { useTranslation } from '@/core/i18n';

/**
 * Profile Fragment Props
 */
interface ProfileFragmentProps {
  children: ReactNode;
  userId?: number;
}

/**
 * Profile Fragment
 * Handles API integration for user profile and stats with React Query
 * Provides loading, error, and success states to children via context
 */
export const ProfileFragment: React.FC<ProfileFragmentProps> = ({
  children,
  userId = 1,
}) => {
  const { t } = useTranslation('profile');
  // Fetch user profile
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: [...QUERY_KEYS.PROFILE, userId],
    queryFn: () => profileService.getUserProfile(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch user stats
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: [...QUERY_KEYS.PROFILE_STATS, userId],
    queryFn: () => profileService.getUserStats(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Handle loading state
  if (profileLoading || statsLoading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  // Handle error state
  if (profileError || statsError) {
    const error = profileError || statsError;
    return (
      <ErrorScreen
        error={error as Error}
        title={t('error.failedToLoad')}
        onRetry={() => {
          refetchProfile();
          refetchStats();
        }}
      />
    );
  }

  // Enhanced context value with actual data
  const contextValue = {
    profile: profile || null,
    profileLoading,
    profileError: profileError ? (profileError as Error).message : null,
    
    stats: stats || null,
    statsLoading,
    statsError: statsError ? (statsError as Error).message : null,
    
    refetchProfile,
    refetchStats,
  };

  return (
    <ProfileProvider value={contextValue}>
      {children}
    </ProfileProvider>
  );
};

/**
 * Profile Not Found Component
 * Shown when profile doesn't exist
 */
export const ProfileNotFound: React.FC = () => {
  const { t } = useTranslation('profile');
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{t('error.profileNotFound')}</h3>
      <p className="text-gray-500 text-center max-w-sm">
        {t('error.profileNotFoundMessage')}
      </p>
    </div>
  );
};
