/**
 * API Module Exports
 * Centralized exports for all API-related functionality
 */

// Client and configuration
export { apiClient, API_ENDPOINTS } from './client';

// Services
export { lessonService, profileService, healthService, apiUtils } from './services';

// Types
export type {
  // Base types
  ApiResponse,
  PaginatedResponse,
  ApiError,
  LoadingState,
  DataState,
  BaseComponentProps,
  WithLoadingProps,
  
  // Lesson types
  Lesson,
  LessonListItem,
  Problem,
  ProblemOption,
  SubmissionRequest,
  Answer,
  SubmissionResponse,
  ProblemResult,
  LessonStats,
  
  // Profile types
  UserProfile,
  UserStats,
  
  // Health types
  HealthStatus,
  DetailedHealthStatus,
} from './types';

// Query keys
export { QUERY_KEYS } from './types';
