import { z } from 'zod';
import { createApiResponse } from '../../core/validation/validation.schemas';

/**
 * Health check response schema
 */
export const HealthStatusSchema = z.object({
  status: z.string(),
  service: z.string(),
  timestamp: z.string().datetime(),
  uptime: z.number(),
  version: z.string(),
  environment: z.string().optional(),
  dependencies: z.record(z.object({
    status: z.enum(['healthy', 'unhealthy', 'degraded']),
    responseTime: z.number().optional(),
    lastCheck: z.string().datetime().optional(),
  })).optional(),
});

/**
 * Health check response DTO
 */
export const HealthResponseSchema = createApiResponse(HealthStatusSchema);

/**
 * TypeScript types inferred from schemas
 */
export type HealthStatusDto = z.infer<typeof HealthStatusSchema>;
export type HealthResponseDto = z.infer<typeof HealthResponseSchema>;
