import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/core/i18n';
import type { LessonRecommendation } from '@/core/api/services-openapi';

interface RecommendationCardProps {
  recommendation: LessonRecommendation;
  rank: number;
  isNext?: boolean;
  isHighlighted?: boolean;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  rank,
  isNext = false,
  isHighlighted = false,
}) => {
  const { t } = useTranslation('recommendations');
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const cardClasses = `
    bg-white rounded-lg shadow-md transition-all duration-200 hover:shadow-lg border
    ${isHighlighted ? 'ring-2 ring-blue-500 border-blue-200' : 'border-gray-200'}
    ${isNext ? 'relative overflow-hidden' : ''}
  `;

  return (
    <div className={cardClasses}>
      {isNext && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg font-medium">
          {t('nextLesson.priority')}
        </div>
      )}
      
      <div className="p-6">
        {/* Header with rank and confidence */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-sm font-bold rounded-full">
              {rank}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {recommendation.title}
            </h3>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <span className="text-xs text-gray-500">{t('nextLesson.confidence')}:</span>
            <span className={`text-sm font-bold ${getConfidenceColor(recommendation.confidenceScore)}`}>
              {recommendation.confidenceScore}%
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {recommendation.description}
        </p>

        {/* Recommendation Reason */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-blue-800 text-sm font-medium">
            💡 {recommendation.recommendationReason}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('duration.minutes', { count: recommendation.estimatedCompletionTime })}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {t('duration.xp', { count: recommendation.xpReward })}
            </span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(recommendation.difficulty)}`}>
            {t(`difficulty.${recommendation.difficulty.toLowerCase()}`)}
          </span>
        </div>

        {/* Action Button */}
        <Link
          to={`/lessons/${recommendation.lessonId}`}
          className={`
            block w-full text-center py-3 px-4 rounded-lg font-medium transition-colors
            ${isNext || isHighlighted 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {isNext ? t('recommendations.startNow') : t('recommendations.viewLesson')}
        </Link>
      </div>
    </div>
  );
};

export default RecommendationCard;
