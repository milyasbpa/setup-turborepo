/**
 * SubmissionRepository Unit Tests
 * Tests for submission data access layer with XP and streak logic
 */

// Mock Prisma first
const mockPrisma = {
  $transaction: jest.fn(),
  submission: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  userProgress: {
    upsert: jest.fn(),
  },
};

jest.mock('../../database', () => ({
  prisma: mockPrisma,
}));

jest.mock('../../logger/logger.service', () => ({
  LoggerService: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

import { SubmissionRepository } from '../submission.repository';
import { LoggerService } from '../../logger/logger.service';

const mockLogger = LoggerService as jest.Mocked<typeof LoggerService>;

describe('SubmissionRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('submitAnswers', () => {
    it('should create new submission and calculate XP correctly', async () => {
      // Arrange
      const userId = 'user-1';
      const lessonId = 'lesson-1';
      const answers = [
        { problemId: 'problem-1', answer: '8', isCorrect: true, xpEarned: 10 },
        { problemId: 'problem-2', answer: '5', isCorrect: true, xpEarned: 10 },
        { problemId: 'problem-3', answer: '15', isCorrect: true, xpEarned: 10 },
        { problemId: 'problem-4', answer: '10', isCorrect: false, xpEarned: 10 },
      ];
      const attemptId = 'attempt-123';

      const mockUser = {
        id: 'user-1',
        totalXp: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastActivityDate: null,
      };

      const mockSubmission = {
        id: 'submission-1',
        userId,
        lessonId,
        problemId: 'problem-1',
        userAnswer: JSON.stringify(answers),
        attemptId,
        isCorrect: false, // not all correct
        xpEarned: 30, // 3 correct * 10
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedUser = {
        ...mockUser,
        totalXp: 30,
        currentStreak: 1,
        bestStreak: 1,
        lastActivityDate: new Date(),
      };

      // Mock no existing submission
      mockPrisma.submission.findFirst.mockResolvedValue(null);

      // Mock transaction
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        // Mock user fetch
        mockPrisma.user.findUnique.mockResolvedValue(mockUser);
        
        // Mock submission creation
        mockPrisma.submission.create.mockResolvedValue(mockSubmission);
        
        // Mock user update
        mockPrisma.user.update.mockResolvedValue(updatedUser);
        
        // Mock user progress upsert
        mockPrisma.userProgress.upsert.mockResolvedValue({});

        return await callback(mockPrisma);
      });

      // Act
      const result = await SubmissionRepository.submitAnswers(userId, lessonId, answers, attemptId);

      // Assert
      expect(mockPrisma.submission.findFirst).toHaveBeenCalledWith({
        where: { userId, lessonId, attemptId },
        include: {
          user: {
            select: {
              totalXp: true,
              currentStreak: true,
            },
          },
        },
      });

      expect(mockPrisma.submission.create).toHaveBeenCalledWith({
        data: {
          userId,
          lessonId,
          problemId: 'problem-1',
          userAnswer: JSON.stringify(answers),
          attemptId,
          isCorrect: false, // not all answers correct
          xpEarned: 30, // 3 correct * 10
        },
      });

      expect(result).toEqual({
        submission: mockSubmission,
        xpEarned: 30,
        streakUpdated: true,
        newStreak: 1,
        totalXp: 30,
        lessonCompleted: false,
      });
    });

    it('should return existing submission when attemptId already exists', async () => {
      // Arrange
      const userId = 'user-1';
      const lessonId = 'lesson-1';
      const answers = [{ problemId: 'problem-1', answer: '8', isCorrect: true, xpEarned: 10 }];
      const attemptId = 'attempt-123';

      const existingSubmission = {
        id: 'submission-1',
        userId,
        lessonId,
        attemptId,
        isCorrect: true,
        xpEarned: 10,
        user: {
          totalXp: 50,
          currentStreak: 2,
        },
      };

      mockPrisma.submission.findFirst.mockResolvedValue(existingSubmission);

      // Act
      const result = await SubmissionRepository.submitAnswers(userId, lessonId, answers, attemptId);

      // Assert
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
      expect(result).toEqual({
        submission: existingSubmission,
        xpEarned: 10,
        streakUpdated: false,
        newStreak: 2,
        totalXp: 50,
        lessonCompleted: true,
      });
      expect(mockLogger.info).toHaveBeenCalledWith('Returning existing submission (idempotent)', {
        userId,
        lessonId,
        attemptId,
      });
    });

    it('should update streak when user submits on consecutive day', async () => {
      // Arrange
      const userId = 'user-1';
      const lessonId = 'lesson-1';
      const answers = [{ problemId: 'problem-1', answer: '8', isCorrect: true, xpEarned: 10 }];
      const attemptId = 'attempt-123';

      // User with previous day activity
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const mockUser = {
        id: 'user-1',
        totalXp: 20,
        currentStreak: 3,
        bestStreak: 5,
        lastActivityDate: yesterday,
      };

      const mockSubmission = {
        id: 'submission-1',
        userId,
        lessonId,
        attemptId,
        isCorrect: true,
        xpEarned: 10,
      };

      const updatedUser = {
        ...mockUser,
        totalXp: 30,
        currentStreak: 4, // incremented
        bestStreak: 5,
        lastActivityDate: new Date(),
      };

      mockPrisma.submission.findFirst.mockResolvedValue(null);

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        mockPrisma.user.findUnique.mockResolvedValue(mockUser);
        mockPrisma.submission.create.mockResolvedValue(mockSubmission);
        mockPrisma.user.update.mockResolvedValue(updatedUser);
        mockPrisma.userProgress.upsert.mockResolvedValue({});

        return await callback(mockPrisma);
      });

      // Act
      const result = await SubmissionRepository.submitAnswers(userId, lessonId, answers, attemptId);

      // Assert
      expect(result.streakUpdated).toBe(true);
      expect(result.newStreak).toBe(4);
      expect(result.xpEarned).toBe(10);
    });

    it('should reset streak when user skips a day', async () => {
      // Arrange
      const userId = 'user-1';
      const lessonId = 'lesson-1';
      const answers = [{ problemId: 'problem-1', answer: '8', isCorrect: true, xpEarned: 10 }];
      const attemptId = 'attempt-123';

      // User with activity 3 days ago (skipped yesterday)
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const mockUser = {
        id: 'user-1',
        totalXp: 20,
        currentStreak: 5,
        bestStreak: 8,
        lastActivityDate: threeDaysAgo,
      };

      const mockSubmission = {
        id: 'submission-1',
        userId,
        lessonId,
        attemptId,
        isCorrect: true,
        xpEarned: 10,
      };

      const updatedUser = {
        ...mockUser,
        totalXp: 30,
        currentStreak: 1, // reset to 1
        bestStreak: 8, // unchanged
        lastActivityDate: new Date(),
      };

      mockPrisma.submission.findFirst.mockResolvedValue(null);

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        mockPrisma.user.findUnique.mockResolvedValue(mockUser);
        mockPrisma.submission.create.mockResolvedValue(mockSubmission);
        mockPrisma.user.update.mockResolvedValue(updatedUser);
        mockPrisma.userProgress.upsert.mockResolvedValue({});

        return await callback(mockPrisma);
      });

      // Act
      const result = await SubmissionRepository.submitAnswers(userId, lessonId, answers, attemptId);

      // Assert
      expect(result.streakUpdated).toBe(true);
      expect(result.newStreak).toBe(1); // reset because of missed day
    });

    it('should maintain streak when user submits multiple times same day', async () => {
      // Arrange
      const userId = 'user-1';
      const lessonId = 'lesson-1';
      const answers = [{ problemId: 'problem-1', answer: '8', isCorrect: true, xpEarned: 10 }];
      const attemptId = 'attempt-456';

      // User with activity today
      const today = new Date();
      const mockUser = {
        id: 'user-1',
        totalXp: 20,
        currentStreak: 3,
        bestStreak: 5,
        lastActivityDate: today,
      };

      const mockSubmission = {
        id: 'submission-2',
        userId,
        lessonId,
        attemptId,
        isCorrect: true,
        xpEarned: 10,
      };

      const updatedUser = {
        ...mockUser,
        totalXp: 30,
        currentStreak: 3, // unchanged
        bestStreak: 5,
        lastActivityDate: today,
      };

      mockPrisma.submission.findFirst.mockResolvedValue(null);

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        mockPrisma.user.findUnique.mockResolvedValue(mockUser);
        mockPrisma.submission.create.mockResolvedValue(mockSubmission);
        mockPrisma.user.update.mockResolvedValue(updatedUser);
        mockPrisma.userProgress.upsert.mockResolvedValue({});

        return await callback(mockPrisma);
      });

      // Act
      const result = await SubmissionRepository.submitAnswers(userId, lessonId, answers, attemptId);

      // Assert
      expect(result.streakUpdated).toBe(false);
      expect(result.newStreak).toBe(3); // unchanged
    });

    it('should handle user not found error', async () => {
      // Arrange
      const userId = 'non-existent';
      const lessonId = 'lesson-1';
      const answers = [{ problemId: 'problem-1', answer: '8', isCorrect: true, xpEarned: 10 }];
      const attemptId = 'attempt-123';

      mockPrisma.submission.findFirst.mockResolvedValue(null);

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        mockPrisma.user.findUnique.mockResolvedValue(null);
        return await callback(mockPrisma);
      });

      // Act & Assert
      await expect(
        SubmissionRepository.submitAnswers(userId, lessonId, answers, attemptId)
      ).rejects.toThrow('User not found');
    });

    it('should handle database errors during transaction', async () => {
      // Arrange
      const userId = 'user-1';
      const lessonId = 'lesson-1';
      const answers = [{ problemId: 'problem-1', answer: '8', isCorrect: true, xpEarned: 10 }];
      const attemptId = 'attempt-123';

      const error = new Error('Database transaction failed');
      mockPrisma.submission.findFirst.mockResolvedValue(null);
      mockPrisma.$transaction.mockRejectedValue(error);

      // Act & Assert
      await expect(
        SubmissionRepository.submitAnswers(userId, lessonId, answers, attemptId)
      ).rejects.toThrow('Database transaction failed');

      expect(mockLogger.error).toHaveBeenCalledWith('Failed to process submission', {
        error: 'Database transaction failed',
        userId,
        lessonId,
        attemptId,
      });
    });

    it('should calculate lesson completion correctly', async () => {
      // Arrange - all answers correct
      const userId = 'user-1';
      const lessonId = 'lesson-1';
      const answers = [
        { problemId: 'problem-1', answer: '8', isCorrect: true, xpEarned: 10 },
        { problemId: 'problem-2', answer: '5', isCorrect: true, xpEarned: 10 },
        { problemId: 'problem-3', answer: '15', isCorrect: true, xpEarned: 10 },
      ];
      const attemptId = 'attempt-123';

      const mockUser = {
        id: 'user-1',
        totalXp: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastActivityDate: null,
      };

      const mockSubmission = {
        id: 'submission-1',
        userId,
        lessonId,
        attemptId,
        isCorrect: true, // all correct
        xpEarned: 30,
      };

      mockPrisma.submission.findFirst.mockResolvedValue(null);

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        mockPrisma.user.findUnique.mockResolvedValue(mockUser);
        mockPrisma.submission.create.mockResolvedValue(mockSubmission);
        mockPrisma.user.update.mockResolvedValue({ ...mockUser, totalXp: 30, currentStreak: 1 });
        mockPrisma.userProgress.upsert.mockResolvedValue({});

        return await callback(mockPrisma);
      });

      // Act
      const result = await SubmissionRepository.submitAnswers(userId, lessonId, answers, attemptId);

      // Assert
      expect(result.lessonCompleted).toBe(true);
      expect(result.xpEarned).toBe(30);

      // Verify that user progress was updated with completion
      expect(mockPrisma.userProgress.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: expect.objectContaining({
            isCompleted: true,
            score: 100, // 3/3 = 100%
          }),
          create: expect.objectContaining({
            isCompleted: true,
            score: 100,
          }),
        })
      );
    });
  });

  describe('findUserLessonSubmissions', () => {
    it('should return user submissions for a lesson', async () => {
      // Arrange
      const userId = 'user-1';
      const lessonId = 'lesson-1';
      const mockSubmissions = [
        {
          id: 'submission-1',
          userId,
          lessonId,
          attemptId: 'attempt-1',
          isCorrect: true,
          xpEarned: 10,
          createdAt: new Date('2024-01-02'),
        },
        {
          id: 'submission-2',
          userId,
          lessonId,
          attemptId: 'attempt-2',
          isCorrect: false,
          xpEarned: 5,
          createdAt: new Date('2024-01-01'),
        },
      ];

      mockPrisma.submission.findMany.mockResolvedValue(mockSubmissions);

      // Act
      const result = await SubmissionRepository.findUserLessonSubmissions(userId, lessonId);

      // Assert
      expect(mockPrisma.submission.findMany).toHaveBeenCalledWith({
        where: { userId, lessonId },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockSubmissions);
    });

    it('should handle database errors', async () => {
      // Arrange
      const userId = 'user-1';
      const lessonId = 'lesson-1';
      const error = new Error('Database error');
      mockPrisma.submission.findMany.mockRejectedValue(error);

      // Act & Assert
      await expect(
        SubmissionRepository.findUserLessonSubmissions(userId, lessonId)
      ).rejects.toThrow('Database error');

      expect(mockLogger.error).toHaveBeenCalledWith('Failed to fetch user lesson submissions', {
        error: 'Database error',
        userId,
        lessonId,
      });
    });
  });

  describe('attemptExists', () => {
    it('should return true when attempt exists', async () => {
      // Arrange
      const userId = 'user-1';
      const lessonId = 'lesson-1';
      const attemptId = 'attempt-123';

      const mockSubmission = {
        id: 'submission-1',
        userId,
        lessonId,
        attemptId,
      };

      mockPrisma.submission.findFirst.mockResolvedValue(mockSubmission);

      // Act
      const result = await SubmissionRepository.attemptExists(userId, lessonId, attemptId);

      // Assert
      expect(mockPrisma.submission.findFirst).toHaveBeenCalledWith({
        where: { userId, lessonId, attemptId },
      });
      expect(result).toBe(true);
    });

    it('should return false when attempt does not exist', async () => {
      // Arrange
      const userId = 'user-1';
      const lessonId = 'lesson-1';
      const attemptId = 'attempt-123';

      mockPrisma.submission.findFirst.mockResolvedValue(null);

      // Act
      const result = await SubmissionRepository.attemptExists(userId, lessonId, attemptId);

      // Assert
      expect(result).toBe(false);
    });

    it('should handle database errors', async () => {
      // Arrange
      const userId = 'user-1';
      const lessonId = 'lesson-1';
      const attemptId = 'attempt-123';
      const error = new Error('Database error');
      mockPrisma.submission.findFirst.mockRejectedValue(error);

      // Act & Assert
      await expect(
        SubmissionRepository.attemptExists(userId, lessonId, attemptId)
      ).rejects.toThrow('Database error');

      expect(mockLogger.error).toHaveBeenCalledWith('Failed to check attempt existence', {
        error: 'Database error',
        userId,
        lessonId,
        attemptId,
      });
    });
  });
});
