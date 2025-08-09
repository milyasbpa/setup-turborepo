import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { lessonService, QUERY_KEYS } from '@/core/api';
import type { 
  Lesson,
} from '@/core/api';

/**
 * Lessons Context Types
 */
interface LessonsContextType {
  lessonsQuery: {
    data: Lesson[] | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };
  actions: {
    // Add any lesson list specific actions here in the future
  };
}

/**
 * Lessons Context
 */
const LessonsContext = createContext<LessonsContextType | undefined>(undefined);

/**
 * Lessons Context Provider Props
 */
interface LessonsProviderProps {
  children: ReactNode;
  userId?: number;
}

/**
 * Lessons Context Provider
 * Provides lesson list data and actions to child components
 * Follows the same pattern as LessonsDetailContext
 */
export const LessonsProvider: React.FC<LessonsProviderProps> = ({ 
  children, 
  userId = 1 
}) => {
  // React Query for lessons data
  const lessonsQuery = useQuery({
    queryKey: [...QUERY_KEYS.LESSONS, userId],
    queryFn: () => lessonService.getAllLessons(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const actions = useMemo(() => ({
    // Add lesson list specific actions here in the future
  }), []);

  const contextValue = useMemo(() => ({
    lessonsQuery: {
      data: lessonsQuery.data,
      isLoading: lessonsQuery.isLoading,
      error: lessonsQuery.error,
      refetch: lessonsQuery.refetch,
    },
    actions,
  }), [lessonsQuery.data, lessonsQuery.isLoading, lessonsQuery.error, lessonsQuery.refetch, actions]);

  return (
    <LessonsContext.Provider value={contextValue}>
      {children}
    </LessonsContext.Provider>
  );
};

/**
 * Hook to use Lessons Context
 */
export const useLessons = (): LessonsContextType => {
  const context = useContext(LessonsContext);
  if (context === undefined) {
    throw new Error('useLessons must be used within a LessonsProvider');
  }
  return context;
};

/**
 * Hook for lesson list operations
 * Provides convenient access to lessons data
 */
export const useLessonList = () => {
  const { lessonsQuery } = useLessons();
  
  return {
    lessons: lessonsQuery.data || [],
    isLoading: lessonsQuery.isLoading,
    error: lessonsQuery.error,
    refetch: lessonsQuery.refetch,
  };
};
