import { useQuery } from '@tanstack/react-query';
import { recommendationService } from '@/core/api/services-openapi';
import type { AdaptiveLearningPath } from '@/core/api/services-openapi';

interface UseRecommendationsOptions {
  userId?: number;
  limit?: number;
  enabled?: boolean;
}

export const useRecommendations = (options: UseRecommendationsOptions = {}) => {
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

export default useRecommendations;
