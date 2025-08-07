import { Request, Response } from 'express';
import { BaseController } from '../../core/base';
import { asyncHandler, sendSuccess, sendError } from '../../core/middleware';
import { validateBody, validateQuery, validateParams } from '../../core/validation/validation.middleware';
import { UserService } from './user.service';
import { 
  CreateUserSchema, 
  UpdateUserSchema, 
  UserQuerySchema, 
  UserParamsSchema,
  CreateUserDto,
  UpdateUserDto,
  UserQueryDto,
  UserParamsDto
} from './user.dto';
import './user.swagger'; // Import Swagger documentation

export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();
  }

  initializeRoutes(): void {
    this.router.get('/', 
      validateQuery(UserQuerySchema),
      asyncHandler(this.getAllUsers.bind(this))
    );
    this.router.get('/stats', asyncHandler(this.getUserStats.bind(this)));
    this.router.get('/:id', 
      validateParams(UserParamsSchema),
      asyncHandler(this.getUserById.bind(this))
    );
    this.router.post('/', 
      validateBody(CreateUserSchema),
      asyncHandler(this.createUser.bind(this))
    );
    this.router.put('/:id', 
      validateParams(UserParamsSchema),
      validateBody(UpdateUserSchema),
      asyncHandler(this.updateUser.bind(this))
    );
    this.router.delete('/:id', 
      validateParams(UserParamsSchema),
      asyncHandler(this.deleteUser.bind(this))
    );
  }

  private async getAllUsers(req: Request, res: Response): Promise<void> {
    const query = req.validated?.query as UserQueryDto;
    const result = await this.userService.getAllUsers(query);
    
    res.json({
      success: true,
      data: result.users,
      pagination: result.pagination,
      total: result.total,
      timestamp: new Date().toISOString(),
    });
  }

  private async getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.validated?.params as UserParamsDto;
    const user = await this.userService.getUserById(id);
    
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    sendSuccess(res, user, 'User retrieved successfully');
  }

  private async createUser(req: Request, res: Response): Promise<void> {
    const userData = req.validated?.body as CreateUserDto;
    const newUser = await this.userService.createUser(userData);
    sendSuccess(res, newUser, 'User created successfully', 201);
  }

  private async updateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.validated?.params as UserParamsDto;
    const userData = req.validated?.body as UpdateUserDto;

    const updatedUser = await this.userService.updateUser(id, userData);
    
    if (!updatedUser) {
      sendError(res, 'User not found', 404);
      return;
    }

    sendSuccess(res, updatedUser, 'User updated successfully');
  }

  private async deleteUser(req: Request, res: Response): Promise<void> {
    const { id } = req.validated?.params as UserParamsDto;
    const deleted = await this.userService.deleteUser(id);
    
    if (!deleted) {
      sendError(res, 'User not found', 404);
      return;
    }

    sendSuccess(res, null, 'User deleted successfully');
  }

  private async getUserStats(req: Request, res: Response): Promise<void> {
    const stats = await this.userService.getUserStats();
    sendSuccess(res, stats, 'User statistics retrieved successfully');
  }
}
