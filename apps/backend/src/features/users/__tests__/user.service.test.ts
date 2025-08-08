/**
 * UserService Unit Tests
 * Tests for user business logic and operations
 */

import { UserService } from '../user.service';

// Mock dependencies at the top
jest.mock('../../../core/repositories', () => ({
  UserRepository: {
    findMany: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    create: jest.fn(),
    updateLastLogin: jest.fn(),
    delete: jest.fn()
  }
}));

jest.mock('../../../core/logger', () => ({
  LoggerService: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    logService: jest.fn()
  }
}));

import { UserRepository } from '../../../core/repositories';
import { LoggerService } from '../../../core/logger';
import * as bcrypt from 'bcrypt';

const MockUserRepository = UserRepository as jest.Mocked<typeof UserRepository>;
const MockLoggerService = LoggerService as jest.Mocked<typeof LoggerService>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return paginated users successfully', async () => {
      // Arrange
      const mockQuery = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const,
        isActive: true,
        search: ''
      };

      const mockUsers = [
        {
          id: 'user-1',
          email: 'test1@example.com',
          username: 'user1',
          firstName: 'Test',
          lastName: 'User1',
          displayName: 'Test User1',
          avatar: null,
          totalXp: 0,
          currentStreak: 0,
          bestStreak: 0,
          lastActivityDate: null,
          password: null,
          isActive: true,
          isVerified: true,
          lastLoginAt: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'user-2',
          email: 'test2@example.com',
          username: 'user2',
          firstName: 'Test',
          lastName: 'User2',
          displayName: 'Test User2',
          avatar: null,
          totalXp: 0,
          currentStreak: 0,
          bestStreak: 0,
          lastActivityDate: null,
          password: null,
          isActive: true,
          isVerified: false,
          lastLoginAt: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const mockResult = {
        data: mockUsers,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      };

      MockUserRepository.findMany.mockResolvedValue(mockResult);

      // Act
      const result = await userService.getAllUsers(mockQuery);

      // Assert
      expect(MockUserRepository.findMany).toHaveBeenCalled();
      expect(result).toEqual({
        users: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            email: expect.any(String),
            username: expect.any(String)
          })
        ]),
        total: 2,
        pagination: mockResult.pagination
      });
    });

    it('should handle repository errors', async () => {
      // Arrange
      const mockQuery = { 
        page: 1, 
        limit: 10,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const
      };
      const errorMessage = 'Database connection failed';
      
      MockUserRepository.findMany.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(userService.getAllUsers(mockQuery)).rejects.toThrow(errorMessage);
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = 'user-1';
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User',
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      MockUserRepository.findById.mockResolvedValue(mockUser as any);

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(MockUserRepository.findById).toHaveBeenCalledWith(
        userId,
        expect.any(Object)
      );
      expect(result).toEqual(
        expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          displayName: mockUser.displayName,
          isActive: mockUser.isActive,
          isVerified: mockUser.isVerified
        })
      );
    });

    it('should return null when user not found', async () => {
      // Arrange
      const userId = 'non-existent-id';
      
      MockUserRepository.findById.mockResolvedValue(null);

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create user successfully with hashed password', async () => {
      // Arrange
      const userData = {
        email: 'newuser@test.com',
        firstName: 'New',
        lastName: 'User',
        password: 'plainPassword',
        username: 'newuser'
      };

      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: 'new-user-id',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        displayName: 'New User',
        isActive: true,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      MockUserRepository.findByEmail.mockResolvedValue(null);
      MockUserRepository.findByUsername.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue(hashedPassword as never);
      MockUserRepository.create.mockResolvedValue(createdUser as any);

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith(userData.password, 12);
      expect(MockUserRepository.create).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          id: createdUser.id,
          email: createdUser.email,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          username: createdUser.username,
          displayName: createdUser.displayName,
          isActive: createdUser.isActive,
          isVerified: createdUser.isVerified
        })
      );
    });

    it('should throw error when email already exists', async () => {
      // Arrange
      const userData = {
        email: 'existing@test.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password'
      };

      const existingUser = {
        id: 'existing-user',
        email: userData.email
      };

      MockUserRepository.findByEmail.mockResolvedValue(existingUser as any);

      // Act & Assert
      await expect(userService.createUser(userData)).rejects.toThrow('Email already exists');
      expect(MockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate user with correct credentials', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'correctPassword'
      };

      const mockUser = {
        id: 'user-1',
        email: loginData.email,
        password: 'hashedPassword',
        isActive: true,
        isVerified: true
      };

      MockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      mockBcrypt.compare.mockResolvedValue(true as never);
      MockUserRepository.updateLastLogin.mockResolvedValue(mockUser as any);

      // Act
      const result = await userService.authenticateUser(loginData);

      // Assert
      expect(MockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(MockUserRepository.updateLastLogin).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should return null for incorrect password', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'wrongPassword'
      };

      const mockUser = {
        id: 'user-1',
        email: loginData.email,
        password: 'hashedPassword',
        isActive: true
      };

      MockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      mockBcrypt.compare.mockResolvedValue(false as never);

      // Act
      const result = await userService.authenticateUser(loginData);

      // Assert
      expect(result).toBeNull();
      expect(MockUserRepository.updateLastLogin).not.toHaveBeenCalled();
    });

    it('should return null for non-existent user', async () => {
      // Arrange
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password'
      };

      MockUserRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await userService.authenticateUser(loginData);

      // Assert
      expect(result).toBeNull();
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete existing user', async () => {
      // Arrange
      const userId = 'user-1';
      const mockUser = {
        id: userId,
        email: 'test@example.com'
      };

      MockUserRepository.findById.mockResolvedValue(mockUser as any);
      MockUserRepository.delete.mockResolvedValue(mockUser as any);

      // Act
      const result = await userService.deleteUser(userId);

      // Assert
      expect(MockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(MockUserRepository.delete).toHaveBeenCalledWith(userId);
      expect(result).toBe(true);
    });

    it('should return false for non-existent user', async () => {
      // Arrange
      const userId = 'non-existent-id';

      MockUserRepository.findById.mockResolvedValue(null);

      // Act
      const result = await userService.deleteUser(userId);

      // Assert
      expect(MockUserRepository.delete).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});
