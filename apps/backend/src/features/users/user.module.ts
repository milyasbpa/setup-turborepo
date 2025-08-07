import { Router } from 'express';
import { BaseModule } from '../../core/base';
import { UserController } from './user.controller';
import { UserService } from './user.service';

export class UserModule extends BaseModule {
  public controller: UserController;
  public service: UserService;

  constructor() {
    super();
    this.service = new UserService();
    this.controller = new UserController(this.service);
  }

  initialize(): Router {
    return this.controller.router;
  }
}
