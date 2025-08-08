import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import type { SubmissionResponse } from '@/core/api';
import { Card, Button, ProgressBar } from '@/core/components';
import { apiUtils } from '@/core/api';
import { useTranslation } from '@/core/i18n';

/**
 * Results Page
 * Shows engaging post-lesson progress reveals with XP gained and streak status
 */
const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);
  const { t } = useTranslation('results');

  // Get submission result from location state
  const submissionResult = location.state?.submissionResult as SubmissionResponse | undefined;
  const lessonTitle = location.state?.lessonTitle as string | undefined;

  // Redirect if no result data
  useEffect(() => {
    if (!submissionResult) {
      navigate('/lessons', { replace: true });
      return;
    }

    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [submissionResult, navigate]);

  if (!submissionResult) {
    return null; // Will redirect
  }

  const correctAnswers = submissionResult.results.filter(r => r.isCorrect).length;
  const totalQuestions = submissionResult.results.length;
  const scorePercentage = (correctAnswers / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {submissionResult.lessonCompleted ? t('celebration.lessonCompleted') : t('celebration.greatProgress')}
          </h1>
          <p className="text-xl text-gray-600">
            {lessonTitle && `"${lessonTitle}"`}
          </p>
        </div>

        {/* Results Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* XP Gained */}
          <Card className="text-center">
            <div className="text-4xl mb-3">⚡</div>
            <div className={`text-3xl font-bold text-yellow-600 mb-2 transition-all duration-1000 ${
              showAnimation ? 'scale-110' : 'scale-100'
            }`}>
              +{submissionResult.xpGained}
            </div>
            <p className="text-gray-600">{t('stats.xpGained')}</p>
            <p className="text-sm text-gray-500 mt-1">
              {t('stats.total', { amount: apiUtils.formatXP(submissionResult.totalXp) })}
            </p>
          </Card>

          {/* Score */}
          <Card className="text-center">
            <div className="text-4xl mb-3">
              {scorePercentage >= 90 ? '🏆' : scorePercentage >= 70 ? '🎯' : '📈'}
            </div>
            <div className={`text-3xl font-bold text-blue-600 mb-2 transition-all duration-1000 delay-300 ${
              showAnimation ? 'scale-110' : 'scale-100'
            }`}>
              {Math.round(scorePercentage)}%
            </div>
            <p className="text-gray-600">{t('stats.score')}</p>
            <p className="text-sm text-gray-500 mt-1">
              {t('stats.correct', { correct: correctAnswers, total: totalQuestions })}
            </p>
          </Card>

          {/* Streak */}
          <Card className="text-center">
            <div className="text-4xl mb-3">🔥</div>
            <div className={`text-3xl font-bold text-orange-600 mb-2 transition-all duration-1000 delay-500 ${
              showAnimation ? 'scale-110' : 'scale-100'
            }`}>
              {submissionResult.streakCount}
            </div>
            <p className="text-gray-600">{t('stats.streak')}</p>
            <p className="text-sm text-gray-500 mt-1">
              {submissionResult.streakCount === 1 ? t('stats.keepItUp') : t('stats.amazingConsistency')}
            </p>
          </Card>
        </div>

        {/* Progress Bar */}
        {submissionResult.lessonCompleted && (
          <Card className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('progress.lessonProgress')}</h3>
            <ProgressBar 
              progress={submissionResult.completionPercentage}
              color="green"
              size="lg"
              className={`transition-all duration-2000 delay-700 ${
                showAnimation ? 'opacity-100' : 'opacity-50'
              }`}
            />
          </Card>
        )}

        {/* Problem Results */}
        <Card className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('progress.problemResults')}</h3>
          <div className="space-y-4">
            {submissionResult.results.map((result, index) => (
              <div
                key={result.problemId}
                className={`flex items-center justify-between p-4 rounded-lg transition-all duration-500 ${
                  result.isCorrect 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}
                style={{ transitionDelay: `${index * 200 + 1000}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    result.isCorrect ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {result.isCorrect ? (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      result.isCorrect ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {t('problem.number', { id: result.problemId })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('progress.yourAnswer', { answer: result.userAnswer })}
                    </p>
                    {!result.isCorrect && (
                      <p className="text-sm text-gray-600">
                        {t('progress.correctAnswer', { answer: result.correctAnswer })}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  result.isCorrect ? 'text-green-600' : 'text-red-600'
                }`}>
                  +{result.xpGained} XP
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/lessons">
            <Button size="lg" className="w-full sm:w-auto">
              {t('actions.continueLearning')}
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              {t('actions.viewProfile')}
            </Button>
          </Link>
        </div>

        {/* Motivational Message */}
        <div className="text-center mt-12">
          {scorePercentage >= 90 ? (
            <p className="text-lg text-gray-700">
              🌟 {t('celebration.outstanding')}
            </p>
          ) : scorePercentage >= 70 ? (
            <p className="text-lg text-gray-700">
              💪 {t('celebration.great')}
            </p>
          ) : (
            <p className="text-lg text-gray-700">
              📚 {t('celebration.good')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
