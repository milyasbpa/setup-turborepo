import { Router } from 'express';
import { IController, IService, IModule } from './interfaces';

export abstract class BaseController implements IController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  abstract initializeRoutes(): void;
}

export abstract class BaseService implements IService {
  // Base service functionality can be added here
  // For example: logging, common utilities, etc.
}

export abstract class BaseModule implements IModule {
  public abstract controller: IController;
  public abstract service: IService;

  abstract initialize(): Router;
}
