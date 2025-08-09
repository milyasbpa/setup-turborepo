import React from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import LearningPatternCard from './LearningPatternCard.tsx';
import RecommendationCard from './RecommendationCard.tsx';
import PersonalizedMessage from './PersonalizedMessage.tsx';
import { LoadingCard } from '@/core/components/Loading';
import { ErrorMessage } from '@/core/components/Error';

interface AdaptiveLearningPathProps {
  userId?: number;
  limit?: number;
}

const AdaptiveLearningPath: React.FC<AdaptiveLearningPathProps> = ({ 
  userId = 1, 
  limit = 5 
}) => {
  const { data: learningPath, isLoading, error } = useRecommendations({ 
    userId, 
    limit 
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <LoadingCard message="Generating your personalized learning path..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ErrorMessage 
          error={error.message}
        />
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center bg-white rounded-lg shadow p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No recommendations available</h3>
          <p className="text-gray-600">Complete some lessons to get personalized recommendations!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Adaptive Learning Path</h2>
        <p className="text-gray-600">
          Generated {new Date(learningPath.generatedAt).toLocaleString()}
        </p>
      </div>

      {/* Personalized Message */}
      <PersonalizedMessage message={learningPath.personalizedMessage} />

      {/* Learning Pattern Insights */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">📊 Learning Insights</h3>
        <LearningPatternCard pattern={learningPath.learningPattern} />
      </div>

      {/* Next Lesson Highlight */}
      {learningPath.nextSuggestedLesson && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-semibold text-gray-900">🎯 Recommended Next Lesson</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              Priority
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
          <h3 className="text-xl font-semibold text-gray-900">📚 Recommended Lessons</h3>
          <span className="text-sm text-gray-500">
            {learningPath.recommendations.length} recommendations
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
          <h3 className="text-xl font-semibold text-gray-900">🎯 Your Learning Goals</h3>
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

export default AdaptiveLearningPath;
