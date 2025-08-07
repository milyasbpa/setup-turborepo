/**
 * Test Utilities and Helpers
 * Common functions and mocks for testing
 */

import { Request, Response } from 'express';
import { User, Post, Comment } from '@prisma/client';

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
    bio: 'Software developer',
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
    bio: 'UI/UX Designer',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];

export const samplePosts: Partial<Post>[] = [
  {
    id: 'post-1',
    title: 'Test Post 1',
    content: 'This is a test post content',
    slug: 'test-post-1',
    published: true,
    authorId: 'user-1',
    tags: ['test', 'sample'],
    excerpt: 'Test post excerpt',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'post-2',
    title: 'Draft Post',
    content: 'This is a draft post',
    slug: 'draft-post',
    published: false,
    authorId: 'user-2',
    tags: ['draft'],
    excerpt: 'Draft post excerpt',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];

export const sampleComments: Partial<Comment>[] = [
  {
    id: 'comment-1',
    content: 'Great post!',
    postId: 'post-1',
    authorId: 'user-2',
    parentId: null,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  },
  {
    id: 'comment-2',
    content: 'Thanks for the feedback!',
    postId: 'post-1',
    authorId: 'user-1',
    parentId: 'comment-1',
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04')
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

export const createMockPrismaPost = () => ({
  create: jest.fn(),
  findUnique: jest.fn(),
  findMany: jest.fn(),
  findFirst: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  upsert: jest.fn(),
  count: jest.fn()
});

export const createMockPrismaComment = () => ({
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
