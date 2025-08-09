import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { recommendationService } from '@/core/api/services-openapi';
import type { AdaptiveLearningPath } from '@/core/api/services-openapi';

/**
 * Recommendations Context Types
 */
interface RecommendationsContextType {
  recommendationsQuery: {
    data: AdaptiveLearningPath | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };
  actions: {
    // Add any recommendation specific actions here in the future
  };
}

/**
 * Recommendations Context
 */
const RecommendationsContext = createContext<RecommendationsContextType | undefined>(undefined);

/**
 * Recommendations Context Provider Props
 */
interface RecommendationsProviderProps {
  children: ReactNode;
  userId?: number;
  limit?: number;
}

/**
 * Recommendations Context Provider
 * Provides recommendations data and actions to child components
 * Follows the same pattern as LessonsContext and ProfileContext
 */
export const RecommendationsProvider: React.FC<RecommendationsProviderProps> = ({ 
  children, 
  userId = 1,
  limit = 5
}) => {
  // React Query for recommendations data
  const recommendationsQuery = useQuery({
    queryKey: ['recommendations', userId, limit],
    queryFn: () => recommendationService.getRecommendations(userId, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const actions = useMemo(() => ({
    // Add recommendation specific actions here in the future
  }), []);

  const contextValue = useMemo(() => ({
    recommendationsQuery: {
      data: recommendationsQuery.data,
      isLoading: recommendationsQuery.isLoading,
      error: recommendationsQuery.error,
      refetch: recommendationsQuery.refetch,
    },
    actions,
  }), [
    recommendationsQuery.data, 
    recommendationsQuery.isLoading, 
    recommendationsQuery.error, 
    recommendationsQuery.refetch,
    actions
  ]);

  return (
    <RecommendationsContext.Provider value={contextValue}>
      {children}
    </RecommendationsContext.Provider>
  );
};

/**
 * Hook to use Recommendations Context
 */
export const useRecommendations = (): RecommendationsContextType => {
  const context = useContext(RecommendationsContext);
  if (context === undefined) {
    throw new Error('useRecommendations must be used within a RecommendationsProvider');
  }
  return context;
};

/**
 * Hook for recommendations operations
 * Provides convenient access to recommendations data
 */
export const useAdaptiveLearningPath = () => {
  const { recommendationsQuery } = useRecommendations();
  
  return {
    learningPath: recommendationsQuery.data || null,
    isLoading: recommendationsQuery.isLoading,
    error: recommendationsQuery.error,
    refetch: recommendationsQuery.refetch,
  };
};
