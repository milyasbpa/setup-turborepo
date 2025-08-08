import { Router } from 'express';
import { ProfileController } from './profile.controller';
import { asyncHandler } from '../../core/middleware';

/**
 * Profile Routes
 * /api/profile
 */
const router = Router();

// GET /api/profile - Get user profile with math learning stats
router.get('/', asyncHandler(ProfileController.getUserProfile));

// GET /api/profile/stats - Get detailed user learning statistics
router.get('/stats', asyncHandler(ProfileController.getUserStats));

export default router;
