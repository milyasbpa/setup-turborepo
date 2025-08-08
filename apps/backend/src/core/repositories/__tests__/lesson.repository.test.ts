import { LessonRepository } from '../lesson.repository';
import { prisma } from '../../database';
import { LoggerService } from '../../logger/logger.service';

// Mock Prisma
jest.mock('../../database', () => ({
  prisma: {
    lesson: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  },
}));

// Mock LoggerService
jest.mock('../../logger/logger.service', () => ({
  LoggerService: {
    error: jest.fn(),
  },
}));

const mockPrisma = prisma as any;
const mockLogger = LoggerService as any;

describe('LessonRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllWithProgress', () => {
    const mockLessons = [
      {
        id: '1',
        title: 'Lesson 1',
        isActive: true,
        order: 1,
        userProgress: [
          {
            isCompleted: true,
            score: 85,
            bestScore: 90,
            attemptsCount: 2,
          },
        ],
      },
      {
        id: '2',
        title: 'Lesson 2',
        isActive: true,
        order: 2,
        userProgress: [],
      },
    ];

    it('should return lessons with progress for authenticated user', async () => {
      mockPrisma.lesson.findMany.mockResolvedValue(mockLessons);

      const result = await LessonRepository.findAllWithProgress('user-1');

      expect(mockPrisma.lesson.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
          userProgress: {
            where: { userId: 'user-1' },
            select: {
              isCompleted: true,
              score: true,
              bestScore: true,
              attemptsCount: true,
            },
          },
        },
      });

      expect(result[0].progress).toEqual({
        isCompleted: true,
        score: 85,
        bestScore: 90,
        attemptsCount: 2,
      });
      expect(result[1].progress).toBeUndefined();
    });

    it('should return lessons without progress for anonymous user', async () => {
      const lessonsWithoutProgress = mockLessons.map(lesson => ({
        ...lesson,
        userProgress: undefined,
      }));
      mockPrisma.lesson.findMany.mockResolvedValue(lessonsWithoutProgress);

      const result = await LessonRepository.findAllWithProgress();

      expect(mockPrisma.lesson.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
          userProgress: false,
        },
      });

      expect(result[0].progress).toBeUndefined();
      expect(result[1].progress).toBeUndefined();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockPrisma.lesson.findMany.mockRejectedValue(error);

      await expect(LessonRepository.findAllWithProgress('user-1')).rejects.toThrow(error);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to fetch lessons with progress',
        {
          error: 'Database connection failed',
          userId: 'user-1',
        }
      );
    });
  });

  describe('findByIdWithProblems', () => {
    const mockLessonWithProblems = {
      id: '1',
      title: 'Lesson 1',
      isActive: true,
      problems: [
        {
          id: 'prob-1',
          question: 'What is 2 + 2?',
          problemType: 'MULTIPLE_CHOICE',
          order: 1,
          difficulty: 'EASY',
          correctAnswer: '4',
          explanation: 'Simple addition',
          options: [
            { id: 'opt-1', optionText: '3', order: 1, isCorrect: false },
            { id: 'opt-2', optionText: '4', order: 2, isCorrect: true },
          ],
        },
      ],
    };

    it('should return lesson with problems excluding answers for student', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLessonWithProblems);

      const result = await LessonRepository.findByIdWithProblems('1', false);

      expect(mockPrisma.lesson.findUnique).toHaveBeenCalledWith({
        where: { id: '1', isActive: true },
        include: {
          problems: {
            orderBy: { order: 'asc' },
            include: {
              options: {
                orderBy: { order: 'asc' },
                select: {
                  id: true,
                  optionText: true,
                  order: true,
                  isCorrect: false,
                },
              },
            },
            select: {
              id: true,
              question: true,
              problemType: true,
              order: true,
              difficulty: true,
              correctAnswer: false,
              explanation: false,
              options: true,
            },
          },
        },
      });

      expect(result).toEqual(mockLessonWithProblems);
    });

    it('should return lesson with problems including answers for teacher', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLessonWithProblems);

      const result = await LessonRepository.findByIdWithProblems('1', true);

      expect(mockPrisma.lesson.findUnique).toHaveBeenCalledWith({
        where: { id: '1', isActive: true },
        include: {
          problems: {
            orderBy: { order: 'asc' },
            include: {
              options: {
                orderBy: { order: 'asc' },
                select: {
                  id: true,
                  optionText: true,
                  order: true,
                  isCorrect: true,
                },
              },
            },
            select: {
              id: true,
              question: true,
              problemType: true,
              order: true,
              difficulty: true,
              correctAnswer: true,
              explanation: true,
              options: true,
            },
          },
        },
      });

      expect(result).toEqual(mockLessonWithProblems);
    });

    it('should return null when lesson not found', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(null);

      const result = await LessonRepository.findByIdWithProblems('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockPrisma.lesson.findUnique.mockRejectedValue(error);

      await expect(LessonRepository.findByIdWithProblems('1')).rejects.toThrow(error);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to fetch lesson with problems',
        {
          error: 'Database error',
          lessonId: '1',
        }
      );
    });
  });

  describe('findById', () => {
    const mockLesson = {
      id: '1',
      title: 'Lesson 1',
      isActive: true,
    };

    it('should return lesson by id', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);

      const result = await LessonRepository.findById('1');

      expect(mockPrisma.lesson.findUnique).toHaveBeenCalledWith({
        where: { id: '1', isActive: true },
      });
      expect(result).toEqual(mockLesson);
    });

    it('should return null when lesson not found', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(null);

      const result = await LessonRepository.findById('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle options parameter', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);

      const options = {
        include: { problems: true },
        select: { id: true, title: true },
      };
      await LessonRepository.findById('1', options);

      expect(mockPrisma.lesson.findUnique).toHaveBeenCalledWith({
        where: { id: '1', isActive: true },
        ...options,
      });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockPrisma.lesson.findUnique.mockRejectedValue(error);

      await expect(LessonRepository.findById('1')).rejects.toThrow(error);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to find lesson by ID',
        {
          error: 'Database error',
          lessonId: '1',
        }
      );
    });
  });

  describe('findMany', () => {
    const mockLessons = [
      { id: '1', title: 'Lesson 1', isActive: true, order: 1 },
      { id: '2', title: 'Lesson 2', isActive: true, order: 2 },
    ];

    it('should return all active lessons', async () => {
      mockPrisma.lesson.findMany.mockResolvedValue(mockLessons);

      const result = await LessonRepository.findMany();

      expect(mockPrisma.lesson.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      });
      expect(result).toEqual(mockLessons);
    });

    it('should handle options parameter', async () => {
      mockPrisma.lesson.findMany.mockResolvedValue(mockLessons);

      const options = {
        include: { problems: true },
        select: { id: true, title: true },
      };
      await LessonRepository.findMany(options);

      expect(mockPrisma.lesson.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        ...options,
      });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockPrisma.lesson.findMany.mockRejectedValue(error);

      await expect(LessonRepository.findMany()).rejects.toThrow(error);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to fetch lessons',
        {
          error: 'Database error',
        }
      );
    });
  });

  describe('getStats', () => {
    it('should return lesson statistics', async () => {
      mockPrisma.lesson.count
        .mockResolvedValueOnce(10) // total lessons
        .mockResolvedValueOnce(8); // active lessons

      const result = await LessonRepository.getStats();

      expect(mockPrisma.lesson.count).toHaveBeenCalledTimes(2);
      expect(mockPrisma.lesson.count).toHaveBeenNthCalledWith(1);
      expect(mockPrisma.lesson.count).toHaveBeenNthCalledWith(2, { where: { isActive: true } });
      
      expect(result).toEqual({
        totalLessons: 10,
        activeLessons: 8,
      });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockPrisma.lesson.count.mockRejectedValue(error);

      await expect(LessonRepository.getStats()).rejects.toThrow(error);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to get lesson stats',
        {
          error: 'Database error',
        }
      );
    });
  });
});
