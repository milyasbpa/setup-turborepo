import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrentLesson, useLessonSubmission, useLessons } from '../context/LessonsContext';
import { ProblemList } from '../components';
import { Button, ErrorMessage, Badge } from '@/core/components';

/**
 * Lesson Detail Container Props
 */
interface LessonDetailContainerProps {
  className?: string;
}

/**
 * Lesson Detail Container
 * Renders lesson details with interactive problems and submission
 * Pure UI component that gets data from context
 */
export const LessonDetailContainer: React.FC<LessonDetailContainerProps> = ({
  className = '',
}) => {
  const navigate = useNavigate();
  const { lesson, isLoading, error } = useCurrentLesson();
  const { isSubmitting, error: submissionError, lastResult } = useLessonSubmission();
  const { submitLesson } = useLessons();
  
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  if (isLoading || !lesson) {
    return (
      <div className={`max-w-4xl mx-auto ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 mb-6 shadow">
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`max-w-2xl mx-auto ${className}`}>
        <ErrorMessage error={error} />
      </div>
    );
  }

  const handleAnswerChange = (problemId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [problemId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!submitLesson) return;

    const answerArray = lesson.problems.map(problem => ({
      problemId: problem.id,
      answer: answers[problem.id] || '',
    }));

    try {
      const result = await submitLesson(answerArray);
      setShowResults(true);
      console.log('Submission result:', result);
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  const canSubmit = lesson && lesson.problems.every(problem => 
    answers[problem.id] && answers[problem.id].trim() !== ''
  ) && submitLesson;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HARD': return 'danger';
      default: return 'default';
    }
  };

  const handleContinue = () => {
    if (lastResult?.lessonCompleted) {
      navigate('/results', { 
        state: { 
          submissionResult: lastResult,
          lessonTitle: lesson.title 
        } 
      });
    } else {
      navigate('/lessons');
    }
  };

  // Convert submission results to problem results format
  const problemResults = lastResult?.results?.reduce((acc, result) => {
    acc[result.problemId] = {
      isCorrect: result.isCorrect,
      correctAnswer: result.correctAnswer,
    };
    return acc;
  }, {} as Record<number, { isCorrect: boolean; correctAnswer: string }>) || {};

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <nav className="mb-4">
          <Link 
            to="/lessons" 
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Lessons
          </Link>
        </nav>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {lesson.title}
            </h1>
            <p className="text-gray-600 text-lg mb-4">
              {lesson.description}
            </p>
          </div>
          <Badge 
            variant={getDifficultyColor(lesson.difficulty) as any}
            size="md"
          >
            {lesson.difficulty.charAt(0) + lesson.difficulty.slice(1).toLowerCase()}
          </Badge>
        </div>
      </div>

      {/* Problems */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Problems ({lesson.problems.length})
        </h2>
        
        <ProblemList
          problems={lesson.problems}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          disabled={isSubmitting || showResults}
          showResults={showResults}
          results={problemResults}
        />
      </div>

      {/* Submission Error */}
      {submissionError && (
        <div className="mb-6">
          <ErrorMessage error={submissionError} />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
        {!showResults ? (
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              loading={isSubmitting}
              size="lg"
            >
              Submit Answers
            </Button>
            <p className="text-sm text-gray-600">
              {canSubmit 
                ? `Ready to submit ${lesson.problems.length} answers`
                : `Please answer all ${lesson.problems.length} problems`
              }
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              {lastResult && (
                <>
                  <div className="text-green-600 font-semibold">
                    +{lastResult.xpGained} XP
                  </div>
                  <div className="text-sm text-gray-600">
                    {lastResult.results.filter(r => r.isCorrect).length} / {lastResult.results.length} correct
                  </div>
                  {lastResult.streakCount > 0 && (
                    <div className="text-sm text-orange-600 font-medium">
                      🔥 {lastResult.streakCount} day streak
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => navigate('/lessons')}
              >
                Back to Lessons
              </Button>
              {lastResult?.lessonCompleted && (
                <Button
                  onClick={handleContinue}
                  size="lg"
                >
                  View Results
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
