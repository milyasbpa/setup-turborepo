import { z } from 'zod';
import { createApiResponse, createPaginatedResponse } from '../../core/validation/validation.schemas';
import { CommonSchemas } from '../../core/validation/validation.schemas';

/**
 * User entity schema
 */
export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * Create user request schema
 */
export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format'),
});

/**
 * Update user request schema
 */
export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
}).refine(data => data.name || data.email, {
  message: "At least one field (name or email) must be provided",
});

/**
 * User query parameters schema
 */
export const UserQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().min(1)).default('1'),
  limit: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().min(1).max(100)).default('10'),
  search: z.string().optional(),
  sortBy: z.enum(['id', 'name', 'email', 'createdAt']).default('id'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

/**
 * User route parameters schema
 */
export const UserParamsSchema = z.object({
  id: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().positive()),
});

/**
 * Response schemas
 */
export const UserResponseSchema = createApiResponse(UserSchema);
export const UsersListResponseSchema = createPaginatedResponse(UserSchema);
export const CreateUserResponseSchema = createApiResponse(UserSchema);
export const UpdateUserResponseSchema = createApiResponse(UserSchema);

/**
 * TypeScript types inferred from schemas
 */
export type UserDto = z.infer<typeof UserSchema>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type UserQueryDto = z.infer<typeof UserQuerySchema>;
export type UserParamsDto = z.infer<typeof UserParamsSchema>;
export type UserResponseDto = z.infer<typeof UserResponseSchema>;
export type UsersListResponseDto = z.infer<typeof UsersListResponseSchema>;
export type CreateUserResponseDto = z.infer<typeof CreateUserResponseSchema>;
export type UpdateUserResponseDto = z.infer<typeof UpdateUserResponseSchema>;
