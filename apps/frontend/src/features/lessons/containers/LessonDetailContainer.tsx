import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/core/components";
import { useLocalizedRoutes } from "@/core/i18n";
import { useLessonsDetail } from "../context/LessonsDetailContext";
import { useMutation } from "@tanstack/react-query";
import { lessonService } from "@/core/api/services-openapi";

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
  className = "",
}) => {
  const navigate = useNavigate();
  const { routes } = useLocalizedRoutes();
  const { state, lessonQuery, actions } = useLessonsDetail();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Mutation for submitting the entire lesson at the end
  const submitLessonMutation = useMutation({
    mutationFn: async () => {
      if (!lessonQuery.data) throw new Error('No lesson data');
      
      // Prepare answers in the format expected by backend
      const answers = lessonQuery.data.problems.map(problem => ({
        problemId: problem.id,
        answer: state.userAnswers[problem.id]?.toString() || ''
      }));

      // Submit lesson to backend
      const result = await lessonService.submitLesson(
        lessonQuery.data.id,
        {
          answers,
          attemptId: `attempt-${Date.now()}` // Generate unique attempt ID
        },
        1 // Default user ID
      );

      return result;
    },
    onSuccess: (result) => {
      setSubmissionResult(result);
      setFinished(true);
    },
    onError: (error) => {
      console.error('Failed to submit lesson:', error);
      // Still show finished state even if submission fails
      setFinished(true);
    }
  });

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
  if (lessonQuery.data) {
    if (!finished) {
      // Current problem flow - no checking, just next/finish
      const canProceed = state.userAnswers[lessonQuery.data.problems[currentIndex].id] !== undefined;
      const isLastProblem = currentIndex + 1 >= lessonQuery.data.problems.length;

      return (
        <div className={`max-w-2xl mx-auto ${className}`}>
          <nav className="mb-4">
            <Link
              to={routes.lessons}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Lessons
            </Link>
          </nav>
          <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              {lessonQuery.data.title}
            </h1>
            <div className="space-y-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-800">Lesson ID:</span>{" "}
                {lessonQuery.data.id}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-800">Progress:</span>{" "}
                {currentIndex + 1} / {lessonQuery.data.problems.length} problems
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Problem {currentIndex + 1}:{" "}
                {lessonQuery.data.problems[currentIndex].question}
              </h2>
              {lessonQuery.data.problems[currentIndex].problemType ===
              "multiple_choice" ? (
                <div className="space-y-2">
                  {lessonQuery.data.problems[currentIndex].options?.map(
                    (option: any) => {
                      return (
                        <label
                          key={option.id}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`problem-${
                              lessonQuery.data!.problems[currentIndex].id
                            }`}
                            value={option.optionText}
                            checked={
                              state.userAnswers[
                                lessonQuery.data!.problems[currentIndex].id
                              ] === option.optionText
                            }
                            onChange={(e) =>
                              actions.setUserAnswer(
                                lessonQuery.data!.problems[currentIndex].id,
                                e.target.value
                              )
                            }
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-gray-700">{option.optionText}</span>
                        </label>
                      );
                    }
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Enter your answer"
                  value={
                    state.userAnswers[
                      lessonQuery.data!.problems[currentIndex].id
                    ] || ""
                  }
                  onChange={(e) =>
                    actions.setUserAnswer(
                      lessonQuery.data!.problems[currentIndex].id,
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              )}
              <div className="mt-4 flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!canProceed || submitLessonMutation.isPending}
                  onClick={() => {
                    if (isLastProblem) {
                      // Submit the entire lesson to backend
                      submitLessonMutation.mutate();
                    } else {
                      // Move to next problem
                      setCurrentIndex(currentIndex + 1);
                    }
                  }}
                >
                  {submitLessonMutation.isPending 
                    ? 'Submitting...'
                    : isLastProblem 
                      ? 'Finish Lesson' 
                      : 'Next'
                  }
                </Button>
                {!canProceed && (
                  <span className="text-gray-500 text-sm">
                    Please answer the question to continue
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Finished state with backend submission results
      return (
        <div className={`max-w-2xl mx-auto ${className}`}>
          <nav className="mb-4">
            <Link
              to={routes.lessons}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Lessons
            </Link>
          </nav>
          <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200 text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              🎉 Lesson Complete!
            </h2>
            <p className="text-gray-700 mb-4">
              You finished all problems. Great job!
            </p>
            
            {submissionResult && (
              <div className="mb-6 space-y-3">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-lg font-semibold text-green-800">
                    XP Earned: +{submissionResult.xpEarned}
                  </div>
                  <div className="text-sm text-green-600">
                    Total XP: {submissionResult.totalXp}
                  </div>
                </div>
                
                {submissionResult.streak && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-lg font-semibold text-blue-800">
                      🔥 Streak: {submissionResult.streak.current} days
                    </div>
                    {submissionResult.streak.updated && (
                      <div className="text-sm text-blue-600">Streak updated!</div>
                    )}
                  </div>
                )}
                
                {submissionResult.lesson && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-lg font-semibold text-purple-800">
                      Score: {submissionResult.lesson.score}%
                    </div>
                    <div className="text-sm text-purple-600">
                      {submissionResult.lesson.completed ? 'Lesson Completed!' : 'Keep practicing!'}
                    </div>
                  </div>
                )}
                
                {submissionResult.results && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Results:</h3>
                    <div className="text-sm space-y-1">
                      {submissionResult.results.map((result: any, idx: number) => (
                        <div key={idx} className={`flex justify-between ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          <span>Problem {idx + 1}</span>
                          <span>{result.isCorrect ? '✅' : '❌'} (+{result.xpEarned} XP)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <Button variant="primary" onClick={() => navigate(routes.lessons)}>
              Back to Lessons
            </Button>
          </div>
        </div>
      );
    }
  }
  if (lessonQuery.error) {
    return (
      <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Error: {lessonQuery.error.message}
          </p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Lesson not found</p>
        <Button onClick={() => navigate(routes.lessons)}>
          Back to Lessons
        </Button>
      </div>
    </div>
  );
};
