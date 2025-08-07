import { BaseService } from '../../core/base';
import { LoggerService } from '../../core/logger';
import { prismaService } from '../../core/database';

export interface HealthStatus {
  status: string;
  service: string;
  timestamp: string;
  uptime: number;
  version?: string;
}

export class HealthService extends BaseService {
  async getHealthStatus(): Promise<HealthStatus> {
    LoggerService.logService('HealthService', 'getHealthStatus', true);
    
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
    LoggerService.logService('HealthService', 'getDetailedHealth', true);
    
    // Database health check
    const databaseHealth = await this.checkDatabaseHealth();
    
    // System health checks
    const checks = {
      database: databaseHealth,
      memory: {
        used: process.memoryUsage(),
        free: process.memoryUsage().heapTotal - process.memoryUsage().heapUsed,
      },
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
    };

    // Determine overall status
    const allChecksHealthy = Object.values(checks).every(check => 
      typeof check === 'object' && 'status' in check ? check.status === 'healthy' : true
    );

    return {
      status: allChecksHealthy ? 'OK' : 'DEGRADED',
      checks,
      timestamp: new Date().toISOString(),
    };
  }

  private async checkDatabaseHealth(): Promise<{
    status: string;
    message: string;
    responseTime?: number;
  }> {
    try {
      const startTime = Date.now();
      const isHealthy = await prismaService.healthCheck();
      const responseTime = Date.now() - startTime;

      if (isHealthy) {
        return {
          status: 'healthy',
          message: 'Database connection is working',
          responseTime,
        };
      } else {
        return {
          status: 'unhealthy',
          message: 'Database connection failed',
          responseTime,
        };
      }
    } catch (error) {
      LoggerService.error('Database health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return {
        status: 'unhealthy',
        message: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}
