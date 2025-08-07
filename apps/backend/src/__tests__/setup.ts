/**
 * Jest Test Setup
 * Global configuration and utilities for all tests
 */

import { PrismaClient } from '@prisma/client';

/**
 * Global test setup and mocks
 */

// Mock winston before any imports
jest.mock('winston', () => ({
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    errors: jest.fn(),
    json: jest.fn(),
    colorize: jest.fn(),
    simple: jest.fn(),
    printf: jest.fn()
  },
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  })),
  transports: {
    Console: jest.fn(),
    File: jest.fn()
  },
  addColors: jest.fn(),
  default: {
    addColors: jest.fn(),
    format: {
      combine: jest.fn(),
      timestamp: jest.fn(),
      errors: jest.fn(),
      json: jest.fn(),
      colorize: jest.fn(),
      simple: jest.fn(),
      printf: jest.fn()
    },
    createLogger: jest.fn(() => ({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    })),
    transports: {
      Console: jest.fn(),
      File: jest.fn()
    }
  }
}));

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn()
  }))
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
  genSalt: jest.fn(),
  hashSync: jest.fn(),
  compareSync: jest.fn()
}));

// Environment variables for testing
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

// Global test utilities available to all tests
(global as any).beforeEach(() => {
  jest.clearAllMocks();
});

// Mock bcrypt for consistent testing
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue('salt')
}));

// Mock winston logger to avoid console spam in tests
jest.mock('winston', () => ({
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  })),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
    colorize: jest.fn(),
    simple: jest.fn()
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn()
  }
}));

// Global test utilities
declare global {
  namespace NodeJS {
    interface Global {
      testUtils: {
        createMockUser: () => any;
        createMockPost: () => any;
        createMockComment: () => any;
      };
    }
  }
}

// Global test utilities available to all tests
(global as any).beforeEach(() => {
  jest.clearAllMocks();
});

// Test data factories (exported for use in tests)
export const testUtils = {
  createMockUser: () => ({
    id: 'test-user-id',
    email: 'test@example.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    displayName: 'Test User',
    password: 'hashedPassword',
    isVerified: true,
    isActive: true,
    bio: 'Test user bio',
    avatar: null,
    googleId: null,
    githubId: null,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }),

  createMockPost: () => ({
    id: 'test-post-id',
    title: 'Test Post',
    content: 'Test post content',
    slug: 'test-post',
    published: true,
    authorId: 'test-user-id',
    tags: ['test', 'sample'],
    excerpt: 'Test post excerpt',
    createdAt: new Date(),
    updatedAt: new Date()
  }),

  createMockComment: () => ({
    id: 'test-comment-id',
    content: 'Test comment content',
    postId: 'test-post-id',
    authorId: 'test-user-id',
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  })
};

// Setup and teardown
beforeAll(async () => {
  // Global test setup
});

afterAll(async () => {
  // Global test cleanup
});

beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Cleanup after each test
});

export {};
