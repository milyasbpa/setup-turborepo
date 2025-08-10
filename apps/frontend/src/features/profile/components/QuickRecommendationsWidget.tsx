import React from 'react';
import { Link } from 'react-router-dom';
import { Target, ArrowRight, TrendingUp } from 'lucide-react';
import { useLocalizedRoutes } from '@/core/i18n';
import { useRecommendationsDirect } from '../../recommendations/hooks/useRecommendations';

/**
 * Quick Recommendations Widget for Profile Page
 * Shows a preview of recommendations with a link to the full page
 */
export const QuickRecommendationsWidget: React.FC = () => {
  const { routes } = useLocalizedRoutes();
  const { data: learningPath, isLoading } = useRecommendationsDirect({ 
    userId: 1, 
    limit: 2 
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!learningPath?.recommendations?.length) {
    return (
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Quick Recommendations</h3>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Complete some lessons to get personalized recommendations!
        </p>
        <Link
          to={routes.lessons}
          className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700"
        >
          Start Learning
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const topRecommendations = learningPath.recommendations.slice(0, 2);

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recommended for You</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full self-start sm:self-auto">
          <TrendingUp className="w-3 h-3" />
          AI-Powered
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {topRecommendations.map((rec, index) => (
          <div key={rec.lessonId} className="flex items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5 sm:mt-0">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 mb-1 leading-tight">{rec.title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{rec.recommendationReason}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <span className="text-xs text-blue-600 font-medium whitespace-nowrap">{rec.confidenceScore}% match</span>
            </div>
          </div>
        ))}
      </div>

      <Link
        to={routes.recommendations}
        className="block w-full text-center bg-blue-600 text-white py-2.5 sm:py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        View All Recommendations
      </Link>
    </div>
  );
};

export default QuickRecommendationsWidget;
