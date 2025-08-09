import React from 'react';
import { useAdaptiveLearningPath } from '../context/RecommendationsContext';
import { RecommendationsNotFound } from '../fragments/RecommendationsFragment';
import LearningPatternCard from '../components/LearningPatternCard';
import RecommendationCard from '../components/RecommendationCard';
import PersonalizedMessage from '../components/PersonalizedMessage';
import { useTranslation } from '@/core/i18n';

/**
 * Recommendations Container Props
 */
interface RecommendationsContainerProps {
  className?: string;
}

/**
 * Recommendations Container
 * Renders adaptive learning path with recommendations and insights
 * Pure UI component that gets data from context
 */
export const RecommendationsContainer: React.FC<RecommendationsContainerProps> = ({
  className = '',
}) => {
  const { learningPath } = useAdaptiveLearningPath();
  const { t } = useTranslation('recommendations');

  // Handle missing data
  if (!learningPath) {
    return <RecommendationsNotFound />;
  }

  return (
    <div className={`max-w-6xl mx-auto px-4 py-8 space-y-8 ${className}`}>
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h2>
        <p className="text-gray-600">
          {t('generatedAt')} {new Date(learningPath.generatedAt).toLocaleString()}
        </p>
      </div>

      {/* Personalized Message */}
      <PersonalizedMessage message={learningPath.personalizedMessage} />

      {/* Learning Pattern Insights */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">
          📊 {t('insights.title')}
        </h3>
        <LearningPatternCard pattern={learningPath.learningPattern} />
      </div>

      {/* Next Lesson Highlight */}
      {learningPath.nextSuggestedLesson && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-semibold text-gray-900">
              🎯 {t('nextLesson.title')}
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {t('nextLesson.priority')}
            </span>
          </div>
          <RecommendationCard
            recommendation={learningPath.nextSuggestedLesson}
            rank={1}
            isNext={true}
            isHighlighted={true}
          />
        </div>
      )}

      {/* All Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            📚 {t('recommendations.title')}
          </h3>
          <span className="text-sm text-gray-500">
            {learningPath.recommendations.length} {t('recommendations.count')}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPath.recommendations.map((recommendation, index) => (
            <RecommendationCard
              key={recommendation.lessonId}
              recommendation={recommendation}
              rank={index + 1}
              isNext={index === 0 && !learningPath.nextSuggestedLesson}
            />
          ))}
        </div>
      </div>

      {/* Learning Goals */}
      {learningPath.learningGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            🎯 {t('goals.title')}
          </h3>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningPath.learningGoals.map((goal, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{goal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
