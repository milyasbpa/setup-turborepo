import { Request, Response } from 'express';
import { RecommendationService } from './recommendation.service';
import { LoggerService } from '../../core/logger/logger.service';
import { sendSuccess, sendError } from '../../core/middleware';
import { getRecommendationsSchema } from './dtos/recommendation.dto';

/**
 * @swagger
 * /api/recommendations:
 *   get:
 *     summary: Get adaptive learning path recommendations
 *     description: Generate personalized lesson recommendations based on user's learning patterns and performance
 *     tags: [Recommendations]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID for personalized recommendations (defaults to demo user)
 *         example: "1"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         description: Maximum number of recommendations to return
 *         example: 5
 *     responses:
 *       200:
 *         description: Recommendations generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AdaptiveLearningPath'
 *             example:
 *               success: true
 *               message: "Learning path recommendations generated successfully"
 *               data:
 *                 userId: "1"
 *                 generatedAt: "2025-08-09T10:30:00.000Z"
 *                 learningPattern:
 *                   averageScore: 75.5
 *                   learningSpeed: 1.2
 *                   strugglingAreas: ["hard"]
 *                   strongAreas: ["easy", "medium"]
 *                   preferredDifficulty: "medium"
 *                   consistencyScore: 68
 *                 recommendations:
 *                   - lessonId: "lesson-2"
 *                     title: "Intermediate Algebra"
 *                     description: "Build on basic concepts"
 *                     recommendationReason: "Next in your learning sequence"
 *                     confidenceScore: 85
 *                     estimatedCompletionTime: 20
 *                     difficulty: "medium"
 *                     xpReward: 15
 *                     order: 2
 *                     isUnlocked: true
 *                     prerequisites: ["Basic Arithmetic"]
 *                 nextSuggestedLesson:
 *                   lessonId: "lesson-2"
 *                   title: "Intermediate Algebra"
 *                   description: "Build on basic concepts"
 *                   recommendationReason: "Next in your learning sequence"
 *                   confidenceScore: 85
 *                   estimatedCompletionTime: 20
 *                   difficulty: "medium"
 *                   xpReward: 15
 *                   order: 2
 *                   isUnlocked: true
 *                   prerequisites: ["Basic Arithmetic"]
 *                 personalizedMessage: "Great progress! You're building strong foundations. Based on your progress, we recommend focusing on 'Intermediate Algebra' next."
 *                 learningGoals:
 *                   - "Achieve 85% accuracy consistently"
 *                   - "Focus on strengthening skills in: hard"
 *               timestamp: "2025-08-09T10:30:00.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * Recommendation Controller
 * Handles HTTP requests for adaptive learning recommendations
 */
export class RecommendationController {
  /**
   * GET /api/recommendations
   * Get adaptive learning path recommendations
   */
  static async getRecommendations(req: Request, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const query = getRecommendationsSchema.parse(req.query);
      const { userId, limit } = query;

      const recommendations = await RecommendationService.generateRecommendations(userId, limit);

      sendSuccess(res, recommendations, 'Learning path recommendations generated successfully');
    } catch (error) {
      LoggerService.error('Failed to get recommendations', {
        error: error instanceof Error ? error.message : 'Unknown error',
        query: req.query,
      });

      if (error instanceof Error && error.message.includes('validation')) {
        sendError(res, 'Invalid query parameters', 400);
      } else {
        sendError(res, 'Failed to generate recommendations', 500);
      }
    }
  }
}
