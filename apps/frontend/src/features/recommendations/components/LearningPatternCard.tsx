import React from 'react';
import { useTranslation } from '@/core/i18n';

interface LearningPatternProps {
  pattern: {
    averageScore: number;
    learningSpeed: number;
    strugglingAreas: string[];
    strongAreas: string[];
    preferredDifficulty: 'easy' | 'medium' | 'hard';
    consistencyScore: number;
  };
}

const LearningPatternCard: React.FC<LearningPatternProps> = ({ pattern }) => {
  const { t } = useTranslation('recommendations');
  
  const getSpeedLabel = (speed: number) => {
    if (speed < 0.8) return t('insights.speed.slow');
    if (speed > 1.2) return t('insights.speed.fast');
    return t('insights.speed.medium');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="learning-pattern-card bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📊 {t('insights.title')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Average Score */}
        <div className="stat-item">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{t('insights.averageScore')}</span>
            <span className={`text-lg font-bold ${getScoreColor(pattern.averageScore)}`}>
              {pattern.averageScore.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full ${
                pattern.averageScore >= 80 ? 'bg-green-500' :
                pattern.averageScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${pattern.averageScore}%` }}
            />
          </div>
        </div>

        {/* Learning Speed */}
        <div className="stat-item">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{t('insights.learningSpeed')}</span>
            <span className="text-lg font-bold text-blue-600">
              {getSpeedLabel(pattern.learningSpeed)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {pattern.learningSpeed.toFixed(1)}x relative pace
          </p>
        </div>

        {/* Consistency Score */}
        <div className="stat-item">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{t('insights.consistency')}</span>
            <span className={`text-lg font-bold ${getScoreColor(pattern.consistencyScore)}`}>
              {pattern.consistencyScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full ${
                pattern.consistencyScore >= 80 ? 'bg-green-500' :
                pattern.consistencyScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${pattern.consistencyScore}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strong Areas */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">💪 {t('insights.strongAreas')}</h4>
          <div className="flex flex-wrap gap-2">
            {pattern.strongAreas.map((area, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full capitalize"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Struggling Areas */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">📈 {t('insights.growthAreas')}</h4>
          <div className="flex flex-wrap gap-2">
            {pattern.strugglingAreas.map((area, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full capitalize"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Preferred Difficulty */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">🎯 {t('insights.preferredDifficulty')}</h4>
        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getDifficultyColor(pattern.preferredDifficulty)}`}>
          {t(`insights.difficulty.${pattern.preferredDifficulty}`)}
        </span>
      </div>
    </div>
  );
};

export default LearningPatternCard;
