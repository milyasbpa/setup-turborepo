#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
import { DatabaseSeeder } from '../core/seeders';
import { LoggerService } from '../core/logger';

// Load environment variables
dotenv.config();

/**
 * Database Seeder CLI
 * Usage: npm run db:seed [command] [seeder_name]
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'run';
  const seederName = args[1];

  const seeder = new DatabaseSeeder();

  try {
    switch (command) {
      case 'run':
      case 'seed':
        if (seederName) {
          LoggerService.info(`🌱 Running specific seeder: ${seederName}`);
          await seeder.seedOne(seederName);
        } else {
          LoggerService.info('🌱 Running all seeders...');
          await seeder.seed();
        }
        break;

      case 'rollback':
        LoggerService.info('🔄 Rolling back seeders...');
        await seeder.rollback();
        break;

      case 'list':
        LoggerService.info('📋 Available seeders:');
        const seeders = seeder.list();
        seeders.forEach((name, index) => {
          LoggerService.info(`${index + 1}. ${name}`);
        });
        break;

      case 'test':
        LoggerService.info('🔍 Testing database connection...');
        const isConnected = await seeder.testConnection();
        if (isConnected) {
          LoggerService.info('✅ Database connection successful!');
          process.exit(0);
        } else {
          LoggerService.error('❌ Database connection failed!');
          process.exit(1);
        }
        break;

      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;

      default:
        LoggerService.error(`Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }

    LoggerService.info('🎉 Operation completed successfully!');
    process.exit(0);
  } catch (error) {
    LoggerService.error('❌ Operation failed:', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
Database Seeder CLI

Usage:
  npm run db:seed [command] [options]

Commands:
  run, seed         Run all seeders (default)
  run <name>        Run specific seeder
  rollback          Rollback all seeders
  list              List available seeders
  test              Test database connection
  help              Show this help message

Examples:
  npm run db:seed                    # Run all seeders
  npm run db:seed run UserSeeder     # Run only UserSeeder
  npm run db:seed rollback           # Rollback all seeders
  npm run db:seed list               # List available seeders
  npm run db:seed test               # Test database connection

Environment:
  Make sure DATABASE_URL is set in your .env file

For more information, see docs/DATABASE.md
`);
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

export { main as runSeeder };
