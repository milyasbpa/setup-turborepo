import { BaseService } from '../../core/base';
import { LoggerService } from '../../core/logger';
import { UserRepository } from '../../core/repositories';
import { 
  CreateUserDto, 
  UpdateUserDto, 
  UserQueryDto,
  PublicUserDto,
  LoginUserDto,
  ChangePasswordDto 
} from './user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

/**
 * Helper function to transform Prisma User to PublicUserDto
 */
function transformUserToPublicDto(user: any): PublicUserDto {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName,
    avatar: user.avatar,
    bio: user.bio,
    isVerified: user.isVerified,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

/**
 * User Service
 * Business logic for user management with Prisma integration
 */
export class UserService extends BaseService {
  private readonly saltRounds = 12;

  /**
   * Get all users with pagination and filtering
   */
  async getAllUsers(query: UserQueryDto): Promise<{
    users: PublicUserDto[];
    total: number;
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    LoggerService.logService('UserService', 'getAllUsers', true, { query });
    
    try {
      const filters = {
        isActive: query.isActive,
        isVerified: query.isVerified,
        search: query.search,
      };

      const pagination = {
        page: query.page,
        limit: query.limit,
      };

      const result = await UserRepository.findMany(filters, pagination, {
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          displayName: true,
          avatar: true,
          bio: true,
          isVerified: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        users: result.data.map(transformUserToPublicDto),
        total: result.pagination.total,
        pagination: result.pagination,
      };
    } catch (error) {
      LoggerService.error('Failed to get all users', {
        error: error instanceof Error ? error.message : 'Unknown error',
        query,
      });
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<PublicUserDto | null> {
    LoggerService.logService('UserService', `getUserById(${id})`, true);
    
    try {
      const user = await UserRepository.findById(id, {
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          displayName: true,
          avatar: true,
          bio: true,
          isVerified: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user ? transformUserToPublicDto(user) : null;
    } catch (error) {
      LoggerService.error('Failed to get user by ID', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: id,
      });
      throw error;
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    LoggerService.logService('UserService', `getUserByEmail(${email})`, true);
    
    try {
      return await UserRepository.findByEmail(email);
    } catch (error) {
      LoggerService.error('Failed to get user by email', {
        error: error instanceof Error ? error.message : 'Unknown error',
        email,
      });
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserDto): Promise<PublicUserDto> {
    LoggerService.logService('UserService', 'createUser', true, { email: userData.email });
    
    try {
      // Check if email already exists
      const existingUser = await UserRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }

      // Check if username already exists (if provided)
      if (userData.username) {
        const existingUsername = await UserRepository.findByUsername(userData.username);
        if (existingUsername) {
          throw new Error('Username already exists');
        }
      }

      // Hash password if provided
      let hashedPassword: string | undefined;
      if (userData.password) {
        hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);
      }

      // Create user
      const user = await UserRepository.create({
        ...userData,
        password: hashedPassword,
        displayName: userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || undefined,
      }, {
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          displayName: true,
          avatar: true,
          bio: true,
          isVerified: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      LoggerService.info('User created successfully', { userId: user.id, email: user.email });
      return transformUserToPublicDto(user);
    } catch (error) {
      LoggerService.error('Failed to create user', {
        error: error instanceof Error ? error.message : 'Unknown error',
        email: userData.email,
      });
      throw error;
    }
  }

  /**
   * Update user by ID
   */
  async updateUser(id: string, userData: UpdateUserDto): Promise<PublicUserDto | null> {
    LoggerService.logService('UserService', `updateUser(${id})`, true, { updatedFields: Object.keys(userData) });
    
    try {
      // Check if user exists
      const existingUser = await UserRepository.findById(id);
      if (!existingUser) {
        return null;
      }

      // Check if username already exists (if being updated)
      if (userData.username) {
        const usernameExists = await UserRepository.usernameExists(userData.username, id);
        if (usernameExists) {
          throw new Error('Username already exists');
        }
      }

      // Update display name if first or last name is being updated
      const updateData = { ...userData };
      if (userData.firstName || userData.lastName) {
        const firstName = userData.firstName || existingUser.firstName || '';
        const lastName = userData.lastName || existingUser.lastName || '';
        updateData.displayName = `${firstName} ${lastName}`.trim() || undefined;
      }

      const user = await UserRepository.update(id, updateData, {
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          displayName: true,
          avatar: true,
          bio: true,
          isVerified: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return transformUserToPublicDto(user);
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
  async deleteUser(id: string): Promise<boolean> {
    LoggerService.logService('UserService', `deleteUser(${id})`, true);
    
    try {
      const user = await UserRepository.findById(id);
      if (!user) {
        return false;
      }

      await UserRepository.delete(id);
      LoggerService.info('User deleted successfully', { userId: id });
      return true;
    } catch (error) {
      LoggerService.error('Failed to delete user', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: id,
      });
      throw error;
    }
  }

  /**
   * Authenticate user login
   */
  async authenticateUser(loginData: LoginUserDto): Promise<User | null> {
    LoggerService.logService('UserService', `authenticateUser(${loginData.email})`, true);
    
    try {
      const user = await UserRepository.findByEmail(loginData.email);
      if (!user || !user.password) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Update last login
      await UserRepository.updateLastLogin(user.id);
      
      return user;
    } catch (error) {
      LoggerService.error('Failed to authenticate user', {
        error: error instanceof Error ? error.message : 'Unknown error',
        email: loginData.email,
      });
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, passwordData: ChangePasswordDto): Promise<boolean> {
    LoggerService.logService('UserService', `changePassword(${userId})`, true);
    
    try {
      const user = await UserRepository.findById(userId);
      if (!user || !user.password) {
        return false;
      }

      const isCurrentPasswordValid = await bcrypt.compare(passwordData.currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      const hashedNewPassword = await bcrypt.hash(passwordData.newPassword, this.saltRounds);
      
      // Update password directly via Prisma - we need to extend UpdateUserInput
      const updateData = { ...user, password: hashedNewPassword };
      await UserRepository.update(userId, updateData as any);
      
      LoggerService.info('Password changed successfully', { userId });
      return true;
    } catch (error) {
      LoggerService.error('Failed to change password', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    verifiedUsers: number;
    recentUsers: PublicUserDto[];
  }> {
    LoggerService.logService('UserService', 'getUserStats', true);

    try {
      const [allUsers, recentUsersResult] = await Promise.all([
        UserRepository.findMany({}, { page: 1, limit: 1000000 }), // Get all for stats
        UserRepository.findMany({}, { page: 1, limit: 5 }, {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            displayName: true,
            avatar: true,
            bio: true,
            isVerified: true,
            isActive: true,
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
      ]);

      const activeUsers = allUsers.data.filter(user => user.isActive).length;
      const verifiedUsers = allUsers.data.filter(user => user.isVerified).length;

      return {
        totalUsers: allUsers.pagination.total,
        activeUsers,
        verifiedUsers,
        recentUsers: recentUsersResult.data.map(transformUserToPublicDto),
      };
    } catch (error) {
      LoggerService.error('Failed to get user stats', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
}
