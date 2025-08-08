import { z } from 'zod';

/**
 * Lesson DTOs and Validation Schemas
 */

// Base lesson response DTO
export interface LessonDto {
  id: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  progress?: {
    isCompleted: boolean;
    score: number;
    bestScore: number;
    attemptsCount: number;
  };
}

// Problem DTO (without correct answers for frontend)
export interface ProblemDto {
  id: string;
  question: string;
  problemType: 'multiple_choice' | 'input';
  order: number;
  difficulty: 'easy' | 'medium' | 'hard';
  options?: ProblemOptionDto[];
}

// Problem option DTO (without isCorrect for frontend)
export interface ProblemOptionDto {
  id: string;
  optionText: string;
  order: number;
}

// Lesson with problems DTO
export interface LessonWithProblemsDto extends Omit<LessonDto, 'progress'> {
  problems: ProblemDto[];
}

// Submit lesson answers request DTO
export interface SubmitLessonDto {
  attemptId: string;
  answers: AnswerDto[];
}

// Individual answer DTO
export interface AnswerDto {
  problemId: string;
  answer: string;
}

// Submit lesson response DTO
export interface SubmitLessonResponseDto {
  success: boolean;
  xpEarned: number;
  totalXp: number;
  streak: {
    current: number;
    best: number;
    updated: boolean;
  };
  lesson: {
    completed: boolean;
    score: number;
    bestScore: number;
  };
  results: ProblemResultDto[];
}

// Individual problem result DTO
export interface ProblemResultDto {
  problemId: string;
  userAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  xpEarned: number;
}

/**
 * Validation Schemas
 */

// Submit lesson validation schema
export const submitLessonSchema = z.object({
  attemptId: z.string().min(1, 'Attempt ID is required'),
  answers: z.array(
    z.object({
      problemId: z.string().min(1, 'Problem ID is required'),
      answer: z.string().min(1, 'Answer is required'),
    })
  ).min(1, 'At least one answer is required'),
});

// Query parameters for lessons list
export const lessonsQuerySchema = z.object({
  userId: z.string().optional(),
});

// Lesson ID parameter validation
export const lessonIdSchema = z.object({
  id: z.string().min(1, 'Lesson ID is required'),
});

/**
 * Transform functions
 */

// Transform Lesson entity to DTO
export const transformLessonToDto = (lesson: any): LessonDto => ({
  id: lesson.id,
  title: lesson.title,
  description: lesson.description,
  order: lesson.order,
  xpReward: lesson.xpReward,
  isActive: lesson.isActive,
  createdAt: lesson.createdAt,
  updatedAt: lesson.updatedAt,
  progress: lesson.progress,
});

// Transform Problem entity to DTO (excluding sensitive data)
export const transformProblemToDto = (problem: any): ProblemDto => ({
  id: problem.id,
  question: problem.question,
  problemType: problem.problemType,
  order: problem.order,
  difficulty: problem.difficulty,
  options: problem.options?.map(transformProblemOptionToDto),
});

// Transform ProblemOption entity to DTO (excluding isCorrect)
export const transformProblemOptionToDto = (option: any): ProblemOptionDto => ({
  id: option.id,
  optionText: option.optionText,
  order: option.order,
});

// Transform Lesson with Problems to DTO
export const transformLessonWithProblemsToDto = (lesson: any): LessonWithProblemsDto => ({
  id: lesson.id,
  title: lesson.title,
  description: lesson.description,
  order: lesson.order,
  xpReward: lesson.xpReward,
  isActive: lesson.isActive,
  createdAt: lesson.createdAt,
  updatedAt: lesson.updatedAt,
  problems: lesson.problems?.map(transformProblemToDto) || [],
});
