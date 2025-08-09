import React, { createContext, useContext, useReducer, ReactNode, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api';

// Types
export interface Problem {
  id: number;
  question: string;
  type: 'multiple-choice' | 'input' | 'true-false';
  options?: string[];
  correctAnswer?: number | string;
  placeholder?: string;
  explanation?: string;
}

export interface LessonDetail {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  problems: Problem[];
  tags?: string[];
  prerequisites?: string[];
  nextLessonId?: string;
  previousLessonId?: string;
}

export interface LessonsDetailState {
  currentProblemIndex: number;
  userAnswers: Record<number, string | number>;
  completedProblems: number[];
}

// Actions
type LessonsDetailAction =
  | { type: 'SET_CURRENT_PROBLEM'; payload: number }
  | { type: 'SET_USER_ANSWER'; payload: { problemId: number; answer: string | number } }
  | { type: 'MARK_PROBLEM_COMPLETED'; payload: number }
  | { type: 'RESET_LESSON' };

// Initial state
const initialState: LessonsDetailState = {
  currentProblemIndex: 0,
  userAnswers: {},
  completedProblems: [],
};

// Reducer
function lessonsDetailReducer(state: LessonsDetailState, action: LessonsDetailAction): LessonsDetailState {
  switch (action.type) {
    case 'SET_CURRENT_PROBLEM':
      return {
        ...state,
        currentProblemIndex: action.payload,
      };
    case 'SET_USER_ANSWER':
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [action.payload.problemId]: action.payload.answer,
        },
      };
    case 'MARK_PROBLEM_COMPLETED':
      return {
        ...state,
        completedProblems: [...state.completedProblems, action.payload],
      };
    case 'RESET_LESSON':
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

// Context
interface LessonsDetailContextType {
  state: LessonsDetailState;
  lessonQuery: {
    data: LessonDetail | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  actions: {
    setCurrentProblem: (index: number) => void;
    setUserAnswer: (problemId: number, answer: string | number) => void;
    markProblemCompleted: (problemId: number) => void;
    resetLesson: () => void;
    checkAnswer: (problemId: number) => boolean;
    getProgress: () => number;
    canProceedToNext: () => boolean;
  };
}

const LessonsDetailContext = createContext<LessonsDetailContextType | undefined>(undefined);

// Provider component
interface LessonsDetailProviderProps {
  children: ReactNode;
  lessonId: string;
}

export const LessonsDetailProvider: React.FC<LessonsDetailProviderProps> = ({ children, lessonId }) => {
  const [state, dispatch] = useReducer(lessonsDetailReducer, initialState);

  // React Query for lesson data
  const lessonQuery = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      try {
        // Try to fetch from API first
        const response = await apiClient.GET('/api/lessons/{id}', {
          params: { path: { id: lessonId } }
        });

        if (response.data?.data) {
          // API returned data but let's use mock data for problems since API doesn't have them yet
          throw new Error('Using mock data for development');
        } else {
          throw new Error('Lesson not found');
        }
      } catch (error) {
        console.warn('API fetch failed, using mock data:', error);
        
        // Fallback to mock data
        const mockLesson: LessonDetail = {
          id: lessonId,
          title: 'Basic Arithmetic',
          description: 'Master addition and subtraction with fun problems',
          difficulty: 'Intermediate',
          duration: '30 minutes',
          status: 'in-progress',
          progress: 0,
          problems: [
            {
              id: 1,
              question: 'What is 2 + 3?',
              type: 'multiple-choice',
              options: ['4', '5', '6', '7'],
              correctAnswer: 1,
              explanation: '2 + 3 = 5. Count 2, then add 3 more: 3, 4, 5.'
            },
            {
              id: 2,
              question: 'What is 4 + 1?',
              type: 'multiple-choice',
              options: ['3', '4', '5', '6'],
              correctAnswer: 2,
              explanation: '4 + 1 = 5. Starting from 4, add 1 more to get 5.'
            },
            {
              id: 3,
              question: 'Calculate: 6 + 2',
              type: 'input',
              placeholder: 'Enter your answer',
              correctAnswer: 8,
              explanation: '6 + 2 = 8. Count up from 6: 7, 8.'
            }
          ],
          tags: ['arithmetic', 'addition', 'basic-math'],
          prerequisites: ['Number Recognition'],
        };

        return mockLesson;
      }
    },
    retry: false, // Disable retry to prevent multiple calls
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
  });

  const setCurrentProblem = useCallback((index: number) => {
    dispatch({ type: 'SET_CURRENT_PROBLEM', payload: index });
  }, []);

  const setUserAnswer = useCallback((problemId: number, answer: string | number) => {
    dispatch({ type: 'SET_USER_ANSWER', payload: { problemId, answer } });
  }, []);

  const markProblemCompleted = useCallback((problemId: number) => {
    if (!state.completedProblems.includes(problemId)) {
      dispatch({ type: 'MARK_PROBLEM_COMPLETED', payload: problemId });
    }
  }, [state.completedProblems]);

  const resetLesson = useCallback(() => {
    dispatch({ type: 'RESET_LESSON' });
  }, []);

  const checkAnswer = useCallback((problemId: number): boolean => {
    const problem = lessonQuery.data?.problems.find(p => p.id === problemId);
    const userAnswer = state.userAnswers[problemId];
    
    if (!problem || userAnswer === undefined) return false;
    
    return problem.correctAnswer === userAnswer;
  }, [lessonQuery.data?.problems, state.userAnswers]);

  const getProgress = useCallback((): number => {
    if (!lessonQuery.data?.problems.length) return 0;
    return Math.round((state.completedProblems.length / lessonQuery.data.problems.length) * 100);
  }, [lessonQuery.data?.problems.length, state.completedProblems.length]);

  const canProceedToNext = useCallback((): boolean => {
    return lessonQuery.data ? state.completedProblems.length === lessonQuery.data.problems.length : false;
  }, [lessonQuery.data, state.completedProblems.length]);

  const actions = useMemo(() => ({
    setCurrentProblem,
    setUserAnswer,
    markProblemCompleted,
    resetLesson,
    checkAnswer,
    getProgress,
    canProceedToNext,
  }), [setCurrentProblem, setUserAnswer, markProblemCompleted, resetLesson, checkAnswer, getProgress, canProceedToNext]);

  const contextValue = useMemo(() => ({
    state,
    lessonQuery: {
      data: lessonQuery.data,
      isLoading: lessonQuery.isLoading,
      error: lessonQuery.error,
    },
    actions,
  }), [state, lessonQuery.data, lessonQuery.isLoading, lessonQuery.error, actions]);

  return (
    <LessonsDetailContext.Provider value={contextValue}>
      {children}
    </LessonsDetailContext.Provider>
  );
};

// Custom hook
export const useLessonsDetail = () => {
  const context = useContext(LessonsDetailContext);
  if (context === undefined) {
    throw new Error('useLessonsDetail must be used within a LessonsDetailProvider');
  }
  return context;
};

export default LessonsDetailContext;
