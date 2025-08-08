/**
 * LessonService Unit Tests
 * Tests for lesson business logic and submission handling
 */

// Mock dependencies first
const mockLessonRepository = {
  findAllWithProgress: jest.fn(),
  findByIdWithProblems: jest.fn(),
  getStats: jest.fn(),
};

const mockSubmissionRepository = {
  submitAnswers: jest.fn(),
};

const mockTransformers = {
  transformLessonToDto: jest.fn(),
  transformLessonWithProblemsToDto: jest.fn(),
};

jest.mock('../../../core/repositories/lesson.repository', () => ({
  LessonRepository: mockLessonRepository,
}));

jest.mock('../../../core/repositories/submission.repository', () => ({
  SubmissionRepository: mockSubmissionRepository,
}));

jest.mock('../dtos/lesson.dto', () => ({
  ...jest.requireActual('../dtos/lesson.dto'),
  transformLessonToDto: mockTransformers.transformLessonToDto,
  transformLessonWithProblemsToDto: mockTransformers.transformLessonWithProblemsToDto,
}));

// Mock LoggerService
jest.mock('../../../core/logger/logger.service', () => ({
  LoggerService: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    logService: jest.fn(),
  },
}));

import { LessonService } from '../lesson.service';
import { LoggerService } from '../../../core/logger/logger.service';

const mockLogger = LoggerService as jest.Mocked<typeof LoggerService>;

describe('LessonService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLessons', () => {
    it('should return all lessons with user progress', async () => {
      // Arrange
      const userId = 'user-1';
      const mockLessons = [
        {
          id: 'lesson-1',
          title: 'Basic Addition',
          description: 'Learn addition',
          progress: { isCompleted: true, score: 85 },
        },
        {
          id: 'lesson-2',
          title: 'Subtraction',
          description: 'Learn subtraction',
          progress: { isCompleted: false, score: 0 },
        },
      ];

      const mockTransformedLessons = [
        {
          id: 'lesson-1',
          title: 'Basic Addition',
          description: 'Learn addition',
          isCompleted: true,
          score: 85,
        },
        {
          id: 'lesson-2',
          title: 'Subtraction',
          description: 'Learn subtraction',
          isCompleted: false,
          score: 0,
        },
      ];

      mockLessonRepository.findAllWithProgress.mockResolvedValue(mockLessons);
      mockTransformers.transformLessonToDto
        .mockReturnValueOnce(mockTransformedLessons[0])
        .mockReturnValueOnce(mockTransformedLessons[1]);

      // Act
      const result = await LessonService.getAllLessons(userId);

      // Assert
      expect(mockLessonRepository.findAllWithProgress).toHaveBeenCalledWith(userId);
      expect(mockTransformers.transformLessonToDto).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockTransformedLessons);
      expect(mockLogger.logService).toHaveBeenCalledWith(
        'LessonService',
        `getAllLessons(${userId})`,
        true
      );
    });

    it('should use default userId when not provided', async () => {
      // Arrange
      const defaultUserId = '1';
      const mockLessons: any[] = [];
      mockLessonRepository.findAllWithProgress.mockResolvedValue(mockLessons);

      // Act
      await LessonService.getAllLessons();

      // Assert
      expect(mockLessonRepository.findAllWithProgress).toHaveBeenCalledWith(defaultUserId);
    });

    it('should handle database errors', async () => {
      // Arrange
      const userId = 'user-1';
      const error = new Error('Database error');
      mockLessonRepository.findAllWithProgress.mockRejectedValue(error);

      // Act & Assert
      await expect(LessonService.getAllLessons(userId)).rejects.toThrow('Database error');
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to get all lessons', {
        error: 'Database error',
        userId,
      });
    });
  });

  describe('getLessonById', () => {
    it('should return lesson with problems (without correct answers)', async () => {
      // Arrange
      const lessonId = 'lesson-1';
      const mockLesson = {
        id: 'lesson-1',
        title: 'Basic Addition',
        problems: [
          {
            id: 'problem-1',
            question: 'What is 2 + 2?',
            options: [
              { id: 'opt-1', optionText: '3' },
              { id: 'opt-2', optionText: '4' },
            ],
          },
        ],
      };

      const mockTransformedLesson = {
        id: 'lesson-1',
        title: 'Basic Addition',
        problems: [
          {
            id: 'problem-1',
            question: 'What is 2 + 2?',
            options: ['3', '4'],
          },
        ],
      };

      mockLessonRepository.findByIdWithProblems.mockResolvedValue(mockLesson);
      mockTransformers.transformLessonWithProblemsToDto.mockReturnValue(mockTransformedLesson);

      // Act
      const result = await LessonService.getLessonById(lessonId);

      // Assert
      expect(mockLessonRepository.findByIdWithProblems).toHaveBeenCalledWith(lessonId, false);
      expect(mockTransformers.transformLessonWithProblemsToDto).toHaveBeenCalledWith(mockLesson);
      expect(result).toEqual(mockTransformedLesson);
      expect(mockLogger.logService).toHaveBeenCalledWith(
        'LessonService',
        `getLessonById(${lessonId})`,
        true
      );
    });

    it('should return null when lesson not found', async () => {
      // Arrange
      const lessonId = 'non-existent';
      mockLessonRepository.findByIdWithProblems.mockResolvedValue(null);

      // Act
      const result = await LessonService.getLessonById(lessonId);

      // Assert
      expect(result).toBeNull();
      expect(mockTransformers.transformLessonWithProblemsToDto).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      // Arrange
      const lessonId = 'lesson-1';
      const error = new Error('Database error');
      mockLessonRepository.findByIdWithProblems.mockRejectedValue(error);

      // Act & Assert
      await expect(LessonService.getLessonById(lessonId)).rejects.toThrow('Database error');
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to get lesson by ID', {
        error: 'Database error',
        lessonId,
      });
    });
  });

  describe('submitLesson', () => {
    it('should successfully submit lesson answers and calculate XP', async () => {
      // Arrange
      const lessonId = 'lesson-1';
      const userId = 'user-1';
      const submitData = {
        attemptId: 'attempt-123',
        answers: [
          { problemId: 'problem-1', answer: '4' },
          { problemId: 'problem-2', answer: '6' },
        ],
      };

      const mockLesson = {
        id: 'lesson-1',
        title: 'Basic Addition',
        problems: [
          {
            id: 'problem-1',
            question: 'What is 2 + 2?',
            problemType: 'multiple_choice',
            correctAnswer: '4',
            options: [
              { id: 'opt-1', optionText: '3', isCorrect: false },
              { id: 'opt-2', optionText: '4', isCorrect: true },
            ],
          },
          {
            id: 'problem-2',
            question: 'What is 3 + 3?',
            problemType: 'input',
            correctAnswer: '6',
            options: [],
          },
        ],
      };

      const mockSubmissionResult = {
        submission: { id: 'submission-1' },
        xpEarned: 20,
        streakUpdated: true,
        newStreak: 3,
        bestStreak: 3,
        totalXp: 120,
        lessonCompleted: true,
        score: 100,
        bestScore: 100,
      };

      mockLessonRepository.findByIdWithProblems.mockResolvedValue(mockLesson);
      mockSubmissionRepository.submitAnswers.mockResolvedValue(mockSubmissionResult);

      // Act
      const result = await LessonService.submitLesson(lessonId, submitData, userId);

      // Assert
      expect(mockLessonRepository.findByIdWithProblems).toHaveBeenCalledWith(lessonId, true);
      
      expect(mockSubmissionRepository.submitAnswers).toHaveBeenCalledWith(
        userId,
        lessonId,
        [
          { problemId: 'problem-1', answer: '4', isCorrect: true, xpEarned: 10 },
          { problemId: 'problem-2', answer: '6', isCorrect: true, xpEarned: 10 },
        ],
        'attempt-123'
      );

      expect(result).toEqual({
        success: true,
        xpEarned: 20,
        totalXp: 120,
        streak: {
          current: 3,
          best: 3, // Updated to match mock
          updated: true,
        },
        lesson: {
          completed: true,
          score: 100, // Updated to match mock
          bestScore: 100, // Updated to match mock
        },
        results: [
          {
            problemId: 'problem-1',
            userAnswer: '4',
            isCorrect: true,
            correctAnswer: '4',
            explanation: '',
            xpEarned: 10,
          },
          {
            problemId: 'problem-2',
            userAnswer: '6',
            isCorrect: true,
            correctAnswer: '6',
            explanation: '',
            xpEarned: 10,
          },
        ],
      });

      expect(mockLogger.logService).toHaveBeenCalledWith(
        'LessonService',
        `submitLesson(${lessonId}, ${submitData.attemptId})`,
        true
      );
    });

    it('should handle incorrect answers', async () => {
      // Arrange
      const lessonId = 'lesson-1';
      const userId = 'user-1';
      const submitData = {
        attemptId: 'attempt-456',
        answers: [
          { problemId: 'problem-1', answer: '3' }, // wrong answer
        ],
      };

      const mockLesson = {
        id: 'lesson-1',
        title: 'Basic Addition',
        problems: [
          {
            id: 'problem-1',
            question: 'What is 2 + 2?',
            problemType: 'multiple_choice',
            correctAnswer: '4',
            options: [
              { id: 'opt-1', optionText: '3', isCorrect: false },
              { id: 'opt-2', optionText: '4', isCorrect: true },
            ],
          },
        ],
      };

      const mockSubmissionResult = {
        submission: { id: 'submission-2' },
        xpEarned: 0,
        streakUpdated: false,
        newStreak: 2,
        totalXp: 100,
        lessonCompleted: false,
      };

      mockLessonRepository.findByIdWithProblems.mockResolvedValue(mockLesson);
      mockSubmissionRepository.submitAnswers.mockResolvedValue(mockSubmissionResult);

      // Act
      const result = await LessonService.submitLesson(lessonId, submitData, userId);

      // Assert
      expect(result.results[0]).toEqual({
        problemId: 'problem-1',
        userAnswer: '3',
        isCorrect: false,
        correctAnswer: '4',
        explanation: '',
        xpEarned: 0,
      });
      expect(result.xpEarned).toBe(0);
      expect(result.lesson.completed).toBe(false);
    });

    it('should handle input type problems with case-insensitive comparison', async () => {
      // Arrange
      const lessonId = 'lesson-1';
      const userId = 'user-1';
      const submitData = {
        attemptId: 'attempt-789',
        answers: [
          { problemId: 'problem-1', answer: ' SIX ' }, // with spaces and different case
        ],
      };

      const mockLesson = {
        id: 'lesson-1',
        title: 'Number Words',
        problems: [
          {
            id: 'problem-1',
            question: 'What is 3 + 3 in words?',
            problemType: 'input',
            correctAnswer: 'six',
            options: [],
          },
        ],
      };

      const mockSubmissionResult = {
        submission: { id: 'submission-3' },
        xpEarned: 10,
        streakUpdated: true,
        newStreak: 1,
        totalXp: 110,
        lessonCompleted: true,
      };

      mockLessonRepository.findByIdWithProblems.mockResolvedValue(mockLesson);
      mockSubmissionRepository.submitAnswers.mockResolvedValue(mockSubmissionResult);

      // Act
      const result = await LessonService.submitLesson(lessonId, submitData, userId);

      // Assert
      expect(result.results[0].isCorrect).toBe(true);
      expect(result.xpEarned).toBe(10);
    });

    it('should throw error when lesson not found', async () => {
      // Arrange
      const lessonId = 'non-existent';
      const submitData = { attemptId: 'attempt-123', answers: [] };
      mockLessonRepository.findByIdWithProblems.mockResolvedValue(null);

      // Act & Assert
      await expect(LessonService.submitLesson(lessonId, submitData, 'user-1')).rejects.toThrow('Lesson not found');
    });

    it('should throw error when not all problems are answered', async () => {
      // Arrange
      const lessonId = 'lesson-1';
      const submitData = {
        attemptId: 'attempt-123',
        answers: [
          { problemId: 'problem-1', answer: '4' },
          // missing problem-2
        ],
      };

      const mockLesson = {
        id: 'lesson-1',
        problems: [
          { id: 'problem-1', question: 'Q1' },
          { id: 'problem-2', question: 'Q2' },
        ],
      };

      mockLessonRepository.findByIdWithProblems.mockResolvedValue(mockLesson);

      // Act & Assert
      await expect(LessonService.submitLesson(lessonId, submitData, 'user-1')).rejects.toThrow('Answer required for problem: problem-2');
    });

    it('should use default userId when not provided', async () => {
      // Arrange
      const lessonId = 'lesson-1';
      const submitData = {
        attemptId: 'attempt-123',
        answers: [{ problemId: 'problem-1', answer: '4' }],
      };

      const mockLesson = {
        id: 'lesson-1',
        problems: [
          {
            id: 'problem-1',
            problemType: 'input',
            correctAnswer: '4',
            options: [],
          },
        ],
      };

      const mockSubmissionResult = {
        submission: { id: 'submission-1' },
        xpEarned: 10,
        streakUpdated: true,
        newStreak: 1,
        totalXp: 10,
        lessonCompleted: true,
      };

      mockLessonRepository.findByIdWithProblems.mockResolvedValue(mockLesson);
      mockSubmissionRepository.submitAnswers.mockResolvedValue(mockSubmissionResult);

      // Act
      const result = await LessonService.submitLesson(lessonId, submitData);

      // Assert
      expect(mockSubmissionRepository.submitAnswers).toHaveBeenCalledWith(
        '1', // default userId
        lessonId,
        expect.any(Array),
        'attempt-123'
      );
    });

    it('should handle database errors during submission', async () => {
      // Arrange
      const lessonId = 'lesson-1';
      const submitData = { attemptId: 'attempt-123', answers: [] };
      const error = new Error('Database error');
      mockLessonRepository.findByIdWithProblems.mockRejectedValue(error);

      // Act & Assert
      await expect(LessonService.submitLesson(lessonId, submitData, 'user-1')).rejects.toThrow('Database error');
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to submit lesson', {
        error: 'Database error',
        lessonId,
        attemptId: 'attempt-123',
        userId: 'user-1',
      });
    });
  });

  describe('getLessonStats', () => {
    it('should return lesson statistics', async () => {
      // Arrange
      const mockStats = {
        totalLessons: 15,
        activeLessons: 12,
      };

      mockLessonRepository.getStats.mockResolvedValue(mockStats);

      // Act
      const result = await LessonService.getLessonStats();

      // Assert
      expect(mockLessonRepository.getStats).toHaveBeenCalled();
      expect(result).toEqual(mockStats);
      expect(mockLogger.logService).toHaveBeenCalledWith(
        'LessonService',
        'getLessonStats',
        true
      );
    });

    it('should handle database errors', async () => {
      // Arrange
      const error = new Error('Database error');
      mockLessonRepository.getStats.mockRejectedValue(error);

      // Act & Assert
      await expect(LessonService.getLessonStats()).rejects.toThrow('Database error');
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to get lesson stats', {
        error: 'Database error',
      });
    });
  });
});
