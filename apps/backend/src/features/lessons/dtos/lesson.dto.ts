import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     Lesson:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *         - order
 *         - xpReward
 *         - isActive
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           example: "lesson-1"
 *           description: Unique lesson identifier
 *         title:
 *           type: string
 *           example: "Basic Arithmetic"
 *           description: Lesson title
 *         description:
 *           type: string
 *           example: "Learn addition and subtraction basics"
 *           description: Lesson description
 *         order:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *           description: Lesson order in curriculum
 *         xpReward:
 *           type: integer
 *           minimum: 0
 *           example: 10
 *           description: XP reward for completing lesson
 *         isActive:
 *           type: boolean
 *           example: true
 *           description: Whether lesson is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-08T01:00:00.000Z"
 *           description: Lesson creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-08T01:00:00.000Z"
 *           description: Lesson last update timestamp
 *         progress:
 *           $ref: '#/components/schemas/LessonProgress'
 *
 *     LessonProgress:
 *       type: object
 *       required:
 *         - isCompleted
 *         - score
 *         - bestScore
 *         - attemptsCount
 *       properties:
 *         isCompleted:
 *           type: boolean
 *           example: false
 *           description: Whether lesson is completed
 *         score:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           example: 85
 *           description: Current lesson score (0-100)
 *         bestScore:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           example: 95
 *           description: Best lesson score achieved
 *         attemptsCount:
 *           type: integer
 *           minimum: 0
 *           example: 3
 *           description: Number of attempts made
 *
 *     Problem:
 *       type: object
 *       required:
 *         - id
 *         - question
 *         - problemType
 *         - order
 *         - difficulty
 *       properties:
 *         id:
 *           type: string
 *           example: "problem-1-1"
 *           description: Unique problem identifier
 *         question:
 *           type: string
 *           example: "What is 5 + 3?"
 *           description: The math problem question
 *         problemType:
 *           type: string
 *           enum: [multiple_choice, input]
 *           example: "multiple_choice"
 *           description: Type of problem interaction
 *         order:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *           description: Problem order in lesson
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           example: "easy"
 *           description: Problem difficulty level
 *         options:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProblemOption'
 *           description: Multiple choice options (if applicable)
 *
 *     ProblemOption:
 *       type: object
 *       required:
 *         - id
 *         - optionText
 *         - order
 *       properties:
 *         id:
 *           type: string
 *           example: "option-1-1-a"
 *           description: Unique option identifier
 *         optionText:
 *           type: string
 *           example: "8"
 *           description: Option text/answer
 *         order:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *           description: Option display order
 *
 *     LessonWithProblems:
 *       allOf:
 *         - $ref: '#/components/schemas/Lesson'
 *         - type: object
 *           properties:
 *             problems:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Problem'
 *               description: List of problems in the lesson
 *           required:
 *             - problems
 *
 *     SubmitLessonRequest:
 *       type: object
 *       required:
 *         - attemptId
 *         - answers
 *       properties:
 *         attemptId:
 *           type: string
 *           example: "attempt-123-456"
 *           description: Unique attempt identifier for idempotency
 *         answers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Answer'
 *           description: List of user answers
 *           minItems: 1
 *
 *     Answer:
 *       type: object
 *       required:
 *         - problemId
 *         - answer
 *       properties:
 *         problemId:
 *           type: string
 *           example: "problem-1-1"
 *           description: ID of the problem being answered
 *         answer:
 *           type: string
 *           example: "8"
 *           description: User's answer to the problem
 *
 *     SubmitLessonResponse:
 *       type: object
 *       required:
 *         - success
 *         - xpEarned
 *         - totalXp
 *         - streak
 *         - lesson
 *         - results
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *           description: Whether submission was successful
 *         xpEarned:
 *           type: integer
 *           minimum: 0
 *           example: 40
 *           description: XP earned from this lesson attempt
 *         totalXp:
 *           type: integer
 *           minimum: 0
 *           example: 120
 *           description: User's total XP after this lesson
 *         streak:
 *           $ref: '#/components/schemas/StreakInfo'
 *         lesson:
 *           $ref: '#/components/schemas/LessonResult'
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProblemResult'
 *           description: Detailed results for each problem
 *
 *     StreakInfo:
 *       type: object
 *       required:
 *         - current
 *         - best
 *         - updated
 *       properties:
 *         current:
 *           type: integer
 *           minimum: 0
 *           example: 3
 *           description: Current daily streak
 *         best:
 *           type: integer
 *           minimum: 0
 *           example: 7
 *           description: Best streak achieved
 *         updated:
 *           type: boolean
 *           example: true
 *           description: Whether streak was updated with this lesson
 *
 *     LessonResult:
 *       type: object
 *       required:
 *         - completed
 *         - score
 *         - bestScore
 *       properties:
 *         completed:
 *           type: boolean
 *           example: true
 *           description: Whether lesson was completed
 *         score:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           example: 85
 *           description: Score for this attempt (0-100)
 *         bestScore:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           example: 95
 *           description: Best score achieved for this lesson
 *
 *     ProblemResult:
 *       type: object
 *       required:
 *         - problemId
 *         - userAnswer
 *         - isCorrect
 *         - correctAnswer
 *         - explanation
 *         - xpEarned
 *       properties:
 *         problemId:
 *           type: string
 *           example: "problem-1-1"
 *           description: ID of the problem
 *         userAnswer:
 *           type: string
 *           example: "8"
 *           description: User's submitted answer
 *         isCorrect:
 *           type: boolean
 *           example: true
 *           description: Whether the answer was correct
 *         correctAnswer:
 *           type: string
 *           example: "8"
 *           description: The correct answer
 *         explanation:
 *           type: string
 *           example: "5 + 3 = 8. Addition combines two numbers."
 *           description: Explanation of the solution
 *         xpEarned:
 *           type: integer
 *           minimum: 0
 *           example: 10
 *           description: XP earned for this problem
 *
 *     LessonListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *
 *     LessonResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/LessonWithProblems'
 *
 *     SubmitLessonResponseWrapper:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/SubmitLessonResponse'
 */

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
