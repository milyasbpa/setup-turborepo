import { Request, Response } from 'express';
import { BaseController } from '../../core/base';
import { asyncHandler, sendSuccess, sendError } from '../../core/middleware';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, GetUsersQuery } from './user.interface';

export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();
  }

  initializeRoutes(): void {
    this.router.get('/', asyncHandler(this.getAllUsers.bind(this)));
    this.router.get('/stats', asyncHandler(this.getUserStats.bind(this)));
    this.router.get('/:id', asyncHandler(this.getUserById.bind(this)));
    this.router.post('/', asyncHandler(this.createUser.bind(this)));
    this.router.put('/:id', asyncHandler(this.updateUser.bind(this)));
    this.router.delete('/:id', asyncHandler(this.deleteUser.bind(this)));
  }

  private async getAllUsers(req: Request, res: Response): Promise<void> {
    const query: GetUsersQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
    };

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
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      sendError(res, 'Invalid user ID', 400);
      return;
    }

    const user = await this.userService.getUserById(id);
    
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    sendSuccess(res, user, 'User retrieved successfully');
  }

  private async createUser(req: Request, res: Response): Promise<void> {
    const userData: CreateUserDto = req.body;

    // Basic validation
    if (!userData.name || !userData.email) {
      sendError(res, 'Name and email are required', 400);
      return;
    }

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      sendError(res, 'Invalid email format', 400);
      return;
    }

    const newUser = await this.userService.createUser(userData);
    sendSuccess(res, newUser, 'User created successfully', 201);
  }

  private async updateUser(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const userData: UpdateUserDto = req.body;

    if (isNaN(id)) {
      sendError(res, 'Invalid user ID', 400);
      return;
    }

    // Email validation if email is being updated
    if (userData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        sendError(res, 'Invalid email format', 400);
        return;
      }
    }

    const updatedUser = await this.userService.updateUser(id, userData);
    
    if (!updatedUser) {
      sendError(res, 'User not found', 404);
      return;
    }

    sendSuccess(res, updatedUser, 'User updated successfully');
  }

  private async deleteUser(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      sendError(res, 'Invalid user ID', 400);
      return;
    }

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
