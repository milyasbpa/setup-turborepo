/**
 * Test Utilities and Helpers
 * Common functions and mocks for testing
 */

import { Request, Response } from 'express';
import { User, Lesson, Problem } from '@prisma/client';

/**
 * Mock Express Request object
 */
export const createMockRequest = (options: {
  body?: any;
  params?: any;
  query?: any;
  headers?: any;
  user?: any;
} = {}): Partial<Request> => ({
  body: options.body || {},
  params: options.params || {},
  query: options.query || {},
  headers: options.headers || {},
  user: options.user || undefined,
  ...options
});

/**
 * Mock Express Response object
 */
export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Sample test data
 */
export const sampleUsers: Partial<User>[] = [
  {
    id: 'user-1',
    email: 'john.doe@test.com',
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    displayName: 'John Doe',
    password: 'hashedPassword123',
    isVerified: true,
    isActive: true,
    totalXp: 150,
    currentStreak: 5,
    bestStreak: 10,
    lastActivityDate: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'user-2',
    email: 'jane.smith@test.com',
    username: 'janesmith',
    firstName: 'Jane',
    lastName: 'Smith',
    displayName: 'Jane Smith',
    password: 'hashedPassword456',
    isVerified: false,
    isActive: true,
    totalXp: 75,
    currentStreak: 2,
    bestStreak: 7,
    lastActivityDate: new Date('2024-01-02'),
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];

export const sampleLessons: Partial<Lesson>[] = [
  {
    id: 'lesson-1',
    title: 'Basic Arithmetic',
    description: 'Learn addition and subtraction',
    order: 1,
    xpReward: 10,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'lesson-2',
    title: 'Multiplication',
    description: 'Master multiplication tables',
    order: 2,
    xpReward: 15,
    isActive: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];

export const sampleProblems: Partial<Problem>[] = [
  {
    id: 'problem-1',
    lessonId: 'lesson-1',
    question: 'What is 5 + 3?',
    problemType: 'multiple_choice',
    order: 1,
    correctAnswer: '8',
    explanation: '5 + 3 = 8',
    difficulty: 'easy',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'problem-2',
    lessonId: 'lesson-2',
    question: 'What is 3 × 4?',
    problemType: 'multiple_choice',
    order: 1,
    correctAnswer: '12',
    explanation: '3 × 4 = 12',
    difficulty: 'easy',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];

/**
 * Database mock helpers
 */
export const createMockPrismaUser = () => ({
  create: jest.fn(),
  findUnique: jest.fn(),
  findMany: jest.fn(),
  findFirst: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  upsert: jest.fn(),
  count: jest.fn()
});

export const createMockPrismaLesson = () => ({
  create: jest.fn(),
  findUnique: jest.fn(),
  findMany: jest.fn(),
  findFirst: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  upsert: jest.fn(),
  count: jest.fn()
});

export const createMockPrismaProblem = () => ({
  create: jest.fn(),
  findMany: jest.fn(),
  findFirst: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn()
});

/**
 * Reset all mocks helper
 */
export const resetAllMocks = () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
};

/**
 * Assert response helpers
 */
export const expectSuccessResponse = (res: Partial<Response>, statusCode = 200) => {
  expect(res.status).toHaveBeenCalledWith(statusCode);
  expect(res.json).toHaveBeenCalled();
};

export const expectErrorResponse = (res: Partial<Response>, statusCode = 400) => {
  expect(res.status).toHaveBeenCalledWith(statusCode);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
      error: expect.any(String)
    })
  );
};

/**
 * Async test wrapper
 */
export const asyncTest = (fn: () => Promise<void>) => {
  return async () => {
    try {
      await fn();
    } catch (error) {
      throw error;
    }
  };
};
