import { z } from 'zod';

/**
 * Common validation schemas
 */
export const CommonSchemas = {
  // Basic types
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  email: z.string().email(),
  url: z.string().url(),
  
  // Pagination
  pagination: z.object({
    page: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().min(1)).default('1'),
    limit: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().min(1).max(100)).default('10'),
  }),

  // Common query filters
  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),

  // Sort parameters
  sort: z.object({
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
  }),

  // Search parameters
  search: z.object({
    q: z.string().min(1).optional(),
  }),
};

/**
 * Response schemas
 */
export const ResponseSchemas = {
  // Success response wrapper
  success: <T>(dataSchema: z.ZodSchema<T>) => z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
    timestamp: z.string().datetime(),
  }),

  // Paginated response wrapper
  paginated: <T>(dataSchema: z.ZodSchema<T>) => z.object({
    success: z.literal(true),
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
    timestamp: z.string().datetime(),
  }),

  // Error response
  error: z.object({
    success: z.literal(false),
    error: z.string(),
    details: z.array(z.object({
      field: z.string(),
      message: z.string(),
      code: z.string(),
    })).optional(),
    timestamp: z.string().datetime(),
  }),
};

/**
 * Utility function to create API response schema
 */
export function createApiResponse<T>(dataSchema: z.ZodSchema<T>) {
  return ResponseSchemas.success(dataSchema);
}

/**
 * Utility function to create paginated API response schema
 */
export function createPaginatedResponse<T>(dataSchema: z.ZodSchema<T>) {
  return ResponseSchemas.paginated(dataSchema);
}
