import { SeederManager } from './seeder.manager';
import { UserSeeder } from './user.seeder';

/**
 * Main seeder runner
 * Registers and runs all available seeders
 */
export class DatabaseSeeder {
  private manager: SeederManager;

  constructor() {
    this.manager = new SeederManager();
    this.registerSeeders();
  }

  /**
   * Register all available seeders
   */
  private registerSeeders(): void {
    // Register seeders in order of dependency
    this.manager.register(new UserSeeder());
    
    // Add more seeders here as needed
    // this.manager.register(new PostSeeder());
    // this.manager.register(new CommentSeeder());
  }

  /**
   * Run all seeders
   */
  async seed(): Promise<void> {
    try {
      await this.manager.checkConnection();
      await this.manager.runAll();
    } catch (error) {
      throw error;
    } finally {
      await this.manager.cleanup();
    }
  }

  /**
   * Run specific seeder
   */
  async seedOne(name: string): Promise<void> {
    try {
      await this.manager.checkConnection();
      await this.manager.runSeeder(name);
    } catch (error) {
      throw error;
    } finally {
      await this.manager.cleanup();
    }
  }

  /**
   * Rollback all seeders
   */
  async rollback(): Promise<void> {
    try {
      await this.manager.checkConnection();
      await this.manager.rollbackAll();
    } catch (error) {
      throw error;
    } finally {
      await this.manager.cleanup();
    }
  }

  /**
   * List available seeders
   */
  list(): string[] {
    return this.manager.list();
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.manager.checkConnection();
      await this.manager.cleanup();
      return true;
    } catch (error) {
      return false;
    }
  }
}
