/**
 * API Module Exports
 * Centralized exports for all API-related functionality
 */

// OpenAPI-based client and services (new implementation)
export { default as apiClient, extractData, getErrorMessage } from './client-openapi';
export { lessonService, profileService, healthService, apiUtils } from './services-openapi';

// Legacy client (keeping for backward compatibility during migration)
export { apiClient as legacyApiClient, API_ENDPOINTS } from './client';
export { lessonService as legacyLessonService, profileService as legacyProfileService, healthService as legacyHealthService, apiUtils as legacyApiUtils } from './services';

// Types from OpenAPI schema
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
} from './services-openapi';

// Legacy types (keeping for backward compatibility)
export type {
  // Base types
  ApiResponse,
  PaginatedResponse,
  ApiError,
  LoadingState,
  DataState,
  BaseComponentProps,
  WithLoadingProps,
  
  // Legacy lesson types
  Answer,
  ProblemResult,
  
  // Legacy health types
  DetailedHealthStatus,
} from './types';

// Query keys
export { QUERY_KEYS } from './types';
