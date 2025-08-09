import React, { ReactNode } from 'react';
import { RecommendationsProvider, useAdaptiveLearningPath } from '../context/RecommendationsContext';
import { ErrorScreen, LoadingScreen } from '@/core/components';
import { useTranslation } from '@/core/i18n';

/**
 * Recommendations Fragment Props
 */
interface RecommendationsFragmentProps {
  children: ReactNode;
  userId?: number;
  limit?: number;
}

/**
 * Recommendations Fragment Inner Component
 * Handles loading, error, and success states based on context data
 */
const RecommendationsFragmentInner: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation('recommendations');
  const { isLoading, error, refetch } = useAdaptiveLearningPath();

  // Handle loading state
  if (isLoading) {
    return <LoadingScreen message="Generating your personalized learning path..." />;
  }

  // Handle error state
  if (error) {
    return (
      <ErrorScreen
        error={error as Error}
        title={t('error.failedToLoad')}
        onRetry={() => refetch()}
      />
    );
  }

  return <>{children}</>;
};

/**
 * Recommendations Fragment
 * Provides RecommendationsProvider wrapper and handles UI states
 * Follows the same pattern as other context-based fragments
 */
export const RecommendationsFragment: React.FC<RecommendationsFragmentProps> = ({
  children,
  userId = 1,
  limit = 5,
}) => {
  return (
    <RecommendationsProvider userId={userId} limit={limit}>
      <RecommendationsFragmentInner>
        {children}
      </RecommendationsFragmentInner>
    </RecommendationsProvider>
  );
};

/**
 * Recommendations Not Found Component
 * Shown when no recommendations are available
 */
export const RecommendationsNotFound: React.FC = () => {
  const { t } = useTranslation('recommendations');
  
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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {t('error.noRecommendations')}
      </h3>
      <p className="text-gray-500 text-center max-w-sm">
        {t('error.noRecommendationsMessage')}
      </p>
    </div>
  );
};
