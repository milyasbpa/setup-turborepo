import { BaseService } from '../../core/base';

export interface HealthStatus {
  status: string;
  service: string;
  timestamp: string;
  uptime: number;
  version?: string;
}

export class HealthService extends BaseService {
  async getHealthStatus(): Promise<HealthStatus> {
    return {
      status: 'OK',
      service: 'backend',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  async getDetailedHealth(): Promise<{
    status: string;
    checks: Record<string, any>;
    timestamp: string;
  }> {
    // You can add more health checks here (database, external services, etc.)
    const checks = {
      memory: {
        used: process.memoryUsage(),
        free: process.memoryUsage().heapTotal - process.memoryUsage().heapUsed,
      },
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };

    return {
      status: 'OK',
      checks,
      timestamp: new Date().toISOString(),
    };
  }
}
