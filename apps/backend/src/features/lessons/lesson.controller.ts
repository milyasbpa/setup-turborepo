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
 * @swagger
 * /api/lessons:
 *   get:
 *     summary: Get all lessons
 *     description: Retrieve all math lessons with user progress and completion status
 *     tags: [Lessons]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID to get personalized progress (defaults to demo user)
 *         example: "1"
 *     responses:
 *       200:
 *         description: Lessons retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonListResponse'
 *             example:
 *               success: true
 *               message: "Lessons retrieved successfully"
 *               data:
 *                 - id: "lesson-1"
 *                   title: "Basic Arithmetic"
 *                   description: "Learn addition and subtraction"
 *                   order: 1
 *                   xpReward: 10
 *                   isActive: true
 *                   progress:
 *                     isCompleted: false
 *                     score: 0
 *                     bestScore: 0
 *                     attemptsCount: 0
 *               timestamp: "2025-08-08T01:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 * /api/lessons/stats:
 *   get:
 *     summary: Get lesson statistics
 *     description: Retrieve overall lesson statistics and metrics
 *     tags: [Lessons]
 *     responses:
 *       200:
 *         description: Lesson statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalLessons:
 *                           type: integer
 *                           example: 3
 *                         activeLessons:
 *                           type: integer
 *                           example: 3
 *                         averageCompletion:
 *                           type: number
 *                           example: 65.5
 *             example:
 *               success: true
 *               message: "Lesson statistics retrieved successfully"
 *               data:
 *                 totalLessons: 3
 *                 activeLessons: 3
 *                 averageCompletion: 65.5
 *               timestamp: "2025-08-08T01:00:00.000Z"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 * /api/lessons/{id}:
 *   get:
 *     summary: Get lesson by ID
 *     description: Retrieve a specific lesson with all its problems (frontend-safe, excludes correct answers)
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *         example: "lesson-1"
 *     responses:
 *       200:
 *         description: Lesson retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonResponse'
 *             example:
 *               success: true
 *               message: "Lesson retrieved successfully"
 *               data:
 *                 id: "lesson-1"
 *                 title: "Basic Arithmetic"
 *                 description: "Learn addition and subtraction"
 *                 order: 1
 *                 xpReward: 10
 *                 isActive: true
 *                 problems:
 *                   - id: "problem-1-1"
 *                     question: "What is 5 + 3?"
 *                     problemType: "multiple_choice"
 *                     order: 1
 *                     difficulty: "easy"
 *                     options:
 *                       - id: "option-1-1-a"
 *                         optionText: "7"
 *                         order: 1
 *                       - id: "option-1-1-b"
 *                         optionText: "8"
 *                         order: 2
 *               timestamp: "2025-08-08T01:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   post:
 *     summary: Submit lesson answers
 *     description: Submit answers for a lesson and get results with XP and streak calculation (idempotent)
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *         example: "lesson-1"
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID (defaults to demo user)
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitLessonRequest'
 *           example:
 *             attemptId: "attempt-123-456"
 *             answers:
 *               - problemId: "problem-1-1"
 *                 answer: "8"
 *               - problemId: "problem-1-2"
 *                 answer: "15"
 *     responses:
 *       200:
 *         description: Lesson submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubmitLessonResponseWrapper'
 *             example:
 *               success: true
 *               message: "Lesson submitted successfully"
 *               data:
 *                 success: true
 *                 xpEarned: 40
 *                 totalXp: 120
 *                 streak:
 *                   current: 3
 *                   best: 7
 *                   updated: true
 *                 lesson:
 *                   completed: true
 *                   score: 85
 *                   bestScore: 95
 *                 results:
 *                   - problemId: "problem-1-1"
 *                     userAnswer: "8"
 *                     isCorrect: true
 *                     correctAnswer: "8"
 *                     explanation: "5 + 3 = 8"
 *                     xpEarned: 10
 *               timestamp: "2025-08-08T01:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Submission already exists (idempotent operation)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

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
