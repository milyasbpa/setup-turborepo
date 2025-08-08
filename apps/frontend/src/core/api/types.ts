/**
 * API Type Definitions
 * TypeScript interfaces for all API requests and responses
 */
import React from 'react';

// Base API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Lesson Types
export interface Lesson {
  id: number;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  isCompleted: boolean;
  completionPercentage: number;
  problems: Problem[];
}

export interface LessonListItem {
  id: number;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  isCompleted: boolean;
  completionPercentage: number;
}

export interface Problem {
  id: number;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'INPUT';
  options?: ProblemOption[];
  // Note: correctAnswer is not included to prevent leaking to frontend
}

export interface ProblemOption {
  id: number;
  text: string;
  value: string;
}

// Submission Types
export interface SubmissionRequest {
  attemptId: string;
  answers: Answer[];
}

export interface Answer {
  problemId: number;
  answer: string;
}

export interface SubmissionResponse {
  results: ProblemResult[];
  xpGained: number;
  totalXp: number;
  streakCount: number;
  lessonCompleted: boolean;
  completionPercentage: number;
}

export interface ProblemResult {
  problemId: number;
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer: string;
  xpGained: number;
}

// Profile Types
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
  lessonsCompleted: number;
  totalLessons: number;
  progressPercentage: number;
  lastActivityDate: string | null;
}

export interface UserStats {
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
  lessonsCompleted: number;
  totalLessons: number;
  progressPercentage: number;
  lastActivityDate: string | null;
  averageScore: number;
  totalSubmissions: number;
}

// Lesson Statistics
export interface LessonStats {
  totalLessons: number;
  completedLessons: number;
  averageScore: number;
  totalSubmissions: number;
  totalProblems: number;
}

// Health Check Types
export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version?: string;
}

export interface DetailedHealthStatus extends HealthStatus {
  database: {
    status: 'connected' | 'disconnected';
    responseTime: number;
  };
  services: {
    [key: string]: {
      status: 'up' | 'down';
      responseTime?: number;
    };
  };
}

// Query Keys for React Query
export const QUERY_KEYS = {
  // Lessons
  LESSONS: ['lessons'] as const,
  LESSON_DETAIL: (id: string | number) => ['lessons', id] as const,
  LESSON_STATS: ['lessons', 'stats'] as const,
  
  // Profile
  PROFILE: ['profile'] as const,
  PROFILE_STATS: ['profile', 'stats'] as const,
  
  // Health
  HEALTH: ['health'] as const,
  HEALTH_DETAILED: ['health', 'detailed'] as const,
} as const;

// Loading and Error States
export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  error?: ApiError | null;
}

export interface DataState<T> extends LoadingState {
  data?: T | null;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface WithLoadingProps extends BaseComponentProps {
  isLoading?: boolean;
  error?: ApiError | null;
}
