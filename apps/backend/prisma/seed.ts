import { PrismaClient } from '@prisma/client';
import { JsonSeeder } from './seeds/json-seeder';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting JSON-based database seeding...');

  // Initialize the JSON seeder
  const configPath = path.join(__dirname, 'seeds', 'seed-config.json');
  const seeder = new JsonSeeder(prisma, configPath);

  // Check command line arguments
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    const command = args[0];
    
    switch (command) {
      case 'list':
        console.log('📋 Available seed tables:');
        const tables = seeder.listTables();
        tables.forEach((table, index) => {
          const info = seeder.getTableInfo(table);
          console.log(`  ${index + 1}. ${table} - ${info?.description || 'No description'}`);
        });
        return;
        
      case 'table':
        if (args[1]) {
          console.log(`🎯 Seeding specific table: ${args[1]}`);
          await seeder.seedTableByName(args[1]);
        } else {
          console.error('❌ Please specify a table name: npm run seed table users');
          process.exit(1);
        }
        return;
        
      default:
        console.log(`❓ Unknown command: ${command}`);
        console.log('Available commands:');
        console.log('  npm run seed        - Seed all tables');
        console.log('  npm run seed list   - List available tables');
        console.log('  npm run seed table <name> - Seed specific table');
        process.exit(1);
    }
  }

  // Default: seed all tables
  await seeder.seedAll();
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
