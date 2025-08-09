import { LessonRepository } from '../../core/repositories/lesson.repository';
import { SubmissionRepository } from '../../core/repositories/submission.repository';
import { LoggerService } from '../../core/logger/logger.service';
import {
  AdaptiveLearningPathDto,
  LearningPattern,
  LearningAnalytics,
  LessonRecommendation,
  RecommendationWeights,
  createLearningPattern,
  createPersonalizedMessage,
} from './dtos/recommendation.dto';

/**
 * Recommendation Service
 * Provides adaptive learning path recommendations based on user performance and learning patterns
 */
export class RecommendationService {
  // Default recommendation weights (can be fine-tuned based on data)
  private static readonly DEFAULT_WEIGHTS: RecommendationWeights = {
    performanceWeight: 0.3,
    difficultyPreferenceWeight: 0.25,
    timeAvailabilityWeight: 0.15,
    streakMaintenanceWeight: 0.15,
    noveltyWeight: 0.15,
  };

  /**
   * Generate adaptive learning path recommendations for a user
   */
  static async generateRecommendations(
    userId: string = '1',
    limit: number = 5
  ): Promise<AdaptiveLearningPathDto> {
    LoggerService.logService('RecommendationService', `generateRecommendations(${userId})`, true);

    try {
      // 1. Analyze user's learning patterns
      const analytics = await this.analyzeLearningPatterns(userId);
      const learningPattern = createLearningPattern(analytics);

      // 2. Get all available lessons
      const allLessons = await LessonRepository.findAllWithProgress(userId);
      
      // 3. Generate recommendations based on learning pattern
      const recommendations = await this.calculateRecommendations(
        allLessons,
        learningPattern,
        analytics,
        limit
      );

      // 4. Determine next suggested lesson
      const nextSuggestedLesson = recommendations.length > 0 ? recommendations[0] : null;

      // 5. Generate personalized message
      const personalizedMessage = createPersonalizedMessage(learningPattern, nextSuggestedLesson);

      // 6. Create learning goals based on pattern
      const learningGoals = this.generateLearningGoals(learningPattern, analytics);

      const result: AdaptiveLearningPathDto = {
        userId,
        generatedAt: new Date().toISOString(),
        learningPattern,
        recommendations,
        nextSuggestedLesson,
        personalizedMessage,
        learningGoals,
      };

      LoggerService.info('Learning path recommendations generated', {
        userId,
        recommendationsCount: recommendations.length,
        nextLesson: nextSuggestedLesson?.lessonId,
        averageScore: learningPattern.averageScore,
      });

      return result;
    } catch (error) {
      LoggerService.error('Failed to generate recommendations', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      throw error;
    }
  }

  /**
   * Analyze user's historical learning patterns
   */
  private static async analyzeLearningPatterns(userId: string): Promise<LearningAnalytics> {
    try {
      // Get user's submission history
      const submissions = await SubmissionRepository.getUserSubmissions(userId);
      const userProgress = await LessonRepository.getUserProgress(userId);

      if (!submissions || submissions.length === 0) {
        // Return default analytics for new users
        return this.getDefaultAnalytics();
      }

      // Calculate basic metrics
      const totalProblemsAttempted = submissions.length;
      const totalCorrectAnswers = submissions.filter(s => s.isCorrect).length;
      const averageAccuracy = totalCorrectAnswers / totalProblemsAttempted;
      const totalXpEarned = submissions.reduce((sum, s) => sum + s.xpEarned, 0);

      // Calculate time-based metrics
      const totalTimeSpent = submissions.reduce((sum, s) => sum + (s.timeSpent || 30), 0) / 60; // convert to minutes
      
      // Group by difficulty for analysis
      const performanceByDifficulty = {
        easy: { attempted: 0, correct: 0, avgTime: 0 },
        medium: { attempted: 0, correct: 0, avgTime: 0 },
        hard: { attempted: 0, correct: 0, avgTime: 0 },
      };

      // This would require joining with problems table to get difficulty
      // For now, we'll estimate based on lesson order and performance
      submissions.forEach(submission => {
        const difficulty = this.estimateDifficulty(submission.lessonId, submission.isCorrect);
        performanceByDifficulty[difficulty].attempted++;
        if (submission.isCorrect) {
          performanceByDifficulty[difficulty].correct++;
        }
        performanceByDifficulty[difficulty].avgTime += (submission.timeSpent || 30) / 60;
      });

      // Calculate average times
      Object.keys(performanceByDifficulty).forEach(key => {
        const diff = performanceByDifficulty[key as keyof typeof performanceByDifficulty];
        if (diff.attempted > 0) {
          diff.avgTime = diff.avgTime / diff.attempted;
        }
      });

      // Calculate recent activity
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentSubmissions = submissions.filter(s => 
        new Date(s.submittedAt) >= oneWeekAgo
      );

      const uniqueDaysThisWeek = new Set(
        recentSubmissions.map(s => new Date(s.submittedAt).toDateString())
      ).size;

      const analytics: LearningAnalytics = {
        totalLessonsCompleted: userProgress.filter(p => p.isCompleted).length,
        totalProblemsAttempted,
        totalCorrectAnswers,
        averageAccuracy,
        totalTimeSpent,
        streakData: {
          current: 5, // This would come from user table
          best: 10,   // This would come from user table
          consistency: Math.min(100, uniqueDaysThisWeek * 20), // Rough estimate
        },
        performanceByDifficulty,
        recentActivity: {
          lastActive: submissions.length > 0 
            ? submissions[submissions.length - 1].submittedAt.toISOString()
            : now.toISOString(),
          activeDaysInWeek: uniqueDaysThisWeek,
          sessionsThisWeek: recentSubmissions.length,
        },
      };

      return analytics;
    } catch (error) {
      LoggerService.error('Failed to analyze learning patterns', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      return this.getDefaultAnalytics();
    }
  }

  /**
   * Calculate lesson recommendations based on learning pattern
   */
  private static async calculateRecommendations(
    allLessons: any[],
    pattern: LearningPattern,
    analytics: LearningAnalytics,
    limit: number
  ): Promise<LessonRecommendation[]> {
    const recommendations: LessonRecommendation[] = [];

    for (const lesson of allLessons) {
      const progress = lesson.progress;

      // Skip completed lessons unless they need reinforcement
      if (progress?.isCompleted && progress.score >= 90) {
        continue;
      }

      // Calculate recommendation score
      const score = this.calculateRecommendationScore(lesson, pattern, analytics, progress);
      
      // Determine recommendation reason
      const reason = this.getRecommendationReason(lesson, pattern, progress);

      // Estimate completion time based on user's learning speed and lesson complexity
      const estimatedTime = this.estimateCompletionTime(lesson, pattern);

      // Check if lesson is unlocked (basic prerequisite logic)
      const isUnlocked = this.isLessonUnlocked(lesson, allLessons);

      const recommendation: LessonRecommendation = {
        lessonId: lesson.id,
        title: lesson.title,
        description: lesson.description || '',
        recommendationReason: reason,
        confidenceScore: Math.round(score),
        estimatedCompletionTime: estimatedTime,
        difficulty: this.getLessonDifficulty(lesson),
        xpReward: lesson.xpReward || 10,
        order: lesson.order,
        isUnlocked,
        prerequisites: this.getLessonPrerequisites(lesson, allLessons),
      };

      recommendations.push(recommendation);
    }

    // Sort by recommendation score and return top recommendations
    return recommendations
      .sort((a, b) => b.confidenceScore - a.confidenceScore)
      .slice(0, limit);
  }

  /**
   * Calculate recommendation score for a lesson
   */
  private static calculateRecommendationScore(
    lesson: any,
    pattern: LearningPattern,
    analytics: LearningAnalytics,
    progress: any
  ): number {
    let score = 50; // Base score

    // Performance-based scoring
    if (pattern.averageScore >= 85) {
      // High performer - suggest challenging content
      if (this.getLessonDifficulty(lesson) === 'hard') score += 30;
      else if (this.getLessonDifficulty(lesson) === 'medium') score += 15;
    } else if (pattern.averageScore < 60) {
      // Struggling learner - suggest easier content
      if (this.getLessonDifficulty(lesson) === 'easy') score += 30;
      else if (this.getLessonDifficulty(lesson) === 'medium') score += 10;
      else score -= 20;
    }

    // Difficulty preference alignment
    if (this.getLessonDifficulty(lesson) === pattern.preferredDifficulty) {
      score += 25;
    }

    // Progress-based scoring
    if (progress) {
      if (progress.isCompleted && progress.score < 80) {
        // Needs reinforcement
        score += 20;
      } else if (progress.attemptsCount > 0 && !progress.isCompleted) {
        // In progress - prioritize
        score += 35;
      }
    } else {
      // New lesson - good for variety
      score += 15;
    }

    // Sequential learning bonus
    if (lesson.order === this.getNextSequentialLesson(analytics)) {
      score += 20;
    }

    // Consistency bonus for regular learners
    if (pattern.consistencyScore > 70) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate learning goals based on pattern analysis
   */
  private static generateLearningGoals(
    pattern: LearningPattern,
    analytics: LearningAnalytics
  ): string[] {
    const goals: string[] = [];

    // Performance-based goals
    if (pattern.averageScore < 70) {
      goals.push('Improve accuracy to 70% or higher');
    } else if (pattern.averageScore < 85) {
      goals.push('Achieve 85% accuracy consistently');
    } else {
      goals.push('Maintain excellent performance while tackling harder challenges');
    }

    // Speed-based goals
    if (pattern.learningSpeed < 1) {
      goals.push('Build confidence and speed in problem-solving');
    } else if (pattern.learningSpeed > 3) {
      goals.push('Balance speed with accuracy for deeper understanding');
    }

    // Consistency goals
    if (pattern.consistencyScore < 60) {
      goals.push('Practice regularly to build a strong learning habit');
    } else if (analytics.streakData.current < analytics.streakData.best) {
      goals.push(`Work towards beating your best streak of ${analytics.streakData.best} days`);
    }

    // Area-specific goals
    if (pattern.strugglingAreas.length > 0) {
      goals.push(`Focus on strengthening skills in: ${pattern.strugglingAreas.join(', ')}`);
    }

    return goals.slice(0, 3); // Return top 3 goals
  }

  /**
   * Helper methods
   */
  private static getDefaultAnalytics(): LearningAnalytics {
    return {
      totalLessonsCompleted: 0,
      totalProblemsAttempted: 0,
      totalCorrectAnswers: 0,
      averageAccuracy: 0,
      totalTimeSpent: 0,
      streakData: { current: 0, best: 0, consistency: 0 },
      performanceByDifficulty: {
        easy: { attempted: 0, correct: 0, avgTime: 0 },
        medium: { attempted: 0, correct: 0, avgTime: 0 },
        hard: { attempted: 0, correct: 0, avgTime: 0 },
      },
      recentActivity: {
        lastActive: new Date().toISOString(),
        activeDaysInWeek: 0,
        sessionsThisWeek: 0,
      },
    };
  }

  private static estimateDifficulty(lessonId: string, isCorrect: boolean): 'easy' | 'medium' | 'hard' {
    // Simple heuristic based on lesson order/name and performance
    if (lessonId.includes('1') || lessonId.includes('basic')) return 'easy';
    if (lessonId.includes('2') || lessonId.includes('intermediate')) return 'medium';
    return isCorrect ? 'medium' : 'hard'; // If they got it wrong, assume it was harder
  }

  private static getLessonDifficulty(lesson: any): string {
    // Could be enhanced to read from lesson metadata
    if (lesson.order <= 2) return 'easy';
    if (lesson.order <= 4) return 'medium';
    return 'hard';
  }

  private static getNextSequentialLesson(analytics: LearningAnalytics): number {
    return analytics.totalLessonsCompleted + 1;
  }

  private static getRecommendationReason(lesson: any, pattern: LearningPattern, progress: any): string {
    if (progress?.isCompleted && progress.score < 80) {
      return `Revisit this lesson to improve your score from ${Math.round(progress.score)}%`;
    }
    
    if (progress?.attemptsCount > 0 && !progress.isCompleted) {
      return 'Continue where you left off to complete this lesson';
    }

    if (pattern.averageScore >= 85 && this.getLessonDifficulty(lesson) === 'hard') {
      return 'Challenge yourself with this advanced topic';
    }

    if (pattern.averageScore < 60 && this.getLessonDifficulty(lesson) === 'easy') {
      return 'Build confidence with this fundamental lesson';
    }

    if (pattern.strugglingAreas.includes(this.getLessonDifficulty(lesson))) {
      return `Strengthen your ${this.getLessonDifficulty(lesson)} level skills`;
    }

    return 'Next in your learning sequence';
  }

  private static estimateCompletionTime(lesson: any, pattern: LearningPattern): number {
    const baseTime = 15; // minutes
    const difficultyMultiplier = this.getLessonDifficulty(lesson) === 'hard' ? 1.5 : 
                                this.getLessonDifficulty(lesson) === 'medium' ? 1.2 : 1.0;
    const speedAdjustment = pattern.learningSpeed > 0 ? Math.max(0.5, 2 / pattern.learningSpeed) : 1.5;
    
    return Math.round(baseTime * difficultyMultiplier * speedAdjustment);
  }

  private static isLessonUnlocked(lesson: any, allLessons: any[]): boolean {
    // Simple sequential unlock logic
    if (lesson.order === 1) return true;
    
    const prerequisite = allLessons.find(l => l.order === lesson.order - 1);
    return prerequisite?.progress?.isCompleted || false;
  }

  private static getLessonPrerequisites(lesson: any, allLessons: any[]): string[] {
    if (lesson.order === 1) return [];
    
    const prerequisite = allLessons.find(l => l.order === lesson.order - 1);
    return prerequisite ? [prerequisite.title] : [];
  }
}
