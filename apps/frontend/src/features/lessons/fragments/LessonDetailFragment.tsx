import React, { ReactNode } from 'react';
import { useTranslation } from '@/core/i18n';

/**
 * Lesson Detail Fragment Props
 */
interface LessonDetailFragmentProps {
  children: ReactNode;
  lessonId: string;
  userId?: number;
}

/**
 * Lesson Detail Fragment
 * Simple wrapper component for lesson detail children
 * Data comes from LessonsDetailContext provider
 */
export const LessonDetailFragment: React.FC<LessonDetailFragmentProps> = ({
  children,
}) => {
  // Just render children - all data and functionality comes from LessonsDetailContext
  return <>{children}</>;
};

/**
 * Lesson Not Found Component
 * Shown when lesson doesn't exist
 */
export const LessonNotFound: React.FC = () => {
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
            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.4a7.962 7.962 0 01-5.657-2.109c-1.21-1.21-2.83-1.885-4.464-1.885-1.21 0-2.38.204-3.49.578C1.48 15.74 1 14.417 1 13c0-6.627 5.373-12 12-12s12 5.373 12 12c0 1.417-.48 2.74-1.389 4.016-1.11-.374-2.28-.578-3.49-.578-1.634 0-3.254.675-4.464 1.885z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{t('error.lessonNotFound')}</h3>
      <p className="text-gray-500 text-center max-w-sm">
        {t('error.lessonNotFoundMessage')}
      </p>
    </div>
  );
};
