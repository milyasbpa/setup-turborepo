import { Lesson, Problem, ProblemOption, Prisma } from '@prisma/client';
import { prisma } from '../../core/database';
import { LoggerService } from '../../core/logger/logger.service';

export interface LessonWithProgress extends Lesson {
  progress?: {
    isCompleted: boolean;
    score: number;
    bestScore: number;
    attemptsCount: number;
  };
}

export interface LessonWithProblems extends Lesson {
  problems: (Problem & {
    options?: ProblemOption[];
  })[];
}

export interface LessonQueryOptions {
  include?: Prisma.LessonInclude;
  select?: Prisma.LessonSelect;
}

/**
 * Lesson Repository
 * Handles all database operations for Lesson entity
 */
export class LessonRepository {
  /**
   * Get all lessons with optional user progress
   */
  static async findAllWithProgress(userId?: string): Promise<LessonWithProgress[]> {
    try {
      const lessons = await prisma.lesson.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
          userProgress: userId ? {
            where: { userId },
            select: {
              isCompleted: true,
              score: true,
              bestScore: true,
              attemptsCount: true,
            },
          } : false,
        },
      });

      return lessons.map(lesson => ({
        ...lesson,
        progress: userId && lesson.userProgress?.[0] ? lesson.userProgress[0] : undefined,
        userProgress: undefined, // Remove the userProgress array from response
      }));
    } catch (error) {
      LoggerService.error('Failed to fetch lessons with progress', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      throw error;
    }
  }

  /**
   * Get lesson by ID with problems (excluding correct answers for frontend)
   */
  static async findByIdWithProblems(
    id: string, 
    includeAnswers: boolean = false
  ): Promise<LessonWithProblems | null> {
    try {
      const lesson = await prisma.lesson.findUnique({
        where: { id, isActive: true },
        include: {
          problems: {
            orderBy: { order: 'asc' },
            include: {
              options: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      });

      // If we don't want to include answers, filter out sensitive data
      if (lesson && !includeAnswers) {
        lesson.problems = lesson.problems.map(problem => ({
          ...problem,
          correctAnswer: null, // Hide correct answer
          explanation: null,   // Hide explanation
          options: problem.options?.map(option => ({
            ...option,
            isCorrect: false, // Hide correct answer indicator
          })),
        }));
      }

      return lesson;
    } catch (error) {
      LoggerService.error('Failed to fetch lesson with problems', {
        error: error instanceof Error ? error.message : 'Unknown error',
        lessonId: id,
      });
      throw error;
    }
  }

  /**
   * Get lesson by ID
   */
  static async findById(id: string, options?: LessonQueryOptions): Promise<Lesson | null> {
    try {
      return await prisma.lesson.findUnique({
        where: { id, isActive: true },
        ...options,
      });
    } catch (error) {
      LoggerService.error('Failed to find lesson by ID', {
        error: error instanceof Error ? error.message : 'Unknown error',
        lessonId: id,
      });
      throw error;
    }
  }

  /**
   * Get all lessons
   */
  static async findMany(options?: LessonQueryOptions): Promise<Lesson[]> {
    try {
      return await prisma.lesson.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        ...options,
      });
    } catch (error) {
      LoggerService.error('Failed to fetch lessons', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get lesson statistics
   */
  static async getStats() {
    try {
      const [totalLessons, activeLessons] = await Promise.all([
        prisma.lesson.count(),
        prisma.lesson.count({ where: { isActive: true } }),
      ]);

      return {
        totalLessons,
        activeLessons,
      };
    } catch (error) {
      LoggerService.error('Failed to get lesson stats', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
}
