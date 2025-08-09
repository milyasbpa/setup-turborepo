import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Badge } from '@/core/components';
import { useLocalizedRoutes } from '@/core/i18n';
import { useLessonsDetail } from '../context/LessonsDetailContext';

/**
 * Lesson Detail Container Props
 */
interface LessonDetailContainerProps {
  className?: string;
}

/**
 * Lesson Detail Container
 * Renders lesson details with interactive problems and submission
 * Now uses React Query for data fetching through context
 */
export const LessonDetailContainer: React.FC<LessonDetailContainerProps> = ({
  className = '',
}) => {
  const navigate = useNavigate();
  const { routes } = useLocalizedRoutes();
  const { state, lessonQuery, actions } = useLessonsDetail();

  if (lessonQuery.isLoading) {
    return (
      <div className={`max-w-4xl mx-auto ${className}`}>
        <nav className="mb-4">
          <Link 
            to={routes.lessons} 
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Lessons
          </Link>
        </nav>
        
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

  // Show lesson content when loaded
  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <nav className="mb-4">
        <Link 
          to={routes.lessons} 
          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Lessons
        </Link>
      </nav>

      {lessonQuery.data ? (
        <>
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {lessonQuery.data.title}
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                {lessonQuery.data.description}
              </p>
              <div className="flex items-center gap-4 mb-4">
                <Badge variant={lessonQuery.data.status === 'completed' ? 'success' : 'warning'} size="md">
                  {lessonQuery.data.status === 'completed' ? 'Completed' : 'In Progress'}
                </Badge>
                <span className="text-sm text-gray-500">⏱️ {lessonQuery.data.duration}</span>
                <span className="text-sm text-gray-500">📊 {lessonQuery.data.difficulty}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${actions.getProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Practice Problems</h2>
            {lessonQuery.data.problems.map((problem, index: number) => (
              <div key={problem.id} className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Problem {index + 1}
                </h3>
                <p className="text-gray-700 mb-4">{problem.question}</p>
                
                {problem.type === 'multiple-choice' ? (
                  <div className="space-y-2">
                    {problem.options?.map((option: string, optIndex: number) => (
                      <label key={optIndex} className="flex items-center space-x-3 cursor-pointer">
                        <input 
                          type="radio" 
                          name={`problem-${problem.id}`}
                          value={optIndex}
                          onChange={(e) => actions.setUserAnswer(problem.id, parseInt(e.target.value))}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" 
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder={problem.placeholder}
                    onChange={(e) => actions.setUserAnswer(problem.id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                )}
                
                <div className="mt-4 flex items-center gap-2">
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => {
                      const isCorrect = actions.checkAnswer(problem.id);
                      if (isCorrect) {
                        actions.markProblemCompleted(problem.id);
                      }
                      // Show feedback to user
                      alert(isCorrect ? 'Correct! ✅' : 'Try again! ❌');
                    }}
                  >
                    Check Answer
                  </Button>
                  {state.completedProblems.includes(problem.id) && (
                    <span className="text-green-600 font-medium">✅ Completed</span>
                  )}
                </div>
                
                {problem.explanation && state.completedProblems.includes(problem.id) && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">Explanation:</h4>
                    <p className="text-blue-800 text-sm">{problem.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <Button 
              variant="secondary" 
              onClick={() => navigate(routes.lessons)}
            >
              Back to Lessons
            </Button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Progress: {actions.getProgress()}% ({state.completedProblems.length}/{lessonQuery.data.problems.length} problems)
              </span>
              <Button 
                variant="primary"
                disabled={!actions.canProceedToNext()}
              >
                {actions.canProceedToNext() ? 'Complete Lesson' : 'Complete All Problems'}
              </Button>
            </div>
          </div>
        </>
      ) : lessonQuery.error ? (
        <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {lessonQuery.error.message}</p>
            <Button onClick={() => window.location.reload()} variant="primary">
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Lesson not found</p>
            <Button onClick={() => navigate(routes.lessons)}>
              Back to Lessons
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
