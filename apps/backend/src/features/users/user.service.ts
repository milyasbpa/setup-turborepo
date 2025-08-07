import { BaseService } from '../../core/base';
import { LoggerService } from '../../core/logger';
import { User, CreateUserDto, UpdateUserDto, GetUsersQuery } from './user.interface';

export class UserService extends BaseService {
  private users: User[] = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
  ];

  async getAllUsers(query: GetUsersQuery = {}): Promise<{
    users: User[];
    total: number;
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    LoggerService.logService('UserService', 'getAllUsers', true, { query });
    
    let filteredUsers = [...this.users];

    // Search functionality
    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
      LoggerService.debug(`Search applied: "${query.search}", found ${filteredUsers.length} users`);
    }

    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return {
      users: paginatedUsers,
      total: filteredUsers.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(filteredUsers.length / limit),
      },
    };
  }

  async getUserById(id: number): Promise<User | null> {
    LoggerService.logService('UserService', `getUserById(${id})`, true);
    return this.users.find(user => user.id === id) || null;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const newUser: User = {
      id: Math.max(...this.users.map(u => u.id)) + 1,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    LoggerService.logService('UserService', 'createUser', true, { userId: newUser.id, email: newUser.email });
    return newUser;
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      LoggerService.logService('UserService', `updateUser(${id})`, false, { reason: 'User not found' });
      return null;
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    LoggerService.logService('UserService', `updateUser(${id})`, true, { updatedFields: Object.keys(userData) });
    return this.users[userIndex];
  }

  async deleteUser(id: number): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      LoggerService.logService('UserService', `deleteUser(${id})`, false, { reason: 'User not found' });
      return false;
    }

    this.users.splice(userIndex, 1);
    LoggerService.logService('UserService', `deleteUser(${id})`, true);
    return true;
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    recentUsers: User[];
  }> {
    const recentUsers = this.users
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, 5);

    LoggerService.logService('UserService', 'getUserStats', true, { totalUsers: this.users.length });

    return {
      totalUsers: this.users.length,
      recentUsers,
    };
  }
}
