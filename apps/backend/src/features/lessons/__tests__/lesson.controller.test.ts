import request from 'supertest';
import express from 'express';
import { LessonController } from '../lesson.controller';
import { LessonService } from '../lesson.service';
import { LoggerService } from '../../../core/logger/logger.service';
import { LessonDto, LessonWithProblemsDto, SubmitLessonResponseDto } from '../dtos/lesson.dto';

// Mock LessonService
jest.mock('../lesson.service', () => ({
  LessonService: {
    getAllLessons: jest.fn(),
    getLessonById: jest.fn(),
    submitLesson: jest.fn(),
    getLessonStats: jest.fn(),
  },
}));

// Mock LoggerService
jest.mock('../../../core/logger/logger.service', () => ({
  LoggerService: {
    error: jest.fn(),
  },
}));

// Mock middleware functions
jest.mock('../../../core/middleware', () => ({
  sendSuccess: jest.fn((res, data, message) => 
    res.status(200).json({ success: true, data, message })
  ),
  sendError: jest.fn((res, error, status) => 
    res.status(status || 500).json({ success: false, error })
  ),
}));

// Mock lesson DTO schemas
jest.mock('../dtos/lesson.dto', () => ({
  submitLessonSchema: {
    parse: jest.fn(data => data),
  },
  lessonsQuerySchema: {
    parse: jest.fn(data => data),
  },
  lessonIdSchema: {
    parse: jest.fn(data => data),
  },
}));

const app = express();
app.use(express.json());

// Simple middleware to simulate req.validated
app.use((req, res, next) => {
  req.validated = {
    query: { userId: req.query.userId || '1' },
    params: { id: req.params.id },
    body: req.body
  };
  next();
});

// Mount controller routes
app.get('/lessons', LessonController.getAllLessons);
app.get('/lessons/stats', LessonController.getLessonStats);
app.get('/lessons/:id', LessonController.getLessonById);
app.post('/lessons/:id/submit', LessonController.submitLesson);

const mockLessonService = LessonService as jest.Mocked<typeof LessonService>;
const mockLoggerService = LoggerService as jest.Mocked<typeof LoggerService>;

describe('LessonController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /lessons', () => {
    it('should return all lessons with default user ID', async () => {
      const mockLessons: LessonDto[] = [
        {
          id: 'lesson-1',
          title: 'Basic Addition',
          description: 'Learn basic addition',
          order: 1,
          xpReward: 20,
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          progress: { isCompleted: false, score: 0, bestScore: 0, attemptsCount: 0 },
        },
        {
          id: 'lesson-2',
          title: 'Subtraction',
          description: 'Learn subtraction',
          order: 2,
          xpReward: 25,
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          progress: { isCompleted: true, score: 85, bestScore: 85, attemptsCount: 1 },
        },
      ];

      mockLessonService.getAllLessons.mockResolvedValue(mockLessons);

      const response = await request(app)
        .get('/lessons')
        .expect(200);

      expect(mockLessonService.getAllLessons).toHaveBeenCalledWith('1');
      expect(response.body.success).toBe(true);
      // Convert dates to strings for comparison as Express serializes them
      const expectedLessons = mockLessons.map(lesson => ({
        ...lesson,
        createdAt: lesson.createdAt.toISOString(),
        updatedAt: lesson.updatedAt.toISOString()
      }));
      expect(response.body.data).toEqual(expectedLessons);
      expect(response.body.message).toBe('Lessons retrieved successfully');
    });

    it('should return lessons for specified user ID', async () => {
      const mockLessons: LessonDto[] = [
        {
          id: 'lesson-1',
          title: 'Basic Addition',
          description: 'Learn basic addition',
          order: 1,
          xpReward: 20,
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          progress: { isCompleted: true, score: 95, bestScore: 95, attemptsCount: 1 },
        },
      ];

      mockLessonService.getAllLessons.mockResolvedValue(mockLessons);

      const response = await request(app)
        .get('/lessons')
        .query({ userId: 'user-123' })
        .expect(200);

      expect(mockLessonService.getAllLessons).toHaveBeenCalledWith('user-123');
      const expectedLessons = mockLessons.map(lesson => ({
        ...lesson,
        createdAt: lesson.createdAt.toISOString(),
        updatedAt: lesson.updatedAt.toISOString()
      }));
      expect(response.body.data).toEqual(expectedLessons);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database connection failed');
      mockLessonService.getAllLessons.mockRejectedValue(error);

      await request(app)
        .get('/lessons')
        .expect(500);

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        'Failed to get lessons',
        {
          error: 'Database connection failed',
          query: {},
        }
      );
    });
  });

  describe('GET /lessons/stats', () => {
    it('should return lesson statistics', async () => {
      const mockStats = {
        totalLessons: 10,
        activeLessons: 8,
        completedLessons: 5,
      };

      mockLessonService.getLessonStats.mockResolvedValue(mockStats);

      const response = await request(app)
        .get('/lessons/stats')
        .expect(200);

      expect(mockLessonService.getLessonStats).toHaveBeenCalled();
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockStats);
      expect(response.body.message).toBe('Lesson statistics retrieved successfully');
    });

    it('should handle service errors', async () => {
      const error = new Error('Stats calculation failed');
      mockLessonService.getLessonStats.mockRejectedValue(error);

      await request(app)
        .get('/lessons/stats')
        .expect(500);

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        'Failed to get lesson stats',
        {
          error: 'Stats calculation failed',
        }
      );
    });
  });

  describe('GET /lessons/:id', () => {
    it('should return lesson by ID', async () => {
      const mockLesson: LessonWithProblemsDto = {
        id: 'lesson-1',
        title: 'Basic Addition',
        description: 'Learn basic addition',
        order: 1,
        xpReward: 20,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        problems: [
          {
            id: 'problem-1',
            question: 'What is 2 + 2?',
            problemType: 'multiple_choice',
            order: 1,
            difficulty: 'easy',
            options: [
              { id: 'opt-1', optionText: '3', order: 1 },
              { id: 'opt-2', optionText: '4', order: 2 },
            ],
          },
        ],
      };

      mockLessonService.getLessonById.mockResolvedValue(mockLesson);

      const response = await request(app)
        .get('/lessons/lesson-1')
        .expect(200);

      expect(mockLessonService.getLessonById).toHaveBeenCalledWith('lesson-1');
      expect(response.body.success).toBe(true);
      const expectedLesson = {
        ...mockLesson,
        createdAt: mockLesson.createdAt.toISOString(),
        updatedAt: mockLesson.updatedAt.toISOString()
      };
      expect(response.body.data).toEqual(expectedLesson);
      expect(response.body.message).toBe('Lesson retrieved successfully');
    });

    it('should handle lesson not found', async () => {
      mockLessonService.getLessonById.mockResolvedValue(null);

      await request(app)
        .get('/lessons/nonexistent')
        .expect(404);

      expect(mockLessonService.getLessonById).toHaveBeenCalledWith('nonexistent');
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      mockLessonService.getLessonById.mockRejectedValue(error);

      await request(app)
        .get('/lessons/lesson-1')
        .expect(500);

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        'Failed to get lesson by ID',
        {
          error: 'Database error',
          lessonId: 'lesson-1',
        }
      );
    });
  });

  describe('POST /lessons/:id/submit', () => {
    it('should submit lesson answers successfully', async () => {
      const submitData = {
        answers: [
          { problemId: 'problem-1', answer: '4' },
          { problemId: 'problem-2', answer: '6' },
        ],
        attemptId: 'attempt-123',
      };

      const mockSubmissionResult: SubmitLessonResponseDto = {
        success: true,
        xpEarned: 20,
        totalXp: 120,
        streak: { current: 3, best: 5, updated: true },
        lesson: { completed: true, score: 100, bestScore: 100 },
        results: [
          {
            problemId: 'problem-1',
            userAnswer: '4',
            isCorrect: true,
            correctAnswer: '4',
            explanation: 'Simple addition',
            xpEarned: 10,
          },
          {
            problemId: 'problem-2',
            userAnswer: '6',
            isCorrect: true,
            correctAnswer: '6',
            explanation: 'Simple addition',
            xpEarned: 10,
          },
        ],
      };

      mockLessonService.submitLesson.mockResolvedValue(mockSubmissionResult);

      const response = await request(app)
        .post('/lessons/lesson-1/submit')
        .send(submitData)
        .expect(200);

      expect(mockLessonService.submitLesson).toHaveBeenCalledWith(
        'lesson-1',
        submitData,
        '1'
      );
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockSubmissionResult);
      expect(response.body.message).toBe('Lesson submitted successfully');
    });

    it('should submit lesson with specified user ID', async () => {
      const submitData = {
        answers: [{ problemId: 'problem-1', answer: '4' }],
        attemptId: 'attempt-123',
      };

      const mockResult: SubmitLessonResponseDto = {
        success: true,
        xpEarned: 10,
        totalXp: 110,
        streak: { current: 2, best: 3, updated: false },
        lesson: { completed: true, score: 100, bestScore: 100 },
        results: [
          {
            problemId: 'problem-1',
            userAnswer: '4',
            isCorrect: true,
            correctAnswer: '4',
            explanation: 'Correct',
            xpEarned: 10,
          },
        ],
      };
      mockLessonService.submitLesson.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/lessons/lesson-1/submit')
        .query({ userId: 'user-456' })
        .send(submitData)
        .expect(200);

      expect(mockLessonService.submitLesson).toHaveBeenCalledWith(
        'lesson-1',
        submitData,
        'user-456'
      );
    });

    it('should handle validation errors', async () => {
      // Mock validation error by having service reject with validation error
      mockLessonService.submitLesson.mockRejectedValue(new Error('Validation failed'));

      const invalidData = { invalid: 'data' };

      const response = await request(app)
        .post('/lessons/lesson-1/submit')
        .send(invalidData)
        .expect(500);

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        'Failed to submit lesson',
        expect.objectContaining({
          error: 'Validation failed',
          lessonId: 'lesson-1',
          userId: '1'
        })
      );
    });

    it('should handle service errors during submission', async () => {
      const submitData = {
        answers: [{ problemId: 'problem-1', answer: '4' }],
        attemptId: 'attempt-123',
      };

      const error = new Error('Submission processing failed');
      mockLessonService.submitLesson.mockRejectedValue(error);

      await request(app)
        .post('/lessons/lesson-1/submit')
        .send(submitData)
        .expect(500);

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        'Failed to submit lesson',
        {
          error: 'Submission processing failed',
          lessonId: 'lesson-1',
          userId: '1',
          body: submitData,
        }
      );
    });

    it('should handle lesson not found during submission', async () => {
      const submitData = {
        answers: [{ problemId: 'problem-1', answer: '4' }],
        attemptId: 'attempt-123',
      };

      const error = new Error('Lesson not found');
      mockLessonService.submitLesson.mockRejectedValue(error);

      await request(app)
        .post('/lessons/nonexistent/submit')
        .send(submitData)
        .expect(404);

      expect(mockLessonService.submitLesson).toHaveBeenCalledWith(
        'nonexistent',
        submitData,
        '1'
      );
    });
  });
});
