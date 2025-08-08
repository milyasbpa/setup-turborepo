import React, { createContext, useContext, ReactNode } from 'react';
import type { 
  LessonListItem, 
  Lesson, 
  SubmissionResponse,
} from '@/core/api';

/**
 * Lessons Context Types
 */
interface LessonsContextValue {
  // Lesson list state
  lessons: LessonListItem[];
  lessonsLoading: boolean;
  lessonsError: string | null;
  
  // Current lesson state
  currentLesson: Lesson | null;
  currentLessonLoading: boolean;
  currentLessonError: string | null;
  
  // Submission state
  submissionLoading: boolean;
  submissionError: string | null;
  lastSubmissionResult: SubmissionResponse | null;
  
  // Actions
  refetchLessons: () => void;
  refetchCurrentLesson: () => void;
  clearSubmissionResult: () => void;
  submitLesson?: (answers: Array<{ problemId: number; answer: string }>) => Promise<SubmissionResponse>;
}

/**
 * Lessons Context
 */
const LessonsContext = createContext<LessonsContextValue | null>(null);

/**
 * Lessons Context Provider Props
 */
interface LessonsProviderProps {
  children: ReactNode;
  value?: LessonsContextValue;
}

/**
 * Lessons Context Provider
 * Provides lesson-related state and actions to child components
 */
export const LessonsProvider: React.FC<LessonsProviderProps> = ({ 
  children, 
  value: providedValue 
}) => {
  // Default value when no value is provided
  const defaultValue: LessonsContextValue = {
    lessons: [],
    lessonsLoading: false,
    lessonsError: null,
    
    currentLesson: null,
    currentLessonLoading: false,
    currentLessonError: null,
    
    submissionLoading: false,
    submissionError: null,
    lastSubmissionResult: null,
    
    refetchLessons: () => {},
    refetchCurrentLesson: () => {},
    clearSubmissionResult: () => {},
  };

  const value = providedValue || defaultValue;

  return (
    <LessonsContext.Provider value={value}>
      {children}
    </LessonsContext.Provider>
  );
};

/**
 * Hook to use Lessons Context
 */
export const useLessons = (): LessonsContextValue => {
  const context = useContext(LessonsContext);
  if (!context) {
    throw new Error('useLessons must be used within a LessonsProvider');
  }
  return context;
};

/**
 * Hook for lesson list operations
 */
export const useLessonList = () => {
  const { lessons, lessonsLoading, lessonsError, refetchLessons } = useLessons();
  
  return {
    lessons,
    isLoading: lessonsLoading,
    error: lessonsError,
    refetch: refetchLessons,
  };
};

/**
 * Hook for current lesson operations
 */
export const useCurrentLesson = () => {
  const { 
    currentLesson, 
    currentLessonLoading, 
    currentLessonError, 
    refetchCurrentLesson 
  } = useLessons();
  
  return {
    lesson: currentLesson,
    isLoading: currentLessonLoading,
    error: currentLessonError,
    refetch: refetchCurrentLesson,
  };
};

/**
 * Hook for lesson submission operations
 */
export const useLessonSubmission = () => {
  const { 
    submissionLoading, 
    submissionError, 
    lastSubmissionResult, 
    clearSubmissionResult 
  } = useLessons();
  
  return {
    isSubmitting: submissionLoading,
    error: submissionError,
    lastResult: lastSubmissionResult,
    clearResult: clearSubmissionResult,
  };
};
