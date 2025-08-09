/**
 * ProfileService Unit Tests
 * Tests for profile business logic and user stats
 */

// Mock dependencies first
const mockUserRepository = {
  findById: jest.fn(),
};

const mockPrisma = {
  userProgress: {
    count: jest.fn(),
    findMany: jest.fn(),
  },
  lesson: {
    count: jest.fn(),
  },
  submission: {
    findMany: jest.fn(),
  },
};

jest.mock('../../../core/repositories/user.repository', () => ({
  UserRepository: mockUserRepository,
}));

jest.mock('../../../core/database', () => ({
  prisma: mockPrisma,
}));

jest.mock('../../../core/logger/logger.service', () => ({
  LoggerService: {
    logService: jest.fn(),
    error: jest.fn(),
  },
}));

import { ProfileService } from '../profile.service';
import { LoggerService } from '../../../core/logger/logger.service';

const mockLogger = LoggerService as jest.Mocked<typeof LoggerService>;

describe('ProfileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should return complete user profile with learning stats', async () => {
      // Arrange
      const userId = 'user-1';
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        avatar: 'avatar.jpg',
        totalXp: 150,
        currentStreak: 5,
        bestStreak: 8,
        lastActivityDate: new Date('2024-01-15'),
        isVerified: true,
        isActive: true,
        createdAt: new Date('2024-01-01'),
      };

      const completedLessons = 3;
      const totalLessons = 10;

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockPrisma.userProgress.count.mockResolvedValue(completedLessons);
      mockPrisma.lesson.count.mockResolvedValue(totalLessons);

      // Act
      const result = await ProfileService.getUserProfile(userId);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId, {
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          displayName: true,
          avatar: true,
          totalXp: true,
          currentStreak: true,
          bestStreak: true,
          lastActivityDate: true,
          isVerified: true,
          isActive: true,
          createdAt: true,
        },
      });

      expect(mockPrisma.userProgress.count).toHaveBeenCalledWith({
        where: {
          userId,
          isCompleted: true,
        },
      });

      expect(mockPrisma.lesson.count).toHaveBeenCalledWith({
        where: {
          isActive: true,
        },
      });

      expect(result).toEqual({
        id: 'user-1',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        avatar: 'avatar.jpg',
        xp: 150,
        streak: {
          current: 5,
          longest: 8,
          lastActiveDate: '2024-01-15',
        },
        lessonsCompleted: 3,
        totalLessons: 10,
        rank: 'Novice', // 150 XP = Novice rank (needs 200 for Intermediate)
        joinedAt: new Date('2024-01-01'),
      });

      expect(mockLogger.logService).toHaveBeenCalledWith(
        'ProfileService',
        `getUserProfile(${userId})`,
        true
      );
    });

    it('should handle zero progress correctly', async () => {
      // Arrange
      const userId = 'user-2';
      const mockUser = {
        id: 'user-2',
        email: 'newbie@example.com',
        username: null,
        firstName: null,
        lastName: null,
        displayName: null,
        avatar: null,
        totalXp: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastActivityDate: null,
        isVerified: false,
        isActive: true,
        createdAt: new Date('2024-01-10'),
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockPrisma.userProgress.count.mockResolvedValue(0);
      mockPrisma.lesson.count.mockResolvedValue(10);

      // Act
      const result = await ProfileService.getUserProfile(userId);

      // Assert
      expect(result.lessonsCompleted).toBe(0);
      expect(result.totalLessons).toBe(10);
      expect(result.xp).toBe(0);
      expect(result.rank).toBe('Beginner');
    });

    it('should handle case when no lessons exist', async () => {
      // Arrange
      const userId = 'user-3';
      const mockUser = {
        id: 'user-3',
        email: 'user3@example.com',
        username: 'user3',
        firstName: 'Alice',
        lastName: 'Smith',
        displayName: 'Alice Smith',
        avatar: null,
        totalXp: 50,
        currentStreak: 1,
        bestStreak: 1,
        lastActivityDate: new Date(),
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockPrisma.userProgress.count.mockResolvedValue(0);
      mockPrisma.lesson.count.mockResolvedValue(0); // No lessons

      // Act
      const result = await ProfileService.getUserProfile(userId);

      // Assert
      expect(result.lessonsCompleted).toBe(0);
      expect(result.totalLessons).toBe(0);
      expect(result.lessonsCompleted).toBe(0);
    });

    it('should use default userId when not provided', async () => {
      // Arrange
      const defaultUserId = '1';
      const mockUser = {
        id: '1',
        email: 'default@example.com',
        username: 'defaultuser',
        firstName: 'Default',
        lastName: 'User',
        displayName: 'Default User',
        avatar: null,
        totalXp: 25,
        currentStreak: 2,
        bestStreak: 3,
        lastActivityDate: new Date(),
        isVerified: false,
        isActive: true,
        createdAt: new Date(),
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockPrisma.userProgress.count.mockResolvedValue(1);
      mockPrisma.lesson.count.mockResolvedValue(5);

      // Act
      const result = await ProfileService.getUserProfile();

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(defaultUserId, expect.any(Object));
      expect(result.id).toBe('1');
    });

    it('should throw error when user not found', async () => {
      // Arrange
      const userId = 'non-existent';
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(ProfileService.getUserProfile(userId)).rejects.toThrow('User not found');
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to get user profile', {
        error: 'User not found',
        userId,
      });
    });

    it('should handle database errors', async () => {
      // Arrange
      const userId = 'user-1';
      const error = new Error('Database connection failed');
      mockUserRepository.findById.mockRejectedValue(error);

      // Act & Assert
      await expect(ProfileService.getUserProfile(userId)).rejects.toThrow('Database connection failed');
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to get user profile', {
        error: 'Database connection failed',
        userId,
      });
    });
  });

  describe('getUserStats', () => {
    it('should return comprehensive user learning statistics', async () => {
      // Arrange
      const userId = 'user-1';
      const mockUser = {
        id: 'user-1',
        totalXp: 200,
        currentStreak: 7,
        bestStreak: 10,
        lastActivityDate: new Date('2024-01-15'),
      };

      const mockUserProgress = [
        {
          id: 'progress-1',
          userId: 'user-1',
          lessonId: 'lesson-1',
          isCompleted: true,
          bestScore: 85,
          attemptsCount: 2,
          lesson: {
            title: 'Basic Addition',
            xpReward: 10,
          },
        },
        {
          id: 'progress-2',
          userId: 'user-1',
          lessonId: 'lesson-2',
          isCompleted: true,
          bestScore: 90,
          attemptsCount: 1,
          lesson: {
            title: 'Subtraction',
            xpReward: 15,
          },
        },
      ];

      const mockSubmissions = [
        {
          id: 'submission-1',
          userId: 'user-1',
          lessonId: 'lesson-1',
          isCorrect: true,
          xpEarned: 10,
          submittedAt: new Date('2024-01-15'),
        },
        {
          id: 'submission-2',
          userId: 'user-1',
          lessonId: 'lesson-2',
          isCorrect: true,
          xpEarned: 15,
          submittedAt: new Date('2024-01-14'),
        },
      ];

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockPrisma.userProgress.findMany.mockResolvedValue(mockUserProgress);
      mockPrisma.submission.findMany.mockResolvedValue(mockSubmissions);

      // Act
      const result = await ProfileService.getUserStats(userId);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      
      expect(mockPrisma.userProgress.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: {
          lesson: {
            select: {
              title: true,
              xpReward: true,
            },
          },
        },
      });

      expect(mockPrisma.submission.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      expect(result).toEqual({
        profile: {
          totalXp: 200,
          currentStreak: 7,
          bestStreak: 10,
          lastActivityDate: new Date('2024-01-15'),
        },
        progress: {
          completedLessons: 2, // Both progress items are completed
          totalLessons: 2, // Total progress items
          averageScore: 88, // (85 + 90) / 2 = 87.5 rounded to 88
          totalAttempts: 3, // 2 + 1
        },
        recentActivity: [
          {
            id: 'submission-1',
            lessonId: 'lesson-1',
            isCorrect: true,
            xpEarned: 10,
            submittedAt: new Date('2024-01-15'),
          },
          {
            id: 'submission-2',
            lessonId: 'lesson-2',
            isCorrect: true,
            xpEarned: 15,
            submittedAt: new Date('2024-01-14'),
          },
        ],
      });

      expect(mockLogger.logService).toHaveBeenCalledWith(
        'ProfileService',
        `getUserStats(${userId})`,
        true
      );
    });

    it('should handle empty progress and submissions', async () => {
      // Arrange
      const userId = 'user-new';
      const mockUser = {
        id: 'user-new',
        totalXp: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastActivityDate: null,
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockPrisma.userProgress.findMany.mockResolvedValue([]);
      mockPrisma.submission.findMany.mockResolvedValue([]);

      // Act
      const result = await ProfileService.getUserStats(userId);

      // Assert
      expect(result.progress.totalAttempts).toBe(0);
      expect(result.progress.averageScore).toBe(0);
      expect(result.progress.completedLessons).toBe(0);
      expect(result.progress.totalLessons).toBe(0);
      expect(result.recentActivity).toEqual([]);
    });

    it('should use default userId when not provided', async () => {
      // Arrange
      const defaultUserId = '1';
      const mockUser = {
        id: '1',
        totalXp: 100,
        currentStreak: 3,
        bestStreak: 5,
        lastActivityDate: new Date(),
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockPrisma.userProgress.findMany.mockResolvedValue([]);
      mockPrisma.submission.findMany.mockResolvedValue([]);

      // Act
      const result = await ProfileService.getUserStats();

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(defaultUserId);
      expect(result.profile.totalXp).toBe(100);
    });

    it('should throw error when user not found', async () => {
      // Arrange
      const userId = 'non-existent';
      mockUserRepository.findById.mockResolvedValue(null);
      mockPrisma.userProgress.findMany.mockResolvedValue([]);
      mockPrisma.submission.findMany.mockResolvedValue([]);

      // Act & Assert
      await expect(ProfileService.getUserStats(userId)).rejects.toThrow('User not found');
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to get user stats', {
        error: 'User not found',
        userId,
      });
    });

    it('should handle database errors', async () => {
      // Arrange
      const userId = 'user-1';
      const error = new Error('Database error');
      mockUserRepository.findById.mockRejectedValue(error);

      // Act & Assert
      await expect(ProfileService.getUserStats(userId)).rejects.toThrow('Database error');
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to get user stats', {
        error: 'Database error',
        userId,
      });
    });
  });
});
