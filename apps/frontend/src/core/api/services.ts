import { apiClient, API_ENDPOINTS } from './client';
import type {
  Lesson,
  LessonListItem,
  SubmissionRequest,
  SubmissionResponse,
  LessonStats,
  UserProfile,
  UserStats,
  HealthStatus,
  DetailedHealthStatus,
} from './types';

/**
 * Lesson API Services
 */
export const lessonService = {
  /**
   * Get all lessons with progress indicators
   * GET /api/lessons?userId=1
   */
  getAllLessons: async (userId: number = 1): Promise<LessonListItem[]> => {
    const response = await apiClient.get(API_ENDPOINTS.LESSONS, {
      params: { userId }
    });
    return response.data;
  },

  /**
   * Get lesson by ID with problems (without correct answers)
   * GET /api/lessons/:id
   */
  getLessonById: async (id: string | number): Promise<Lesson> => {
    const response = await apiClient.get(API_ENDPOINTS.LESSON_DETAIL(id));
    return response.data;
  },

  /**
   * Submit lesson answers
   * POST /api/lessons/:id/submit
   */
  submitLesson: async (
    lessonId: string | number,
    submission: SubmissionRequest,
    userId: number = 1
  ): Promise<SubmissionResponse> => {
    const response = await apiClient.post(
      API_ENDPOINTS.LESSON_SUBMIT(lessonId),
      submission,
      {
        params: { userId }
      }
    );
    return response.data;
  },

  /**
   * Get lesson statistics
   * GET /api/lessons/stats
   */
  getLessonStats: async (): Promise<LessonStats> => {
    const response = await apiClient.get(API_ENDPOINTS.LESSON_STATS);
    return response.data;
  },
};

/**
 * Profile API Services
 */
export const profileService = {
  /**
   * Get user profile with math learning stats
   * GET /api/profile
   */
  getUserProfile: async (userId: number = 1): Promise<UserProfile> => {
    const response = await apiClient.get(API_ENDPOINTS.PROFILE, {
      params: { userId }
    });
    return response.data;
  },

  /**
   * Get detailed user learning statistics
   * GET /api/profile/stats/:id
   */
  getUserStats: async (userId: number = 1): Promise<UserStats> => {
    const response = await apiClient.get(API_ENDPOINTS.PROFILE_STATS, {
      params: { userId }
    });
    return response.data;
  },
};

/**
 * Health API Services
 */
export const healthService = {
  /**
   * Get basic health status
   * GET /api/health
   */
  getHealthStatus: async (): Promise<HealthStatus> => {
    const response = await apiClient.get(API_ENDPOINTS.HEALTH);
    return response.data;
  },

  /**
   * Get detailed health status
   * GET /api/health/detailed
   */
  getDetailedHealthStatus: async (): Promise<DetailedHealthStatus> => {
    const response = await apiClient.get(`${API_ENDPOINTS.HEALTH}/detailed`);
    return response.data;
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
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
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
