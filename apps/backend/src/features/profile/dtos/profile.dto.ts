import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - username
 *         - firstName
 *         - lastName
 *         - displayName
 *         - avatar
 *         - xp
 *         - streak
 *         - lessonsCompleted
 *         - totalLessons
 *         - rank
 *         - joinedAt
 *       properties:
 *         id:
 *           type: string
 *           example: "1"
 *           description: Unique user identifier
 *         email:
 *           type: string
 *           format: email
 *           example: "demo@mathapp.com"
 *           description: User's email address
 *         username:
 *           type: string
 *           nullable: true
 *           example: "mathlearner"
 *           description: User's username
 *         firstName:
 *           type: string
 *           nullable: true
 *           example: "John"
 *           description: User's first name
 *         lastName:
 *           type: string
 *           nullable: true
 *           example: "Doe"
 *           description: User's last name
 *         displayName:
 *           type: string
 *           nullable: true
 *           example: "John D."
 *           description: User's display name
 *         avatar:
 *           type: string
 *           nullable: true
 *           example: "https://example.com/avatar.jpg"
 *           description: User's avatar URL
 *         xp:
 *           type: integer
 *           minimum: 0
 *           example: 250
 *           description: User's total experience points
 *         streak:
 *           $ref: '#/components/schemas/UserStreak'
 *         lessonsCompleted:
 *           type: integer
 *           minimum: 0
 *           example: 5
 *           description: Number of completed lessons
 *         totalLessons:
 *           type: integer
 *           minimum: 0
 *           example: 10
 *           description: Total number of available lessons
 *         rank:
 *           type: string
 *           example: "Beginner"
 *           description: User's current rank based on XP
 *         joinedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-07-01T00:00:00.000Z"
 *           description: Date when user joined
 *
 *     UserStreak:
 *       type: object
 *       required:
 *         - current
 *         - longest
 *         - lastActiveDate
 *       properties:
 *         current:
 *           type: integer
 *           minimum: 0
 *           example: 7
 *           description: Current daily learning streak
 *         longest:
 *           type: integer
 *           minimum: 0
 *           example: 15
 *           description: Longest streak ever achieved
 *         lastActiveDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: "2025-08-08"
 *           description: Last date user was active
 *
 *     UserStats:
 *       type: object
 *       required:
 *         - totalXp
 *         - xpThisWeek
 *         - xpThisMonth
 *         - totalLessonsCompleted
 *         - totalProblemsCompleted
 *         - averageScore
 *         - streak
 *         - timeSpent
 *         - achievements
 *         - weeklyProgress
 *       properties:
 *         totalXp:
 *           type: integer
 *           minimum: 0
 *           example: 420
 *           description: Total experience points earned
 *         xpThisWeek:
 *           type: integer
 *           minimum: 0
 *           example: 80
 *           description: XP earned this week
 *         xpThisMonth:
 *           type: integer
 *           minimum: 0
 *           example: 250
 *           description: XP earned this month
 *         totalLessonsCompleted:
 *           type: integer
 *           minimum: 0
 *           example: 8
 *           description: Total lessons completed
 *         totalProblemsCompleted:
 *           type: integer
 *           minimum: 0
 *           example: 45
 *           description: Total problems solved
 *         averageScore:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 87.5
 *           description: Average score across all lessons
 *         streak:
 *           $ref: '#/components/schemas/UserStreak'
 *         timeSpent:
 *           $ref: '#/components/schemas/TimeSpent'
 *         achievements:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Achievement'
 *           description: List of user achievements
 *         weeklyProgress:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DailyProgress'
 *           description: Progress for each day of the current week
 *
 *     TimeSpent:
 *       type: object
 *       required:
 *         - totalMinutes
 *         - thisWeekMinutes
 *         - averagePerSession
 *       properties:
 *         totalMinutes:
 *           type: integer
 *           minimum: 0
 *           example: 240
 *           description: Total time spent learning (minutes)
 *         thisWeekMinutes:
 *           type: integer
 *           minimum: 0
 *           example: 60
 *           description: Time spent this week (minutes)
 *         averagePerSession:
 *           type: number
 *           minimum: 0
 *           example: 8.5
 *           description: Average time per learning session (minutes)
 *
 *     Achievement:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *         - iconUrl
 *         - unlockedAt
 *       properties:
 *         id:
 *           type: string
 *           example: "first_lesson"
 *           description: Achievement identifier
 *         title:
 *           type: string
 *           example: "First Steps"
 *           description: Achievement title
 *         description:
 *           type: string
 *           example: "Complete your first lesson"
 *           description: Achievement description
 *         iconUrl:
 *           type: string
 *           example: "https://example.com/badge.png"
 *           description: Achievement icon URL
 *         unlockedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-07-15T10:30:00.000Z"
 *           description: When achievement was unlocked
 *
 *     DailyProgress:
 *       type: object
 *       required:
 *         - date
 *         - xpEarned
 *         - lessonsCompleted
 *         - timeSpent
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-08-08"
 *           description: Date of progress
 *         xpEarned:
 *           type: integer
 *           minimum: 0
 *           example: 25
 *           description: XP earned on this date
 *         lessonsCompleted:
 *           type: integer
 *           minimum: 0
 *           example: 2
 *           description: Lessons completed on this date
 *         timeSpent:
 *           type: integer
 *           minimum: 0
 *           example: 15
 *           description: Time spent learning (minutes)
 *
 *     UserProfileResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/UserProfile'
 *
 *     UserStatsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/UserStats'
 */

/**
 * Profile DTOs and Interfaces
 */

// User Profile DTO
export interface UserProfileDto {
  id: string;
  email: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  avatar: string | null;
  xp: number;
  streak: UserStreakDto;
  lessonsCompleted: number;
  totalLessons: number;
  rank: string;
  joinedAt: Date;
}

// User Streak DTO
export interface UserStreakDto {
  current: number;
  longest: number;
  lastActiveDate: string | null;
}

// User Statistics DTO
export interface UserStatsDto {
  totalXp: number;
  xpThisWeek: number;
  xpThisMonth: number;
  totalLessonsCompleted: number;
  totalProblemsCompleted: number;
  averageScore: number;
  streak: UserStreakDto;
  timeSpent: TimeSpentDto;
  achievements: AchievementDto[];
  weeklyProgress: DailyProgressDto[];
}

// Time Spent DTO
export interface TimeSpentDto {
  totalMinutes: number;
  thisWeekMinutes: number;
  averagePerSession: number;
}

// Achievement DTO
export interface AchievementDto {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  unlockedAt: Date;
}

// Daily Progress DTO
export interface DailyProgressDto {
  date: string;
  xpEarned: number;
  lessonsCompleted: number;
  timeSpent: number;
}

/**
 * Validation Schemas
 */

// Profile query parameters
export const profileQuerySchema = z.object({
  userId: z.string().optional(),
});

// Profile ID parameter validation
export const profileIdSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

/**
 * Transform functions
 */

// Transform user data to profile DTO
export const transformUserProfileToDto = (user: any, stats: any): UserProfileDto => ({
  id: user.id,
  email: user.email,
  username: user.username,
  firstName: user.firstName,
  lastName: user.lastName,
  displayName: user.displayName,
  avatar: user.avatar,
  xp: stats.totalXp || 0,
  streak: {
    current: stats.currentStreak || 0,
    longest: stats.longestStreak || 0,
    lastActiveDate: stats.lastActiveDate || null,
  },
  lessonsCompleted: stats.lessonsCompleted || 0,
  totalLessons: stats.totalLessons || 0,
  rank: calculateRank(stats.totalXp || 0),
  joinedAt: user.createdAt,
});

// Transform user data to stats DTO
export const transformUserStatsToDto = (stats: any): UserStatsDto => ({
  totalXp: stats.totalXp || 0,
  xpThisWeek: stats.xpThisWeek || 0,
  xpThisMonth: stats.xpThisMonth || 0,
  totalLessonsCompleted: stats.totalLessonsCompleted || 0,
  totalProblemsCompleted: stats.totalProblemsCompleted || 0,
  averageScore: stats.averageScore || 0,
  streak: {
    current: stats.currentStreak || 0,
    longest: stats.longestStreak || 0,
    lastActiveDate: stats.lastActiveDate || null,
  },
  timeSpent: {
    totalMinutes: stats.totalTimeSpent || 0,
    thisWeekMinutes: stats.thisWeekTimeSpent || 0,
    averagePerSession: stats.averageSessionTime || 0,
  },
  achievements: stats.achievements || [],
  weeklyProgress: stats.weeklyProgress || [],
});

// Calculate user rank based on XP
export const calculateRank = (xp: number): string => {
  if (xp >= 1000) return 'Expert';
  if (xp >= 500) return 'Advanced';
  if (xp >= 200) return 'Intermediate';
  if (xp >= 50) return 'Novice';
  return 'Beginner';
};
