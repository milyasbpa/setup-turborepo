import { Problem, ProblemOption } from '@prisma/client';
import { LessonRepository } from '../../core/repositories/lesson.repository';
import { SubmissionRepository } from '../../core/repositories/submission.repository';
import { LoggerService } from '../../core/logger/logger.service';
import {
  LessonDto,
  LessonWithProblemsDto,
  SubmitLessonDto,
  SubmitLessonResponseDto,
  ProblemResultDto,
  transformLessonToDto,
  transformLessonWithProblemsToDto,
} from './dtos/lesson.dto';

/**
 * Lesson Service
 * Business logic for lesson management
 */
export class LessonService {
  /**
   * Get all lessons with user progress
   */
  static async getAllLessons(userId: string = '1'): Promise<LessonDto[]> {
    LoggerService.logService('LessonService', `getAllLessons(${userId})`, true);
    
    try {
      const lessons = await LessonRepository.findAllWithProgress(userId);
      return lessons.map(transformLessonToDto);
    } catch (error) {
      LoggerService.error('Failed to get all lessons', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      throw error;
    }
  }

  /**
   * Get lesson by ID with problems (frontend-safe - no correct answers)
   */
  static async getLessonById(id: string): Promise<LessonWithProblemsDto | null> {
    LoggerService.logService('LessonService', `getLessonById(${id})`, true);
    
    try {
      const lesson = await LessonRepository.findByIdWithProblems(id, false);
      return lesson ? transformLessonWithProblemsToDto(lesson) : null;
    } catch (error) {
      LoggerService.error('Failed to get lesson by ID', {
        error: error instanceof Error ? error.message : 'Unknown error',
        lessonId: id,
      });
      throw error;
    }
  }

  /**
   * Submit lesson answers with XP and streak calculation
   */
  static async submitLesson(
    lessonId: string,
    submitData: SubmitLessonDto,
    userId: string = '1'
  ): Promise<SubmitLessonResponseDto> {
    LoggerService.logService('LessonService', `submitLesson(${lessonId}, ${submitData.attemptId})`, true);
    
    try {
      // Get lesson with problems and correct answers for validation
      const lesson = await LessonRepository.findByIdWithProblems(lessonId, true);
      if (!lesson) {
        throw new Error('Lesson not found');
      }

      // Validate all problems are answered
      const problemIds = lesson.problems.map(p => p.id);
      const answeredIds = submitData.answers.map(a => a.problemId);
      
      for (const problemId of problemIds) {
        if (!answeredIds.includes(problemId)) {
          throw new Error(`Answer required for problem: ${problemId}`);
        }
      }

      // Calculate XP per problem (simple: 10 XP per correct answer)
      const XP_PER_CORRECT_ANSWER = 10;

      // Process each answer
      const results: ProblemResultDto[] = [];
      const processedAnswers: Array<{
        problemId: string;
        answer: string;
        isCorrect: boolean;
        xpEarned: number;
      }> = [];

      for (const userAnswer of submitData.answers) {
        const problem = lesson.problems.find(p => p.id === userAnswer.problemId);
        if (!problem) {
          throw new Error(`Problem not found: ${userAnswer.problemId}`);
        }

        let isCorrect = false;
        
        // Check answer based on problem type
        if (problem.problemType === 'multiple_choice') {
          // For multiple choice, find the correct option
          const correctOption = problem.options?.find(opt => opt.isCorrect);
          isCorrect = correctOption ? userAnswer.answer === correctOption.optionText : false;
        } else if (problem.problemType === 'input') {
          // For input, compare with correct answer (case-insensitive, trimmed)
          isCorrect = userAnswer.answer.trim().toLowerCase() === 
                     problem.correctAnswer?.trim().toLowerCase();
        }

        const xpEarned = isCorrect ? XP_PER_CORRECT_ANSWER : 0;

        processedAnswers.push({
          problemId: userAnswer.problemId,
          answer: userAnswer.answer,
          isCorrect,
          xpEarned,
        });

        results.push({
          problemId: userAnswer.problemId,
          userAnswer: userAnswer.answer,
          isCorrect,
          correctAnswer: problem.correctAnswer || '',
          explanation: problem.explanation || '',
          xpEarned,
        });
      }

      // Submit to repository for XP and streak processing
      const submissionResult = await SubmissionRepository.submitAnswers(
        userId,
        lessonId,
        processedAnswers,
        submitData.attemptId
      );

      // Calculate lesson score and completion
      const correctCount = results.filter(r => r.isCorrect).length;
      const totalCount = results.length;
      const score = Math.round((correctCount / totalCount) * 100);
      const completed = correctCount === totalCount; // 100% required for completion

      const response: SubmitLessonResponseDto = {
        success: true,
        xpEarned: submissionResult.xpEarned,
        totalXp: submissionResult.totalXp,
        streak: {
          current: submissionResult.newStreak,
          best: submissionResult.newStreak, // Will be updated in the repository
          updated: submissionResult.streakUpdated,
        },
        lesson: {
          completed,
          score,
          bestScore: score, // Will be properly calculated in repository
        },
        results,
      };

      LoggerService.info('Lesson submission processed', {
        userId,
        lessonId,
        attemptId: submitData.attemptId,
        score,
        xpEarned: submissionResult.xpEarned,
        completed,
      });

      return response;
    } catch (error) {
      LoggerService.error('Failed to submit lesson', {
        error: error instanceof Error ? error.message : 'Unknown error',
        lessonId,
        userId,
        attemptId: submitData.attemptId,
      });
      throw error;
    }
  }

  /**
   * Get lesson statistics
   */
  static async getLessonStats() {
    LoggerService.logService('LessonService', 'getLessonStats', true);
    
    try {
      return await LessonRepository.getStats();
    } catch (error) {
      LoggerService.error('Failed to get lesson stats', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
}
