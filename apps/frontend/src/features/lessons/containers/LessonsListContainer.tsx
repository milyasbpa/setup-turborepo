import React from 'react';
import { useLessonList } from '../context/LessonsContext';
import { LessonCard, LessonCardSkeleton } from '../components/LessonCard';
import { EmptyLessonsState } from '../fragments/LessonsListFragment';
import { ErrorMessage } from '@/core/components';
import { useTranslation } from '@/core/i18n';

/**
 * Lessons List Container Props
 */
interface LessonsListContainerProps {
  className?: string;
}

/**
 * Lessons List Container
 * Renders the list of lessons with loading and error states
 * Pure UI component that gets data from context
 */
export const LessonsListContainer: React.FC<LessonsListContainerProps> = ({
  className = '',
}) => {
  const { lessons, isLoading, error, refetch } = useLessonList();
  const { t } = useTranslation('lessons');

  // Loading state
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <LessonCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={className}>
        <ErrorMessage 
          error={error}
          onRetry={refetch}
          className="max-w-md mx-auto"
        />
      </div>
    );
  }

  // Empty state
  if (!lessons || lessons.length === 0) {
    return (
      <div className={className}>
        <EmptyLessonsState />
      </div>
    );
  }

  // Success state - render lessons
  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-600">
          {t('subtitle')}
        </p>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            className="h-full"
          />
        ))}
      </div>

      {/* Stats Summary */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('progress.title', { defaultValue: 'Your Progress' })}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {lessons.filter(l => l.isCompleted).length}
            </div>
            <div className="text-sm text-gray-600">{t('completed')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {lessons.filter(l => l.completionPercentage > 0 && !l.isCompleted).length}
            </div>
            <div className="text-sm text-gray-600">{t('progress.inProgress', { defaultValue: 'In Progress' })}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {lessons.length}
            </div>
            <div className="text-sm text-gray-600">{t('progress.totalLessons', { defaultValue: 'Total Lessons' })}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
