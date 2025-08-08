import request from 'supertest';
import express from 'express';
import { ProfileController } from '../profile.controller';
import { ProfileService } from '../profile.service';

// Mock ProfileService
jest.mock('../profile.service');
const MockedProfileService = ProfileService as jest.Mocked<typeof ProfileService>;

// Mock LoggerService
jest.mock('../../../core/logger/logger.service', () => ({
  LoggerService: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock middleware
jest.mock('../../../core/middleware', () => ({
  sendSuccess: jest.fn((res, data, message, status = 200) => 
    res.status(status).json({ success: true, data, message })
  ),
  sendError: jest.fn((res, error, status = 500) => 
    res.status(status).json({ success: false, error })
  ),
}));

const app = express();
app.use(express.json());

// Mount profile routes
app.get('/profile', ProfileController.getUserProfile);
app.get('/profile/stats/:id', ProfileController.getUserStats);

describe('ProfileController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /profile', () => {
    it('should return user profile', async () => {
      const mockProfile = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User',
        avatar: null,
        totalXp: 100,
        currentStreak: 5,
        bestStreak: 10,
        lastActivityDate: new Date('2023-01-01T00:00:00Z'),
        progressPercentage: 60,
        completedLessons: 3,
        totalLessons: 5,
        isVerified: true,
        isActive: true,
        createdAt: new Date('2023-01-01T00:00:00Z'),
      };

      MockedProfileService.getUserProfile.mockResolvedValue(mockProfile);

      const response = await request(app)
        .get('/profile?userId=1')
        .expect(200);

      expect(MockedProfileService.getUserProfile).toHaveBeenCalledWith('1');
      expect(response.body.success).toBe(true);
    });

    it('should handle user not found', async () => {
      const error = new Error('User not found');
      MockedProfileService.getUserProfile.mockRejectedValue(error);

      const response = await request(app)
        .get('/profile?userId=999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /profile/stats/:id', () => {
    it('should return user stats', async () => {
      const mockStats = {
        profile: {
          totalXp: 500,
          currentStreak: 7,
          bestStreak: 15,
          lastActivityDate: new Date('2023-01-01T00:00:00Z'),
        },
        progress: {
          completedLessons: 12,
          totalLessons: 20,
          averageScore: 88.5,
          totalAttempts: 15,
        },
        recentActivity: [
          {
            id: '1',
            lessonId: 'lesson-1',
            isCorrect: true,
            xpEarned: 50,
            submittedAt: new Date('2023-01-01T00:00:00Z'),
          },
        ],
      };

      MockedProfileService.getUserStats.mockResolvedValue(mockStats);

      const response = await request(app)
        .get('/profile/stats/1')
        .expect(200);

      expect(MockedProfileService.getUserStats).toHaveBeenCalledWith('1');
      expect(response.body.success).toBe(true);
    });
  });
});
