import request from 'supertest';
import express from 'express';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';

// Mock UserService
const mockUserService = {
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  getUserStats: jest.fn(),
  getUserByEmail: jest.fn(),
  authenticateUser: jest.fn(),
  changePassword: jest.fn(),
} as unknown as jest.Mocked<UserService>;

jest.mock('../user.service', () => ({
  UserService: jest.fn().mockImplementation(() => mockUserService),
}));

// Mock validation middleware to simplify testing
jest.mock('../../../core/validation/validation.middleware', () => ({
  validateBody: () => (req: any, res: any, next: any) => {
    req.validated = { ...req.validated, body: req.body };
    next();
  },
  validateQuery: () => (req: any, res: any, next: any) => {
    req.validated = { ...req.validated, query: req.query };
    next();
  },
  validateParams: () => (req: any, res: any, next: any) => {
    req.validated = { ...req.validated, params: req.params };
    next();
  },
}));

// Mock async handler
jest.mock('../../../core/middleware', () => ({
  asyncHandler: (fn: any) => fn,
  sendSuccess: jest.fn((res, data, message, status = 200) => 
    res.status(status).json({ success: true, data, message })
  ),
  sendError: jest.fn((res, error, status = 500) => 
    res.status(status).json({ success: false, error })
  ),
}));

const app = express();
app.use(express.json());

// Create controller instance and mount its routes
const userController = new UserController(mockUserService);
userController.initializeRoutes();
app.use('/users', userController.router);
app.use('/users', userController.router);

describe('UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users', () => {
    it('should return paginated users', async () => {
      const mockResult = {
        users: [
          {
            id: '1',
            email: 'john@example.com',
            username: 'johndoe',
            displayName: 'John Doe',
            firstName: 'John',
            lastName: 'Doe',
            avatar: null,
            bio: null,
            isActive: true,
            isVerified: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            lastLoginAt: null,
          },
          {
            id: '2',
            email: 'jane@example.com',
            username: 'janesmith',
            displayName: 'Jane Smith',
            firstName: 'Jane',
            lastName: 'Smith',
            avatar: null,
            bio: null,
            isActive: true,
            isVerified: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            lastLoginAt: null,
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
        total: 2
      };

      mockUserService.getAllUsers.mockResolvedValue(mockResult);

      const response = await request(app)
        .get('/users')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(mockUserService.getAllUsers).toHaveBeenCalledWith({
        page: '1',
        limit: '10',
      });
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResult.users);
      expect(response.body.pagination).toEqual(mockResult.pagination);
      expect(response.body.total).toBe(mockResult.total);
    });

    // it('should handle service errors', async () => {
    //   const error = new Error('Database connection failed');
    //   mockUserService.getAllUsers.mockRejectedValue(error);

    //   const response = await request(app)
    //     .get('/users')
    //     .expect(500);

    //   expect(mockUserService.getAllUsers).toHaveBeenCalled();
    //   expect(response.body.success).toBe(false);
    // });
  });

  describe('GET /users/stats', () => {
    it('should return user statistics', async () => {
      const mockStats = {
        totalUsers: 100,
        activeUsers: 85,
        verifiedUsers: 90,
        recentUsers: [
          {
            id: '1',
            email: 'recent@example.com',
            username: 'recentuser',
            displayName: 'Recent User',
            firstName: 'Recent',
            lastName: 'User',
            avatar: null,
            bio: null,
            isActive: true,
            isVerified: true,
            createdAt: '2023-12-01T00:00:00Z',
            updatedAt: '2023-12-01T00:00:00Z',
            lastLoginAt: null,
          },
        ],
      };

      mockUserService.getUserStats.mockResolvedValue(mockStats);

      const response = await request(app)
        .get('/users/stats')
        .expect(200);

      expect(mockUserService.getUserStats).toHaveBeenCalled();
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockStats);
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by id', async () => {
      const mockUser = {
        id: '1',
        email: 'john@example.com',
        username: 'johndoe',
        displayName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        avatar: null,
        bio: null,
        isActive: true,
        isVerified: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        lastLoginAt: null,
      };

      mockUserService.getUserById.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/users/1')
        .expect(200);

      expect(mockUserService.getUserById).toHaveBeenCalledWith('1');
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockUser);
    });

    it('should return 404 when user not found', async () => {
      mockUserService.getUserById.mockResolvedValue(null);

      const response = await request(app)
        .get('/users/nonexistent')
        .expect(404);

      expect(mockUserService.getUserById).toHaveBeenCalledWith('nonexistent');
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const createdUser = {
        id: '3',
        email: 'newuser@example.com',
        username: 'newuser',
        displayName: 'New User',
        firstName: 'New',
        lastName: 'User',
        avatar: null,
        bio: null,
        isActive: true,
        isVerified: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        lastLoginAt: null,
      };

      mockUserService.createUser.mockResolvedValue(createdUser);

      const response = await request(app)
        .post('/users')
        .send(newUser)
        .expect(201);

      expect(mockUserService.createUser).toHaveBeenCalledWith(newUser);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(createdUser);
      expect(response.body.message).toBe('User created successfully');
    });

    // it('should handle duplicate email errors', async () => {
    //   const duplicateUser = {
    //     name: 'Duplicate User',
    //     email: 'existing@example.com',
    //     password: 'password123',
    //   };

    //   const error = new Error('Email already exists');
    //   mockUserService.createUser.mockRejectedValue(error);

    //   const response = await request(app)
    //     .post('/users')
    //     .send(duplicateUser)
    //     .expect(500);

    //   expect(mockUserService.createUser).toHaveBeenCalledWith(duplicateUser);
    //   expect(response.body.success).toBe(false);
    // });
  });

  describe('PUT /users/:id', () => {
    it('should update an existing user', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const updatedUser = {
        id: '1',
        email: 'updated@example.com',
        username: 'updateduser',
        displayName: 'Updated Name',
        firstName: 'Updated',
        lastName: 'Name',
        avatar: null,
        bio: null,
        isActive: true,
        isVerified: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        lastLoginAt: null,
      };

      mockUserService.updateUser.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put('/users/1')
        .send(updateData)
        .expect(200);

      expect(mockUserService.updateUser).toHaveBeenCalledWith('1', updateData);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(updatedUser);
      expect(response.body.message).toBe('User updated successfully');
    });

    it('should handle user not found during update', async () => {
      const updateData = { name: 'Updated Name' };
      
      mockUserService.updateUser.mockResolvedValue(null);

      const response = await request(app)
        .put('/users/nonexistent')
        .send(updateData)
        .expect(404);

      expect(mockUserService.updateUser).toHaveBeenCalledWith('nonexistent', updateData);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete an existing user', async () => {
      mockUserService.deleteUser.mockResolvedValue(true);

      const response = await request(app)
        .delete('/users/1')
        .expect(200);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith('1');
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeNull();
      expect(response.body.message).toBe('User deleted successfully');
    });

    it('should handle user not found during deletion', async () => {
      mockUserService.deleteUser.mockResolvedValue(false);

      const response = await request(app)
        .delete('/users/nonexistent')
        .expect(404);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith('nonexistent');
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User not found');
    });
  });
});
