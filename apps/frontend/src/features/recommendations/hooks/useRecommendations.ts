import { useQuery } from '@tanstack/react-query';
import { recommendationService } from '@/core/api/services-openapi';
import type { AdaptiveLearningPath } from '@/core/api/services-openapi';

interface UseRecommendationsDirectOptions {
  userId?: number;
  limit?: number;
  enabled?: boolean;
}

/**
 * Direct React Query hook for recommendations
 * @deprecated Use RecommendationsContext with useAdaptiveLearningPath instead
 */
export const useRecommendationsDirect = (options: UseRecommendationsDirectOptions = {}) => {
  const { userId = 1, limit, enabled = true } = options;

  return useQuery<AdaptiveLearningPath, Error>({
    queryKey: ['recommendations', userId, limit],
    queryFn: () => recommendationService.getRecommendations(userId, limit),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

// Keep the old export for backward compatibility
export const useRecommendations = useRecommendationsDirect;

export default useRecommendationsDirect;
