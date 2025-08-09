import React, { createContext, useContext, useReducer, ReactNode, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api';

// Types
export interface Problem {
  id: string;
  question: string;
  problemType: 'multiple_choice' | 'input' | 'true_false';
  order: number;
  difficulty: string;
  options?: Array<{
    id: string;
    optionText: string;
    order: number;
  }>;
  correctAnswer?: string;
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
  userAnswers: Record<string, string | number>;
  completedProblems: string[];
}

// Actions
type LessonsDetailAction =
  | { type: 'SET_CURRENT_PROBLEM'; payload: number }
  | { type: 'SET_USER_ANSWER'; payload: { problemId: string; answer: string | number } }
  | { type: 'MARK_PROBLEM_COMPLETED'; payload: string }
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
    setUserAnswer: (problemId: string, answer: string | number) => void;
    markProblemCompleted: (problemId: string) => void;
    resetLesson: () => void;
    checkAnswer: (problemId: string) => boolean;
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
      const response = await apiClient.GET('/api/lessons/{id}', {
        params: { path: { id: lessonId } }
      });

      if (response.error) {
        throw new Error('Failed to fetch lesson');
      }

      if (!response.data?.data) {
        throw new Error('Lesson not found');
      }

      // Transform backend response to match our interface
      const backendLesson = response.data.data;
      const transformedLesson: LessonDetail = {
        id: backendLesson.id,
        title: backendLesson.title,
        description: backendLesson.description,
        difficulty: 'Intermediate', // Default since backend doesn't have this field
        duration: '30 minutes', // Default since backend doesn't have this field
        status: 'in-progress',
        progress: 0,
        problems: backendLesson.problems.map((problem: any) => ({
          id: problem.id,
          question: problem.question,
          problemType: problem.problemType,
          order: problem.order,
          difficulty: problem.difficulty,
          options: problem.options || [],
          correctAnswer: problem.correctAnswer,
          explanation: problem.explanation,
        })),
        tags: ['arithmetic', 'addition', 'basic-math'],
        prerequisites: ['Number Recognition'],
      };

      return transformedLesson;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const setCurrentProblem = useCallback((index: number) => {
    dispatch({ type: 'SET_CURRENT_PROBLEM', payload: index });
  }, []);

  const setUserAnswer = useCallback((problemId: string, answer: string | number) => {
    dispatch({ type: 'SET_USER_ANSWER', payload: { problemId, answer } });
  }, []);

  const markProblemCompleted = useCallback((problemId: string) => {
    if (!state.completedProblems.includes(problemId)) {
      dispatch({ type: 'MARK_PROBLEM_COMPLETED', payload: problemId });
    }
  }, [state.completedProblems]);

  const resetLesson = useCallback(() => {
    dispatch({ type: 'RESET_LESSON' });
  }, []);

  const checkAnswer = useCallback((problemId: string): boolean => {
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
