import React from 'react';
import { Link } from 'react-router-dom';
import type { LessonListItem } from '@/core/api';
import { Card, ProgressBar, Badge } from '@/core/components';
import { useTranslation } from '@/core/i18n';

/**
 * Lesson Card Props
 */
interface LessonCardProps {
  lesson: LessonListItem;
  className?: string;
}

/**
 * Lesson Card Component
 * Displays lesson information with progress and navigation
 */
export const LessonCard: React.FC<LessonCardProps> = ({ lesson, className = '' }) => {
  const { t } = useTranslation('lessons');
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'success';
      case 'MEDIUM':
        return 'warning';
      case 'HARD':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return t('difficulty.beginner');
      case 'MEDIUM':
        return t('difficulty.intermediate');
      case 'HARD':
        return t('difficulty.advanced');
      default:
        return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
    }
  };

  return (
    <Link to={`/lessons/${lesson.id}`} className="block">
      <Card hover className={`transition-all duration-200 ${className}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {lesson.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {lesson.description}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <Badge 
              variant={getDifficultyColor(lesson.difficulty) as any}
              size="sm"
            >
              {getDifficultyText(lesson.difficulty)}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          {/* Progress Bar */}
          <ProgressBar 
            progress={lesson.completionPercentage}
            color={lesson.isCompleted ? 'green' : 'blue'}
            size="sm"
            showLabel={false}
          />

          {/* Status and Progress Text */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              {lesson.isCompleted ? (
                <>
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-green-600 font-medium">{t('completed')}</span>
                </>
              ) : lesson.completionPercentage > 0 ? (
                <>
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-blue-600 font-medium">{t('continueLesson')}</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12l5 5L20 7"
                    />
                  </svg>
                  <span className="text-gray-500">{t('startLesson')}</span>
                </>
              )}
            </div>
            <span className="text-gray-500">
              {Math.round(lesson.completionPercentage)}% {t('lesson.progress', { defaultValue: 'complete' })}
            </span>
          </div>
        </div>

        {/* Hover effect indicator */}
        <div className="mt-4 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          {lesson.isCompleted ? t('completed') : lesson.completionPercentage > 0 ? t('continueLesson') : t('startLesson')}
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Card>
    </Link>
  );
};

/**
 * Lesson Card Skeleton
 * Loading state for lesson cards
 */
export const LessonCardSkeleton: React.FC = () => {
  return (
    <Card>
      <div className="animate-pulse">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="ml-4">
            <div className="h-6 bg-gray-300 rounded-full w-16"></div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded-full w-full"></div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    </Card>
  );
};
