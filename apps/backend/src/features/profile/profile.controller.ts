import { Request, Response } from 'express';
import { ProfileService } from './profile.service';
import { LoggerService } from '../../core/logger/logger.service';
import { sendSuccess, sendError } from '../../core/middleware';

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
