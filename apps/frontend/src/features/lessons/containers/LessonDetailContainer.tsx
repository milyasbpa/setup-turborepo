import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/core/components";
import { useLocalizedRoutes } from "@/core/i18n";
import { useLessonsDetail } from "../context/LessonsDetailContext";

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
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [finished, setFinished] = useState(false);
  const [incorrectProblems, setIncorrectProblems] = useState<number[]>([]); // store indices of incorrect answers

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
              {lessonQuery.data.problems[currentIndex].type ===
              "multiple-choice" ? (
                <div className="space-y-2">
                  {lessonQuery.data.problems[currentIndex].options?.map(
                    (option: string, optIndex: number) => {
                      return (
                        <label
                          key={optIndex}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`problem-${
                              lessonQuery.data!.problems[currentIndex].id
                            }`}
                            value={optIndex}
                            checked={
                              state.userAnswers[
                                lessonQuery.data!.problems[currentIndex].id
                              ] === optIndex
                            }
                            onChange={(e) =>
                              actions.setUserAnswer(
                                lessonQuery.data!.problems[currentIndex].id,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                            disabled={showFeedback}
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      );
                    }
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  placeholder={
                    lessonQuery.data.problems[currentIndex].placeholder
                  }
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
                  disabled={showFeedback}
                />
              )}
              <div className="mt-4 flex items-center gap-2">
                {!showFeedback ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      const pid = lessonQuery.data!.problems[currentIndex].id;
                      const correct = actions.checkAnswer(pid);
                      setIsCorrect(correct);
                      setShowFeedback(true);
                      if (correct) actions.markProblemCompleted(pid);
                      else
                        setIncorrectProblems((prev) => [...prev, currentIndex]);
                    }}
                  >
                    Check Answer
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setShowFeedback(false);
                      setIsCorrect(null);
                      if (
                        currentIndex + 1 <
                        lessonQuery.data!.problems.length
                      ) {
                        setCurrentIndex(currentIndex + 1);
                      } else {
                        setFinished(true);
                      }
                    }}
                  >
                    {currentIndex + 1 < lessonQuery.data!.problems.length
                      ? "Next"
                      : "Finish"}
                  </Button>
                )}
                {showFeedback && (
                  <span
                    className={
                      isCorrect
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {isCorrect ? "Correct! ✅" : "Incorrect. ❌"}
                  </span>
                )}
              </div>
              {lessonQuery.data.problems[currentIndex].explanation &&
                isCorrect &&
                showFeedback && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">
                      Explanation:
                    </h4>
                    <p className="text-blue-800 text-sm">
                      {lessonQuery.data.problems[currentIndex].explanation}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      );
    } else {
      // Finished state
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
            <div className="mb-4">
              <span className="text-lg font-semibold">Result: </span>
              <span className="text-green-700 font-bold">
                {lessonQuery.data.problems.length - incorrectProblems.length}{" "}
                correct
              </span>
              <span className="text-gray-500">
                {" "}
                / {lessonQuery.data.problems.length} total
              </span>
            </div>
            {incorrectProblems.length > 0 && (
              <div className="mb-4">
                <span className="text-red-600 font-medium">
                  You got {incorrectProblems.length} wrong:
                </span>
                <ul className="text-left mt-2 ml-4 list-disc text-sm text-gray-700">
                  {incorrectProblems.map((idx) => (
                    <li key={idx}>
                      Problem {idx + 1}:{" "}
                      {lessonQuery.data!.problems[idx].question}
                    </li>
                  ))}
                </ul>
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
