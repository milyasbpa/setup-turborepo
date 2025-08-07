import { z } from 'zod';
import { createApiResponse, createPaginatedResponse } from '../../core/validation/validation.schemas';
import { CommonSchemas } from '../../core/validation/validation.schemas';

/**
 * User entity schema - matches Prisma User model
 */
export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  username: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  displayName: z.string().nullable(),
  avatar: z.string().url().nullable(),
  bio: z.string().nullable(),
  isVerified: z.boolean(),
  isActive: z.boolean(),
  googleId: z.string().nullable(),
  githubId: z.string().nullable(),
  lastLoginAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * Public user schema (excludes sensitive fields)
 */
export const PublicUserSchema = UserSchema.omit({
  googleId: true,
  githubId: true,
});

/**
 * Create user request schema
 */
export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .optional(),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .optional(),
  displayName: z.string()
    .min(1, 'Display name is required')
    .max(100, 'Display name must be less than 100 characters')
    .optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
    .optional(),
});

/**
 * Update user request schema
 */
export const UpdateUserSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .optional(),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .optional(),
  displayName: z.string()
    .min(1, 'Display name is required')
    .max(100, 'Display name must be less than 100 characters')
    .optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  isActive: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});

/**
 * User query parameters schema
 */
export const UserQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().min(1)).default('1'),
  limit: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().min(1).max(100)).default('10'),
  search: z.string().optional(),
  isActive: z.string().transform(val => val === 'true').pipe(z.boolean()).optional(),
  isVerified: z.string().transform(val => val === 'true').pipe(z.boolean()).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'email', 'username', 'displayName']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * User route parameters schema
 */
export const UserParamsSchema = z.object({
  id: z.string().cuid('Invalid user ID format'),
});

/**
 * Login request schema
 */
export const LoginUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Reset password request schema
 */
export const ResetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

/**
 * Change password request schema
 */
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
});

/**
 * Response schemas
 */
export const UserResponseSchema = createApiResponse(PublicUserSchema);
export const UsersListResponseSchema = createPaginatedResponse(PublicUserSchema);
export const CreateUserResponseSchema = createApiResponse(PublicUserSchema);
export const UpdateUserResponseSchema = createApiResponse(PublicUserSchema);
export const LoginResponseSchema = createApiResponse(
  z.object({
    user: PublicUserSchema,
    token: z.string(),
    refreshToken: z.string(),
  })
);

/**
 * TypeScript types inferred from schemas
 */
export type UserDto = z.infer<typeof UserSchema>;
export type PublicUserDto = z.infer<typeof PublicUserSchema>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type UserQueryDto = z.infer<typeof UserQuerySchema>;
export type UserParamsDto = z.infer<typeof UserParamsSchema>;
export type LoginUserDto = z.infer<typeof LoginUserSchema>;
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;

// Response types
export type UserResponseDto = z.infer<typeof UserResponseSchema>;
export type UsersListResponseDto = z.infer<typeof UsersListResponseSchema>;
export type CreateUserResponseDto = z.infer<typeof CreateUserResponseSchema>;
export type UpdateUserResponseDto = z.infer<typeof UpdateUserResponseSchema>;
export type LoginResponseDto = z.infer<typeof LoginResponseSchema>;
