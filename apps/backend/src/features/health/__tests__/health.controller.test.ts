import request from 'supertest';
import express from 'express';
import { HealthController } from '../health.controller';
import { HealthService } from '../health.service';

// Mock HealthService
jest.mock('../health.service', () => ({
  HealthService: jest.fn().mockImplementation(() => ({
    getHealthStatus: jest.fn(),
    getDetailedHealth: jest.fn(),
  })),
}));

// Mock middleware functions
jest.mock('../../../core/middleware', () => ({
  asyncHandler: (fn: any) => fn,
  sendSuccess: jest.fn((res, data, message) => 
    res.status(200).json({ success: true, data, message })
  ),
  sendError: jest.fn((res, error, status) => 
    res.status(status || 500).json({ success: false, error })
  ),
}));

const app = express();
app.use(express.json());

// Create service and controller instances
const mockHealthService = {
  getHealthStatus: jest.fn(),
  getDetailedHealth: jest.fn(),
  checkDatabaseHealth: jest.fn(),
} as unknown as jest.Mocked<HealthService>;

const healthController = new HealthController(mockHealthService);

// Mount controller routes
app.get('/health', healthController['getHealth'].bind(healthController));
app.get('/health/detailed', healthController['getDetailedHealth'].bind(healthController));

describe('HealthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return health check status', async () => {
      const mockHealthData = {
        status: 'OK',
        service: 'backend',
        timestamp: new Date().toISOString(),
        uptime: 3600,
        version: '1.0.0'
      };

      mockHealthService.getHealthStatus.mockResolvedValue(mockHealthData);

      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(mockHealthService.getHealthStatus).toHaveBeenCalled();
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockHealthData);
    });

    // it('should handle health check errors', async () => {
    //   mockHealthService.getHealthStatus.mockRejectedValue(new Error('Database connection failed'));

    //   const response = await request(app)
    //     .get('/health')
    //     .expect(500);

    //   expect(response.body.success).toBe(false);
    // });
  });

  describe('GET /health/detailed', () => {
    it('should return detailed health status', async () => {
      const mockDetailedHealth = {
        status: 'OK',
        checks: {
          database: { status: 'connected', responseTime: 50 },
          memory: { usage: '45%' },
          disk: { usage: '60%' }
        },
        timestamp: new Date().toISOString()
      };

      mockHealthService.getDetailedHealth.mockResolvedValue(mockDetailedHealth);

      const response = await request(app)
        .get('/health/detailed')
        .expect(200);

      expect(mockHealthService.getDetailedHealth).toHaveBeenCalled();
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockDetailedHealth);
    });

    // it('should handle detailed health check errors', async () => {
    //   mockHealthService.getDetailedHealth.mockRejectedValue(new Error('Service unavailable'));

    //   const response = await request(app)
    //     .get('/health/detailed')
    //     .expect(500);

    //   expect(response.body.success).toBe(false);
    // });
  });
});
