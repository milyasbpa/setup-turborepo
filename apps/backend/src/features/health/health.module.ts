import { Router } from 'express';
import { BaseModule } from '../../core/base';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

export class HealthModule extends BaseModule {
  public controller: HealthController;
  public service: HealthService;

  constructor() {
    super();
    this.service = new HealthService();
    this.controller = new HealthController(this.service);
  }

  initialize(): Router {
    return this.controller.router;
  }
}
