import { z } from 'zod';

/**
 * Learning Recommendation DTOs
 * Data Transfer Objects for adaptive learning path recommendations
 */

// Learning Pattern Analysis
export interface LearningPattern {
  averageScore: number;
  learningSpeed: number; // problems per minute
  strugglingAreas: string[]; // difficulty levels or topics
  strongAreas: string[];
  preferredDifficulty: 'easy' | 'medium' | 'hard';
  consistencyScore: number; // 0-100, how consistent the learner is
}

// Individual Lesson Recommendation
export interface LessonRecommendation {
  lessonId: string;
  title: string;
  description: string;
  recommendationReason: string;
  confidenceScore: number; // 0-100, how confident we are in this recommendation
  estimatedCompletionTime: number; // in minutes
  difficulty: string;
  xpReward: number;
  order: number;
  isUnlocked: boolean;
  prerequisites: string[];
}

// Adaptive Learning Path Response
export interface AdaptiveLearningPathDto {
  userId: string;
  generatedAt: string;
  learningPattern: LearningPattern;
  recommendations: LessonRecommendation[];
  nextSuggestedLesson: LessonRecommendation | null;
  personalizedMessage: string;
  learningGoals: string[];
}

// Query schema for getting recommendations
export const getRecommendationsSchema = z.object({
  userId: z.string().optional().default('1'),
  limit: z.coerce.number().min(1).max(10).optional().default(5),
});

export type GetRecommendationsQuery = z.infer<typeof getRecommendationsSchema>;

// Learning Analytics for recommendations
export interface LearningAnalytics {
  totalLessonsCompleted: number;
  totalProblemsAttempted: number;
  totalCorrectAnswers: number;
  averageAccuracy: number;
  totalTimeSpent: number; // in minutes
  streakData: {
    current: number;
    best: number;
    consistency: number; // how often they maintain streaks
  };
  performanceByDifficulty: {
    easy: { attempted: number; correct: number; avgTime: number };
    medium: { attempted: number; correct: number; avgTime: number };
    hard: { attempted: number; correct: number; avgTime: number };
  };
  recentActivity: {
    lastActive: string;
    activeDaysInWeek: number;
    sessionsThisWeek: number;
  };
}

// Recommendation Weights (for fine-tuning algorithm)
export interface RecommendationWeights {
  performanceWeight: number;
  difficultyPreferenceWeight: number;
  timeAvailabilityWeight: number;
  streakMaintenanceWeight: number;
  noveltyWeight: number; // preference for new topics vs reinforcement
}

/**
 * Transform functions for DTOs
 */
export function createLearningPattern(analytics: LearningAnalytics): LearningPattern {
  const { performanceByDifficulty } = analytics;
  
  // Determine struggling and strong areas
  const difficultyAccuracy = {
    easy: performanceByDifficulty.easy.attempted > 0 
      ? performanceByDifficulty.easy.correct / performanceByDifficulty.easy.attempted 
      : 0,
    medium: performanceByDifficulty.medium.attempted > 0 
      ? performanceByDifficulty.medium.correct / performanceByDifficulty.medium.attempted 
      : 0,
    hard: performanceByDifficulty.hard.attempted > 0 
      ? performanceByDifficulty.hard.correct / performanceByDifficulty.hard.attempted 
      : 0,
  };

  const strugglingAreas: string[] = [];
  const strongAreas: string[] = [];

  Object.entries(difficultyAccuracy).forEach(([difficulty, accuracy]) => {
    if (accuracy < 0.6) strugglingAreas.push(difficulty);
    if (accuracy > 0.8) strongAreas.push(difficulty);
  });

  // Determine preferred difficulty
  let preferredDifficulty: 'easy' | 'medium' | 'hard' = 'easy';
  const maxAccuracy = Math.max(difficultyAccuracy.easy, difficultyAccuracy.medium, difficultyAccuracy.hard);
  if (maxAccuracy === difficultyAccuracy.hard && difficultyAccuracy.hard > 0.7) {
    preferredDifficulty = 'hard';
  } else if (maxAccuracy === difficultyAccuracy.medium && difficultyAccuracy.medium > 0.7) {
    preferredDifficulty = 'medium';
  }

  // Calculate learning speed (problems per minute)
  const totalProblems = analytics.totalProblemsAttempted;
  const totalTimeMinutes = analytics.totalTimeSpent;
  const learningSpeed = totalTimeMinutes > 0 ? totalProblems / totalTimeMinutes : 0;

  // Calculate consistency score based on streak data and activity
  const consistencyScore = Math.min(100, 
    (analytics.streakData.consistency * 40) + 
    (analytics.recentActivity.activeDaysInWeek * 10) + 
    (analytics.averageAccuracy * 50)
  );

  return {
    averageScore: analytics.averageAccuracy * 100,
    learningSpeed,
    strugglingAreas,
    strongAreas,
    preferredDifficulty,
    consistencyScore,
  };
}

export function createPersonalizedMessage(
  pattern: LearningPattern, 
  nextLesson: LessonRecommendation | null
): string {
  const messages: string[] = [];

  // Performance-based messages
  if (pattern.averageScore >= 90) {
    messages.push("Excellent work! You're mastering the concepts brilliantly.");
  } else if (pattern.averageScore >= 75) {
    messages.push("Great progress! You're building strong foundations.");
  } else if (pattern.averageScore >= 60) {
    messages.push("Good effort! Keep practicing to strengthen your skills.");
  } else {
    messages.push("Don't worry! Every expert was once a beginner. Let's build up gradually.");
  }

  // Learning speed feedback
  if (pattern.learningSpeed > 2) {
    messages.push("You're learning at an impressive pace!");
  } else if (pattern.learningSpeed < 0.5) {
    messages.push("Take your time to understand each concept thoroughly.");
  }

  // Consistency feedback
  if (pattern.consistencyScore >= 80) {
    messages.push("Your consistent practice is paying off!");
  } else if (pattern.consistencyScore < 50) {
    messages.push("Try to practice a little bit each day for better results.");
  }

  // Next lesson recommendation
  if (nextLesson) {
    messages.push(`Based on your progress, we recommend focusing on '${nextLesson.title}' next.`);
    messages.push(nextLesson.recommendationReason);
  }

  return messages.join(' ');
}
