import { UserRepository } from '../../core/repositories/user.repository';
import { LoggerService } from '../../core/logger/logger.service';
import { prisma } from '../../core/database';

export interface UserProfileDto {
  id: string;
  email: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  avatar: string | null;
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: Date | null;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
}

/**
 * Profile Service
 * Business logic for user profile and stats
 */
export class ProfileService {
  /**
   * Get user profile with math learning stats
   */
  static async getUserProfile(userId: string = '1'): Promise<UserProfileDto> {
    LoggerService.logService('ProfileService', `getUserProfile(${userId})`, true);
    
    try {
      // Get user data
      const user = await UserRepository.findById(userId, {
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          displayName: true,
          avatar: true,
          totalXp: true,
          currentStreak: true,
          bestStreak: true,
          lastActivityDate: true,
          isVerified: true,
          isActive: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get lesson completion stats
      const [completedLessons, totalLessons] = await Promise.all([
        prisma.userProgress.count({
          where: {
            userId,
            isCompleted: true,
          },
        }),
        prisma.lesson.count({
          where: {
            isActive: true,
          },
        }),
      ]);

      // Calculate progress percentage
      const progressPercentage = totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100) 
        : 0;

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        avatar: user.avatar,
        totalXp: user.totalXp,
        currentStreak: user.currentStreak,
        bestStreak: user.bestStreak,
        lastActivityDate: user.lastActivityDate,
        progressPercentage,
        completedLessons,
        totalLessons,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
      };
    } catch (error) {
      LoggerService.error('Failed to get user profile', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      throw error;
    }
  }

  /**
   * Get user learning statistics
   */
  static async getUserStats(userId: string = '1') {
    LoggerService.logService('ProfileService', `getUserStats(${userId})`, true);
    
    try {
      const [user, userProgress, submissions] = await Promise.all([
        UserRepository.findById(userId),
        prisma.userProgress.findMany({
          where: { userId },
          include: {
            lesson: {
              select: {
                title: true,
                xpReward: true,
              },
            },
          },
        }),
        prisma.submission.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 10, // Last 10 submissions
        }),
      ]);

      if (!user) {
        throw new Error('User not found');
      }

      // Calculate additional stats
      const totalAttempts = userProgress.reduce((sum, progress) => sum + progress.attemptsCount, 0);
      const averageScore = userProgress.length > 0 
        ? Math.round(userProgress.reduce((sum, progress) => sum + progress.bestScore, 0) / userProgress.length)
        : 0;

      return {
        profile: {
          totalXp: user.totalXp,
          currentStreak: user.currentStreak,
          bestStreak: user.bestStreak,
          lastActivityDate: user.lastActivityDate,
        },
        progress: {
          completedLessons: userProgress.filter(p => p.isCompleted).length,
          totalLessons: userProgress.length,
          averageScore,
          totalAttempts,
        },
        recentActivity: submissions.map(submission => ({
          id: submission.id,
          lessonId: submission.lessonId,
          isCorrect: submission.isCorrect,
          xpEarned: submission.xpEarned,
          submittedAt: submission.submittedAt,
        })),
      };
    } catch (error) {
      LoggerService.error('Failed to get user stats', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      throw error;
    }
  }
}
