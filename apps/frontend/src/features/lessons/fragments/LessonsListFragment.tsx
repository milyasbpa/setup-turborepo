import React, { ReactNode } from 'react';
import { LessonsProvider } from '../context/LessonsContext';
import { ErrorScreen, LoadingScreen } from '@/core/components';
import { useTranslation } from '@/core/i18n';
import { useLessons } from '../context/LessonsContext';

/**
 * Lessons List Fragment Props
 */
interface LessonsListFragmentProps {
  children: ReactNode;
  userId?: number;
}

/**
 * Lessons List Content
 * Handles loading and error states for lessons list
 */
const LessonsListContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation('lessons');
  const { lessonsQuery } = useLessons();
  
  // Handle loading state
  if (lessonsQuery.isLoading) {
    return <LoadingScreen message="Loading lessons..." />;
  }

  // Handle error state
  if (lessonsQuery.error) {
    return (
      <ErrorScreen
        error={lessonsQuery.error}
        title={t('error.failedToLoad')}
        onRetry={() => lessonsQuery.refetch()}
      />
    );
  }

  return <>{children}</>;
};

/**
 * Lessons List Fragment
 * Provides lessons context and handles loading/error states
 * Follows the same pattern as LessonsDetailContext
 */
export const LessonsListFragment: React.FC<LessonsListFragmentProps> = ({
  children,
  userId = 1,
}) => {
  return (
    <LessonsProvider userId={userId}>
      <LessonsListContent>
        {children}
      </LessonsListContent>
    </LessonsProvider>
  );
};

/**
 * Empty State Component
 * Shown when no lessons are available
 */
export const EmptyLessonsState: React.FC = () => {
  const { t } = useTranslation('lessons');
  
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noLessonsFound')}</h3>
      <p className="text-gray-500 text-center max-w-sm">
        {t('noLessonsAvailable')}
      </p>
    </div>
  );
};
