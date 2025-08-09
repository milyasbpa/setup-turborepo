import { Router } from 'express';
import { RecommendationController } from './recommendation.controller';
import { asyncHandler } from '../../core/middleware';

/**
 * Recommendation Routes
 * /api/recommendations
 */
const router = Router();

// GET /api/recommendations - Get adaptive learning path recommendations
router.get('/', asyncHandler(RecommendationController.getRecommendations));

export default router;
