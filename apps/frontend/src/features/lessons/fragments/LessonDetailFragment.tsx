import React, { ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonService, QUERY_KEYS, apiUtils } from '@/core/api';
import type { SubmissionRequest, SubmissionResponse } from '@/core/api';
import { LessonsProvider } from '../context/LessonsContext';
import { ErrorScreen, LoadingScreen } from '@/core/components';
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
 * Handles API integration for lesson details and submissions
 * Provides lesson data and submission functionality to children via context
 */
export const LessonDetailFragment: React.FC<LessonDetailFragmentProps> = ({
  children,
  lessonId,
  userId = 1,
}) => {
  const { t } = useTranslation('lessons');
  const queryClient = useQueryClient();

  // Fetch lesson details
  const {
    data: lesson,
    isLoading: lessonLoading,
    error: lessonError,
    refetch: refetchLesson,
  } = useQuery({
    queryKey: QUERY_KEYS.LESSON_DETAIL(lessonId),
    queryFn: () => lessonService.getLessonById(lessonId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Submission mutation
  const submissionMutation = useMutation({
    mutationFn: (submission: SubmissionRequest) => 
      lessonService.submitLesson(lessonId, submission, userId),
    onSuccess: (result: SubmissionResponse) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE_STATS });
      
      console.log('Lesson submitted successfully:', result);
    },
    onError: (error) => {
      console.error('Lesson submission failed:', error);
    },
  });

  // Handle loading state
  if (lessonLoading) {
    return <LoadingScreen message="Loading lesson..." />;
  }

  // Handle error state
  if (lessonError) {
    return (
      <ErrorScreen
        error={lessonError as Error}
        title={t('error.failedToLoadLesson')}
        onRetry={() => refetchLesson()}
      />
    );
  }

  // Handle lesson not found
  if (!lesson) {
    return (
      <ErrorScreen
        error={t('error.lessonNotFound')}
        title={t('error.lessonNotFoundTitle')}
        onRetry={() => refetchLesson()}
      />
    );
  }

  // Submit lesson function
  const submitLesson = async (answers: Array<{ problemId: number; answer: string }>) => {
    const submission: SubmissionRequest = {
      attemptId: apiUtils.generateAttemptId(),
      answers,
    };
    
    return submissionMutation.mutateAsync(submission);
  };

  // Clear submission result
  const clearSubmissionResult = () => {
    submissionMutation.reset();
  };

  // Enhanced context value with lesson data and submission functionality
  const contextValue = {
    lessons: [], // Not applicable for lesson detail
    lessonsLoading: false,
    lessonsError: null,
    
    currentLesson: lesson,
    currentLessonLoading: lessonLoading,
    currentLessonError: lessonError ? (lessonError as Error).message : null,
    
    submissionLoading: submissionMutation.isPending,
    submissionError: submissionMutation.error ? apiUtils.getErrorMessage(submissionMutation.error) : null,
    lastSubmissionResult: submissionMutation.data || null,
    
    refetchLessons: () => {},
    refetchCurrentLesson: refetchLesson,
    clearSubmissionResult,
    submitLesson, // Add submit function to context
  };

  return (
    <LessonsProvider value={contextValue}>
      {children}
    </LessonsProvider>
  );
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
