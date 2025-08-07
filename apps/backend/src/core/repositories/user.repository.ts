import { User, Prisma } from '@prisma/client';
import { prisma } from '../database';
import { LoggerService } from '../logger/logger.service';

export interface CreateUserInput {
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  password?: string;
  isVerified?: boolean;
  isActive?: boolean;
  googleId?: string;
  githubId?: string;
}

export interface UpdateUserInput {
  username?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  password?: string;
  isVerified?: boolean;
  isActive?: boolean;
  lastLoginAt?: Date;
}

export interface UserQueryOptions {
  include?: Prisma.UserInclude;
  select?: Prisma.UserSelect;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface UserFilters {
  isActive?: boolean;
  isVerified?: boolean;
  search?: string; // Search in email, username, firstName, lastName
}

/**
 * User Repository
 * Handles all database operations for User entity
 */
export class UserRepository {
  /**
   * Create a new user
   */
  static async create(data: CreateUserInput, options?: UserQueryOptions): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: {
          ...data,
          displayName: data.displayName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || undefined,
        },
        ...options,
      });

      LoggerService.info('User created successfully', { userId: user.id, email: user.email });
      return user;
    } catch (error) {
      LoggerService.error('Failed to create user', {
        error: error instanceof Error ? error.message : 'Unknown error',
        email: data.email,
      });
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  static async findById(id: string, options?: UserQueryOptions): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { id },
        ...options,
      });
    } catch (error) {
      LoggerService.error('Failed to find user by ID', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: id,
      });
      throw error;
    }
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string, options?: UserQueryOptions): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { email },
        ...options,
      });
    } catch (error) {
      LoggerService.error('Failed to find user by email', {
        error: error instanceof Error ? error.message : 'Unknown error',
        email,
      });
      throw error;
    }
  }

  /**
   * Find user by username
   */
  static async findByUsername(username: string, options?: UserQueryOptions): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { username },
        ...options,
      });
    } catch (error) {
      LoggerService.error('Failed to find user by username', {
        error: error instanceof Error ? error.message : 'Unknown error',
        username,
      });
      throw error;
    }
  }

  /**
   * Find user by OAuth provider ID
   */
  static async findByProviderId(
    provider: 'google' | 'github',
    providerId: string,
    options?: UserQueryOptions
  ): Promise<User | null> {
    try {
      const whereClause = provider === 'google' ? { googleId: providerId } : { githubId: providerId };
      return await prisma.user.findUnique({
        where: whereClause,
        ...options,
      });
    } catch (error) {
      LoggerService.error('Failed to find user by provider ID', {
        error: error instanceof Error ? error.message : 'Unknown error',
        provider,
        providerId,
      });
      throw error;
    }
  }

  /**
   * Update user by ID
   */
  static async update(
    id: string,
    data: UpdateUserInput,
    options?: UserQueryOptions
  ): Promise<User> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data,
        ...options,
      });

      LoggerService.info('User updated successfully', { userId: user.id });
      return user;
    } catch (error) {
      LoggerService.error('Failed to update user', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: id,
      });
      throw error;
    }
  }

  /**
   * Delete user by ID
   */
  static async delete(id: string): Promise<User> {
    try {
      const user = await prisma.user.delete({
        where: { id },
      });

      LoggerService.info('User deleted successfully', { userId: user.id });
      return user;
    } catch (error) {
      LoggerService.error('Failed to delete user', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: id,
      });
      throw error;
    }
  }

  /**
   * Get paginated users with filters
   */
  static async findMany(
    filters: UserFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 10 },
    options?: UserQueryOptions
  ) {
    try {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: Prisma.UserWhereInput = {};

      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      if (filters.isVerified !== undefined) {
        where.isVerified = filters.isVerified;
      }

      if (filters.search) {
        where.OR = [
          { email: { contains: filters.search, mode: 'insensitive' } },
          { username: { contains: filters.search, mode: 'insensitive' } },
          { firstName: { contains: filters.search, mode: 'insensitive' } },
          { lastName: { contains: filters.search, mode: 'insensitive' } },
          { displayName: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      // Get users and total count
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          ...options,
        }),
        prisma.user.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      LoggerService.error('Failed to fetch users', {
        error: error instanceof Error ? error.message : 'Unknown error',
        filters,
        pagination,
      });
      throw error;
    }
  }

  /**
   * Update user's last login timestamp
   */
  static async updateLastLogin(id: string): Promise<User> {
    try {
      return await this.update(id, { lastLoginAt: new Date() });
    } catch (error) {
      LoggerService.error('Failed to update last login', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: id,
      });
      throw error;
    }
  }

  /**
   * Check if email exists
   */
  static async emailExists(email: string, excludeUserId?: string): Promise<boolean> {
    try {
      const where: Prisma.UserWhereInput = { email };
      if (excludeUserId) {
        where.NOT = { id: excludeUserId };
      }

      const user = await prisma.user.findFirst({ where });
      return !!user;
    } catch (error) {
      LoggerService.error('Failed to check email existence', {
        error: error instanceof Error ? error.message : 'Unknown error',
        email,
      });
      throw error;
    }
  }

  /**
   * Check if username exists
   */
  static async usernameExists(username: string, excludeUserId?: string): Promise<boolean> {
    try {
      const where: Prisma.UserWhereInput = { username };
      if (excludeUserId) {
        where.NOT = { id: excludeUserId };
      }

      const user = await prisma.user.findFirst({ where });
      return !!user;
    } catch (error) {
      LoggerService.error('Failed to check username existence', {
        error: error instanceof Error ? error.message : 'Unknown error',
        username,
      });
      throw error;
    }
  }
}
