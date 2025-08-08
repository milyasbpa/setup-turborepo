import { Submission, UserProgress, User, Prisma } from '@prisma/client';
import { prisma } from '../../core/database';
import { LoggerService } from '../../core/logger/logger.service';

export interface SubmissionInput {
  userId: string;
  lessonId: string;
  problemId: string;
  answer: string;
  attemptId: string;
  isCorrect: boolean;
  xpEarned: number;
}

export interface SubmissionResult {
  submission: Submission;
  xpEarned: number;
  streakUpdated: boolean;
  newStreak: number;
  totalXp: number;
  lessonCompleted: boolean;
}

/**
 * Submission Repository
 * Handles all database operations for Submission entity and XP logic
 */
export class SubmissionRepository {
  /**
   * Submit answers with XP and streak logic (idempotent)
   */
  static async submitAnswers(
    userId: string,
    lessonId: string,
    answers: Array<{
      problemId: string;
      answer: string;
      isCorrect: boolean;
      xpEarned: number;
    }>,
    attemptId: string
  ): Promise<SubmissionResult> {
    try {
      // Check if this attempt already exists (idempotency)
      const existingSubmission = await prisma.submission.findFirst({
        where: { 
          userId, 
          lessonId, 
          attemptId 
        },
        include: {
          user: {
            select: {
              totalXp: true,
              currentStreak: true,
            }
          }
        }
      });

      if (existingSubmission) {
        LoggerService.info('Returning existing submission (idempotent)', {
          userId,
          lessonId,
          attemptId,
        });

        return {
          submission: existingSubmission,
          xpEarned: existingSubmission.xpEarned,
          streakUpdated: false,
          newStreak: existingSubmission.user.currentStreak,
          totalXp: existingSubmission.user.totalXp,
          lessonCompleted: existingSubmission.isCorrect,
        };
      }

      // Use transaction for atomic updates
      const result = await prisma.$transaction(async (tx) => {
        // Get current user data
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: {
            totalXp: true,
            currentStreak: true,
            bestStreak: true,
            lastActivityDate: true,
          },
        });

        if (!user) {
          throw new Error('User not found');
        }

        // Calculate total XP for this attempt
        const totalXpEarned = answers.reduce((sum, answer) => 
          sum + (answer.isCorrect ? answer.xpEarned : 0), 0
        );

        // Calculate streak logic
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastActivity = user.lastActivityDate 
          ? new Date(user.lastActivityDate.getFullYear(), user.lastActivityDate.getMonth(), user.lastActivityDate.getDate())
          : null;

        let newStreak = user.currentStreak;
        let streakUpdated = false;

        if (!lastActivity) {
          // First activity
          newStreak = 1;
          streakUpdated = true;
        } else {
          const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === 1) {
            // Consecutive day
            newStreak = user.currentStreak + 1;
            streakUpdated = true;
          } else if (daysDiff > 1) {
            // Missed day(s) - reset streak
            newStreak = 1;
            streakUpdated = true;
          }
          // daysDiff === 0 means same day, keep current streak
        }

        const newBestStreak = Math.max(user.bestStreak, newStreak);
        const newTotalXp = user.totalXp + totalXpEarned;

        // Create submission record
        const submission = await tx.submission.create({
          data: {
            userId,
            lessonId,
            problemId: answers[0]?.problemId || '', // For lesson completion tracking
            userAnswer: JSON.stringify(answers), // Store all answers as JSON
            attemptId,
            isCorrect: answers.every(a => a.isCorrect), // All correct = lesson passed
            xpEarned: totalXpEarned,
          },
        });

        // Update user XP and streak
        await tx.user.update({
          where: { id: userId },
          data: {
            totalXp: newTotalXp,
            currentStreak: newStreak,
            bestStreak: newBestStreak,
            lastActivityDate: now,
          },
        });

        // Update or create user progress
        const lessonCompleted = answers.every(a => a.isCorrect);
        const score = Math.round((answers.filter(a => a.isCorrect).length / answers.length) * 100);

        await tx.userProgress.upsert({
          where: {
            userId_lessonId: {
              userId,
              lessonId,
            },
          },
          update: {
            isCompleted: lessonCompleted || undefined, // Only set to true if completed
            score: score,
            bestScore: {
              increment: score > 0 ? Math.max(0, score) : 0,
            },
            attemptsCount: {
              increment: 1,
            },
            totalXpEarned: {
              increment: totalXpEarned,
            },
            lastAttemptAt: now,
          },
          create: {
            userId,
            lessonId,
            isCompleted: lessonCompleted,
            score,
            bestScore: score,
            attemptsCount: 1,
            totalXpEarned: totalXpEarned,
            lastAttemptAt: now,
          },
        });

        return {
          submission,
          xpEarned: totalXpEarned,
          streakUpdated,
          newStreak,
          totalXp: newTotalXp,
          lessonCompleted,
        };
      });

      LoggerService.info('Submission processed successfully', {
        userId,
        lessonId,
        attemptId,
        xpEarned: result.xpEarned,
        newStreak: result.newStreak,
      });

      return result;
    } catch (error) {
      LoggerService.error('Failed to process submission', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        lessonId,
        attemptId,
      });
      throw error;
    }
  }

  /**
   * Get user submissions for a lesson
   */
  static async findUserLessonSubmissions(
    userId: string,
    lessonId: string
  ): Promise<Submission[]> {
    try {
      return await prisma.submission.findMany({
        where: { userId, lessonId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      LoggerService.error('Failed to fetch user lesson submissions', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        lessonId,
      });
      throw error;
    }
  }

  /**
   * Check if attempt already exists
   */
  static async attemptExists(
    userId: string,
    lessonId: string,
    attemptId: string
  ): Promise<boolean> {
    try {
      const submission = await prisma.submission.findFirst({
        where: { userId, lessonId, attemptId },
      });
      return !!submission;
    } catch (error) {
      LoggerService.error('Failed to check attempt existence', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        lessonId,
        attemptId,
      });
      throw error;
    }
  }
}
