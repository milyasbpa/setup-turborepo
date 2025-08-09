import apiClient, { getErrorMessage } from './client-openapi';
import type { components } from './schema';

/**
 * Type definitions from OpenAPI schema
 */
type Lesson = components['schemas']['Lesson'];
type LessonWithProblems = components['schemas']['LessonWithProblems'];
type Problem = components['schemas']['Problem'];
type ProblemOption = components['schemas']['ProblemOption'];
type SubmitLessonRequest = components['schemas']['SubmitLessonRequest'];
type SubmitLessonResponse = components['schemas']['SubmitLessonResponse'];
type UserProfile = components['schemas']['UserProfile'];
type UserStats = components['schemas']['UserStats'];
type HealthStatus = components['schemas']['HealthStatus'];

/**
 * Lesson API Services using OpenAPI-fetch
 */
export const lessonService = {
  /**
   * Get all lessons with progress indicators
   * GET /api/lessons?userId=1
   */
  getAllLessons: async (userId: number = 1): Promise<Lesson[]> => {
    const { data, error } = await apiClient.GET('/api/lessons', {
      params: {
        query: { userId: userId.toString() }
      }
    });

    if (error) {
      throw new Error(getErrorMessage(error));
    }

    // Extract data from wrapped response
    return data?.data || [];
  },

  /**
   * Get lesson by ID with problems (without correct answers)
   * GET /api/lessons/:id
   */
  getLessonById: async (id: string | number): Promise<LessonWithProblems> => {
    const { data, error } = await apiClient.GET('/api/lessons/{id}', {
      params: {
        path: { id: id.toString() }
      }
    });

    if (error) {
      throw new Error(getErrorMessage(error));
    }

    const lesson = data?.data;
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    return lesson;
  },

  /**
   * Submit lesson answers and get results
   * POST /api/lessons/:id/submit
   */
  submitLesson: async (
    lessonId: string | number,
    submission: SubmitLessonRequest,
    userId: number = 1
  ): Promise<SubmitLessonResponse> => {
    const { data, error } = await apiClient.POST('/api/lessons/{id}/submit', {
      params: {
        path: { id: lessonId.toString() },
        query: { userId: userId.toString() }
      },
      body: submission
    });

    if (error) {
      throw new Error(getErrorMessage(error));
    }

    const result = data?.data;
    if (!result) {
      throw new Error('Failed to submit lesson');
    }

    return result;
  },

  /**
   * Get lesson statistics
   * GET /api/lessons/stats
   */
  getLessonStats: async () => {
    const { data, error } = await apiClient.GET('/api/lessons/stats', {});

    if (error) {
      throw new Error(getErrorMessage(error));
    }

    const stats = data?.data;
    if (!stats) {
      throw new Error('Failed to get lesson stats');
    }

    return stats;
  },
};

/**
 * Profile API Services using OpenAPI-fetch
 */
export const profileService = {
  /**
   * Get user profile with math learning stats
   * GET /api/profile
   */
  getUserProfile: async (userId: number = 1): Promise<UserProfile> => {
    const { data, error } = await apiClient.GET('/api/profile', {
      params: {
        query: { userId: userId.toString() }
      }
    });

    if (error) {
      throw new Error(getErrorMessage(error));
    }

    const profile = data?.data;
    if (!profile) {
      throw new Error('Profile not found');
    }

    return profile;
  },

  /**
   * Get detailed user learning statistics
   * GET /api/profile/stats
   */
  getUserStats: async (userId: number = 1): Promise<UserStats> => {
    const { data, error } = await apiClient.GET('/api/profile/stats', {
      params: {
        query: { userId: userId.toString() }
      }
    });

    if (error) {
      throw new Error(getErrorMessage(error));
    }

    const stats = data?.data;
    if (!stats) {
      throw new Error('Failed to get user stats');
    }

    return stats;
  },
};

/**
 * Health API Services using OpenAPI-fetch
 */
export const healthService = {
  /**
   * Get basic health status
   * GET /api/health
   */
  getHealthStatus: async (): Promise<HealthStatus> => {
    const { data, error } = await apiClient.GET('/api/health', {});

    if (error) {
      throw new Error(getErrorMessage(error));
    }

    const health = data?.data;
    if (!health) {
      throw new Error('Failed to get health status');
    }

    return health;
  },
};

/**
 * Utility Functions
 */
export const apiUtils = {
  /**
   * Generate unique attempt ID for lesson submissions
   */
  generateAttemptId: (): string => {
    return `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Check if error is a network error
   */
  isNetworkError: (error: any): boolean => {
    return !error.response && error.code === 'NETWORK_ERROR';
  },

  /**
   * Check if error is a timeout error
   */
  isTimeoutError: (error: any): boolean => {
    return error.code === 'ECONNABORTED';
  },

  /**
   * Get user-friendly error message
   */
  getErrorMessage: (error: any): string => {
    return getErrorMessage(error);
  },

  /**
   * Format XP display
   */
  formatXP: (xp: number): string => {
    if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}K XP`;
    }
    return `${xp} XP`;
  },

  /**
   * Format streak display
   */
  formatStreak: (streak: number): string => {
    if (streak === 0) return 'No streak';
    if (streak === 1) return '1 day';
    return `${streak} days`;
  },

  /**
   * Format completion percentage
   */
  formatPercentage: (percentage: number): string => {
    return `${Math.round(percentage)}%`;
  },
};

/**
 * Export types for use in components
 */
export type {
  Lesson,
  LessonWithProblems,
  Problem,
  ProblemOption,
  SubmitLessonRequest,
  SubmitLessonResponse,
  UserProfile,
  UserStats,
  HealthStatus,
};
