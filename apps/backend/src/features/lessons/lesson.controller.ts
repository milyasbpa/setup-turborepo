import { Request, Response } from 'express';
import { LessonService } from './lesson.service';
import { LoggerService } from '../../core/logger/logger.service';
import { sendSuccess, sendError } from '../../core/middleware';
import { 
  submitLessonSchema, 
  lessonsQuerySchema, 
  lessonIdSchema 
} from './dtos/lesson.dto';

/**
 * Lesson Controller
 * Handles HTTP requests for lesson management
 */
export class LessonController {
  /**
   * GET /api/lessons
   * Get all lessons with user progress
   */
  static async getAllLessons(req: Request, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const query = lessonsQuerySchema.parse(req.query);
      const userId = query.userId || '1'; // Default to demo user

      const lessons = await LessonService.getAllLessons(userId);

      sendSuccess(res, lessons, 'Lessons retrieved successfully');
    } catch (error) {
      LoggerService.error('Failed to get lessons', {
        error: error instanceof Error ? error.message : 'Unknown error',
        query: req.query,
      });

      if (error instanceof Error && error.message.includes('validation')) {
        sendError(res, 'Invalid query parameters', 400);
      } else {
        sendError(res, 'Failed to retrieve lessons', 500);
      }
    }
  }

  /**
   * GET /api/lessons/:id
   * Get lesson by ID with problems (frontend-safe)
   */
  static async getLessonById(req: Request, res: Response): Promise<void> {
    try {
      // Validate parameters
      const params = lessonIdSchema.parse(req.params);
      const { id } = params;

      const lesson = await LessonService.getLessonById(id);

      if (!lesson) {
        sendError(res, 'Lesson not found', 404);
        return;
      }

      sendSuccess(res, lesson, 'Lesson retrieved successfully');
    } catch (error) {
      LoggerService.error('Failed to get lesson by ID', {
        error: error instanceof Error ? error.message : 'Unknown error',
        lessonId: req.params.id,
      });

      if (error instanceof Error && error.message.includes('validation')) {
        sendError(res, 'Invalid lesson ID', 400);
      } else {
        sendError(res, 'Failed to retrieve lesson', 500);
      }
    }
  }

  /**
   * POST /api/lessons/:id/submit
   * Submit lesson answers with XP and streak calculation
   */
  static async submitLesson(req: Request, res: Response): Promise<void> {
    try {
      // Validate parameters and body
      const params = lessonIdSchema.parse(req.params);
      const submitData = submitLessonSchema.parse(req.body);
      const { id: lessonId } = params;

      // Get userId from query or default to demo user
      const userId = (req.query.userId as string) || '1';

      const result = await LessonService.submitLesson(lessonId, submitData, userId);

      sendSuccess(res, result, 'Lesson submitted successfully');
    } catch (error) {
      LoggerService.error('Failed to submit lesson', {
        error: error instanceof Error ? error.message : 'Unknown error',
        lessonId: req.params.id,
        userId: req.query.userId || '1',
        body: req.body,
      });

      if (error instanceof Error) {
        if (error.message.includes('validation') || error.message.includes('required')) {
          sendError(res, 'Invalid submission data', 400);
        } else if (error.message.includes('not found')) {
          sendError(res, 'Lesson or problem not found', 404);
        } else if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          sendError(res, 'Submission already exists', 409);
        } else {
          sendError(res, 'Failed to submit lesson', 500);
        }
      } else {
        sendError(res, 'Failed to submit lesson', 500);
      }
    }
  }

  /**
   * GET /api/lessons/stats
   * Get lesson statistics
   */
  static async getLessonStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await LessonService.getLessonStats();

      sendSuccess(res, stats, 'Lesson statistics retrieved successfully');
    } catch (error) {
      LoggerService.error('Failed to get lesson stats', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      sendError(res, 'Failed to retrieve lesson statistics', 500);
    }
  }
}
