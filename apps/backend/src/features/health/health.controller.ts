import { Request, Response } from 'express';
import { BaseController } from '../../core/base';
import { asyncHandler, sendSuccess } from '../../core/middleware';
import { HealthService } from './health.service';
import './health.swagger'; // Import Swagger documentation

export class HealthController extends BaseController {
  constructor(private healthService: HealthService) {
    super();
  }

  initializeRoutes(): void {
    this.router.get('/', asyncHandler(this.getHealth.bind(this)));
    this.router.get('/detailed', asyncHandler(this.getDetailedHealth.bind(this)));
  }

  private async getHealth(req: Request, res: Response): Promise<void> {
    const healthStatus = await this.healthService.getHealthStatus();
    sendSuccess(res, healthStatus, 'Health check successful');
  }

  private async getDetailedHealth(req: Request, res: Response): Promise<void> {
    const detailedHealth = await this.healthService.getDetailedHealth();
    sendSuccess(res, detailedHealth, 'Detailed health check successful');
  }
}
