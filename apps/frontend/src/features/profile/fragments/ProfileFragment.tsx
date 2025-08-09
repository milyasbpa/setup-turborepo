import React, { ReactNode } from 'react';
import { ProfileProvider, useUserProfile, useUserStats } from '../context/ProfileContext';
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
 * Profile Fragment Inner Component
 * Handles loading, error, and success states based on context data
 */
const ProfileFragmentInner: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation('profile');
  const { isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useUserProfile();
  const { isLoading: statsLoading, error: statsError, refetch: refetchStats } = useUserStats();

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

  return <>{children}</>;
};

/**
 * Profile Fragment
 * Provides ProfileProvider wrapper and handles UI states
 * Follows the same pattern as other context-based fragments
 */
export const ProfileFragment: React.FC<ProfileFragmentProps> = ({
  children,
  userId = 1,
}) => {
  return (
    <ProfileProvider userId={userId}>
      <ProfileFragmentInner>
        {children}
      </ProfileFragmentInner>
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
