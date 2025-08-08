import { Request, Response } from 'express';
import { ProfileService } from './profile.service';
import { LoggerService } from '../../core/logger/logger.service';
import { sendSuccess, sendError } from '../../core/middleware';

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve user profile with math learning stats, XP, streak, and progress
 *     tags: [Profile]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID to get profile for (defaults to demo user)
 *         example: "1"
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *             example:
 *               success: true
 *               message: "User profile retrieved successfully"
 *               data:
 *                 id: "1"
 *                 email: "demo@mathapp.com"
 *                 username: "mathlearner"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 displayName: "John D."
 *                 avatar: "https://example.com/avatar.jpg"
 *                 xp: 250
 *                 streak:
 *                   current: 7
 *                   longest: 15
 *                   lastActiveDate: "2025-08-08"
 *                 lessonsCompleted: 5
 *                 totalLessons: 10
 *                 rank: "Intermediate"
 *                 joinedAt: "2025-07-01T00:00:00.000Z"
 *               timestamp: "2025-08-08T01:00:00.000Z"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 * /api/profile/stats:
 *   get:
 *     summary: Get user learning statistics
 *     description: Retrieve detailed user learning statistics including XP, time spent, achievements, and weekly progress
 *     tags: [Profile]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID to get stats for (defaults to demo user)
 *         example: "1"
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStatsResponse'
 *             example:
 *               success: true
 *               message: "User statistics retrieved successfully"
 *               data:
 *                 totalXp: 420
 *                 xpThisWeek: 80
 *                 xpThisMonth: 250
 *                 totalLessonsCompleted: 8
 *                 totalProblemsCompleted: 45
 *                 averageScore: 87.5
 *                 streak:
 *                   current: 7
 *                   longest: 15
 *                   lastActiveDate: "2025-08-08"
 *                 timeSpent:
 *                   totalMinutes: 240
 *                   thisWeekMinutes: 60
 *                   averagePerSession: 8.5
 *                 achievements:
 *                   - id: "first_lesson"
 *                     title: "First Steps"
 *                     description: "Complete your first lesson"
 *                     iconUrl: "https://example.com/badge.png"
 *                     unlockedAt: "2025-07-15T10:30:00.000Z"
 *                 weeklyProgress:
 *                   - date: "2025-08-08"
 *                     xpEarned: 25
 *                     lessonsCompleted: 2
 *                     timeSpent: 15
 *               timestamp: "2025-08-08T01:00:00.000Z"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * Profile Controller
 * Handles HTTP requests for user profile and stats
 */
export class ProfileController {
  /**
   * GET /api/profile
   * Get user profile with math learning stats
   */
  static async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      // Get userId from query or default to demo user
      const userId = (req.query.userId as string) || '1';

      const profile = await ProfileService.getUserProfile(userId);

      sendSuccess(res, profile, 'User profile retrieved successfully');
    } catch (error) {
      LoggerService.error('Failed to get user profile', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.query.userId || '1',
      });

      if (error instanceof Error && error.message.includes('not found')) {
        sendError(res, 'User not found', 404);
      } else {
        sendError(res, 'Failed to retrieve user profile', 500);
      }
    }
  }

  /**
   * GET /api/profile/stats
   * Get detailed user learning statistics
   */
  static async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      // Get userId from query or default to demo user
      const userId = (req.query.userId as string) || '1';

      const stats = await ProfileService.getUserStats(userId);

      sendSuccess(res, stats, 'User statistics retrieved successfully');
    } catch (error) {
      LoggerService.error('Failed to get user stats', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.query.userId || '1',
      });

      if (error instanceof Error && error.message.includes('not found')) {
        sendError(res, 'User not found', 404);
      } else {
        sendError(res, 'Failed to retrieve user statistics', 500);
      }
    }
  }
}
