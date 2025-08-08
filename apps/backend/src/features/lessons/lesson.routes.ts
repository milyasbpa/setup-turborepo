import { Router } from 'express';
import { LessonController } from './lesson.controller';
import { asyncHandler } from '../../core/middleware';

/**
 * Lesson Routes
 * /api/lessons
 */
const router = Router();

// GET /api/lessons/stats - Get lesson statistics (must be before /:id route)
router.get('/stats', asyncHandler(LessonController.getLessonStats));

// GET /api/lessons - Get all lessons with user progress
router.get('/', asyncHandler(LessonController.getAllLessons));

// GET /api/lessons/:id - Get lesson by ID with problems
router.get('/:id', asyncHandler(LessonController.getLessonById));

// POST /api/lessons/:id/submit - Submit lesson answers
router.post('/:id/submit', asyncHandler(LessonController.submitLesson));

export default router;
