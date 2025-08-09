import { UserRepository } from '../../core/repositories/user.repository';
import { LoggerService } from '../../core/logger/logger.service';
import { prisma } from '../../core/database';
import { UserProfileDto, calculateRank } from './dtos/profile.dto';

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
        xp: user.totalXp,
        streak: {
          current: user.currentStreak,
          longest: user.bestStreak,
          lastActiveDate: user.lastActivityDate ? user.lastActivityDate.toISOString().split('T')[0] : null,
        },
        lessonsCompleted: completedLessons,
        totalLessons,
        rank: calculateRank(user.totalXp),
        joinedAt: user.createdAt,
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
          take: 10,
        }),
      ]);

      if (!user) {
        throw new Error('User not found');
      }

      // Calculate stats for DTO
      const totalXp = user.totalXp || 0;
      const xpThisWeek = 0; // TODO: implement real calculation
      const xpThisMonth = 0; // TODO: implement real calculation
      const totalLessonsCompleted = userProgress.filter(p => p.isCompleted).length;
      const totalProblemsCompleted = submissions.length; // or another logic if available
      const averageScore = userProgress.length > 0
        ? Math.round(userProgress.reduce((sum, progress) => sum + progress.bestScore, 0) / userProgress.length)
        : 0;
      const streak = {
        current: user.currentStreak || 0,
        longest: user.bestStreak || 0,
        lastActiveDate: user.lastActivityDate ? user.lastActivityDate.toISOString().split('T')[0] : null,
      };
      const timeSpent = {
        totalMinutes: 0, // TODO: implement real calculation
        thisWeekMinutes: 0, // TODO: implement real calculation
        averagePerSession: 0, // TODO: implement real calculation
      };
  const achievements: import('./dtos/profile.dto').AchievementDto[] = [];
  const weeklyProgress: import('./dtos/profile.dto').DailyProgressDto[] = [];

      return {
        totalXp,
        xpThisWeek,
        xpThisMonth,
        totalLessonsCompleted,
        totalProblemsCompleted,
        averageScore,
        streak,
        timeSpent,
        achievements,
        weeklyProgress,
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
