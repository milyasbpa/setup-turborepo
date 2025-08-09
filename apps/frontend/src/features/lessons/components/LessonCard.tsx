import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Clock, Play, ChevronRight } from 'lucide-react';
import type { Lesson } from '@/core/api';
import { Card, ProgressBar, Badge } from '@/core/components';
import { useTranslation } from '@/core/i18n';

/**
 * Lesson Card Props
 */
interface LessonCardProps {
  lesson: Lesson;
  className?: string;
}

/**
 * Lesson Card Component
 * Displays lesson information with progress and navigation
 */
export const LessonCard: React.FC<LessonCardProps> = ({ lesson, className = '' }) => {
  const { t } = useTranslation('lessons');
  
  const getDifficultyColor = (order: number) => {
    if (order <= 3) return 'success';    // Easy lessons
    if (order <= 6) return 'warning';    // Medium lessons  
    return 'danger';                     // Hard lessons
  };

  const getDifficultyText = (order: number) => {
    if (order <= 3) return t('difficulty.beginner');
    if (order <= 6) return t('difficulty.intermediate');
    return t('difficulty.advanced');
  };

  const progress = lesson.progress?.score || 0;
  const isCompleted = lesson.progress?.isCompleted || false;
  const isInProgress = progress > 0 && !isCompleted;

  // Determine card state classes
  const cardStateClass = isCompleted ? 'completed' : isInProgress ? 'in-progress' : '';

  return (
    <div className="w-full">
      <Link to={`/lessons/${lesson.id}`} className="block">
        <Card className={`relative overflow-hidden bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 shadow-md transition-all duration-300 group hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:shadow-lg ${cardStateClass === 'completed' ? 'bg-gradient-to-br from-green-50 to-white border-green-200' : cardStateClass === 'in-progress' ? 'bg-gradient-to-br from-yellow-50 to-white border-yellow-200' : ''} ${className}`}>
          {/* Top accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 transition-opacity duration-300 ${cardStateClass === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500 opacity-100' : cardStateClass === 'in-progress' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 opacity-70' : 'bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100'}`}></div>
          
          <div className="flex flex-col gap-3 sm:gap-4 h-full">
            {/* Header with title and difficulty badge */}
            <div className="flex justify-between items-start gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 leading-tight">
                  {lesson.title}
                </h3>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 font-medium">
                  <span className="text-indigo-600 font-semibold">Lesson {lesson.order}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">~5 min</span>
                </div>
              </div>
              <Badge 
                variant={getDifficultyColor(lesson.order) as any}
                className="flex-shrink-0 text-xs font-bold"
              >
                {getDifficultyText(lesson.order)}
              </Badge>
            </div>
            
            {/* Description */}
            {lesson.description && (
              <p className="text-sm text-gray-700 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                {lesson.description}
              </p>
            )}
            
            {/* Progress section */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-bold text-indigo-600">{Math.round(progress)}%</span>
              </div>
              <ProgressBar 
                progress={progress}
                className="h-2 rounded-full bg-gray-200 overflow-hidden"
                color={isCompleted ? 'green' : 'blue'}
                size="sm"
                showLabel={false}
              />
            </div>

            {/* Status indicator with icon */}
            <div className="flex justify-between items-center pt-2 sm:pt-3 mt-auto border-t border-gray-100 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              <div className="flex items-center space-x-2">
                {isCompleted ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">{t('completed')}</span>
                  </>
                ) : isInProgress ? (
                  <>
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">{t('continueLesson')}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-indigo-600">{t('startLesson')}</span>
                  </>
                )}
              </div>
              <div className="text-indigo-500 transition-transform duration-200 transform translate-x-0 group-hover:translate-x-1">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
};

/**
 * Lesson Card Skeleton
 * Loading state for lesson cards
 */
export const LessonCardSkeleton: React.FC = () => {
  return (
    <div className="w-full">
      <Card className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 shadow-md">
        <div className="flex flex-col gap-3 sm:gap-4 h-full">
          <div className="animate-pulse">
            <div className="flex justify-between items-start gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-300 rounded-full w-16"></div>
            </div>
            
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full w-full"></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
