import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

interface SeedConfig {
  version: string;
  description: string;
  seedOrder: SeedTable[];
  settings: SeedSettings;
}

interface SeedTable {
  table: string;
  file: string;
  description: string;
  dependencies: string[];
  requiredFields: string[];
  hashFields?: string[];
  lookupFields?: Record<string, LookupField>;
}

interface LookupField {
  table: string;
  field: string;
  maps_to: string;
}

interface SeedSettings {
  saltRounds: number;
  skipExisting: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Advanced JSON-based Database Seeder
 * Reads seed data from JSON files and handles dependencies automatically
 */
export class JsonSeeder {
  private prisma: PrismaClient;
  private config: SeedConfig;
  private dataCache: Map<string, any[]> = new Map();
  private recordCache: Map<string, Map<string, any>> = new Map();

  constructor(prisma: PrismaClient, configPath: string) {
    this.prisma = prisma;
    this.config = this.loadConfig(configPath);
    this.log('info', `🌱 JsonSeeder initialized with config version ${this.config.version}`);
  }

  /**
   * Load seed configuration from JSON file
   */
  private loadConfig(configPath: string): SeedConfig {
    try {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(configContent);
    } catch (error) {
      throw new Error(`Failed to load seed config from ${configPath}: ${error}`);
    }
  }

  /**
   * Load data from JSON file
   */
  private loadData(tableName: string, fileName: string): any[] {
    if (this.dataCache.has(tableName)) {
      return this.dataCache.get(tableName)!;
    }

    const dataPath = path.join(path.dirname(__dirname), 'seeds', 'data', fileName);
    
    try {
      const dataContent = fs.readFileSync(dataPath, 'utf-8');
      const data = JSON.parse(dataContent);
      this.dataCache.set(tableName, data);
      this.log('debug', `📄 Loaded ${data.length} records from ${fileName}`);
      return data;
    } catch (error) {
      throw new Error(`Failed to load data from ${dataPath}: ${error}`);
    }
  }

  /**
   * Hash password fields
   */
  private async hashPasswords(records: any[], hashFields: string[]): Promise<any[]> {
    const saltRounds = this.config.settings.saltRounds;
    
    return Promise.all(
      records.map(async (record) => {
        const hashedRecord = { ...record };
        
        for (const field of hashFields) {
          if (hashedRecord[field]) {
            hashedRecord[field] = await bcrypt.hash(hashedRecord[field], saltRounds);
          }
        }
        
        return hashedRecord;
      })
    );
  }

  /**
   * Resolve lookup fields (foreign keys)
   */
  private async resolveLookups(records: any[], lookupFields: Record<string, LookupField>): Promise<any[]> {
    return Promise.all(
      records.map(async (record) => {
        const resolvedRecord = { ...record };
        
        this.log('debug', `🔍 Before lookup resolution: ${JSON.stringify(resolvedRecord)}`);
        
        for (const [lookupField, lookup] of Object.entries(lookupFields)) {
          if (resolvedRecord[lookupField]) {
            const lookupValue = resolvedRecord[lookupField]; // Store this before deletion
            const referencedRecord = await this.findCachedRecord(
              lookup.table, 
              lookup.field, 
              lookupValue
            );
            
            if (referencedRecord) {
              resolvedRecord[lookup.maps_to] = referencedRecord.id;
              delete resolvedRecord[lookupField]; // Remove the lookup field
              this.log('debug', `✅ Resolved ${lookupField}=${lookupValue} to ${lookup.maps_to}=${referencedRecord.id}`);
            } else {
              this.log('warn', `⚠️ Could not resolve ${lookupField}=${lookupValue} in ${lookup.table}`);
              // Don't delete the lookup field if resolution fails - this might be causing the issue
            }
          }
        }
        
        this.log('debug', `🔍 After lookup resolution: ${JSON.stringify(resolvedRecord)}`);
        
        return resolvedRecord;
      })
    );
  }

  /**
   * Find a cached record by field value
   */
  private async findCachedRecord(tableName: string, field: string, value: any): Promise<any | null> {
    if (!this.recordCache.has(tableName)) {
      return null;
    }
    
    const tableCache = this.recordCache.get(tableName)!;
    const cacheKey = `${field}:${value}`;
    return tableCache.get(cacheKey) || null;
  }

  /**
   * Cache a record for lookup resolution
   */
  private cacheRecord(tableName: string, record: any, uniqueFields: string[]): void {
    if (!this.recordCache.has(tableName)) {
      this.recordCache.set(tableName, new Map());
    }
    
    const tableCache = this.recordCache.get(tableName)!;
    
    // Cache by ID
    tableCache.set(`id:${record.id}`, record);
    
    // Cache by unique fields
    for (const field of uniqueFields) {
      if (record[field]) {
        tableCache.set(`${field}:${record[field]}`, record);
      }
    }
  }

  /**
   * Seed a specific table
   */
  private async seedTable(tableConfig: SeedTable): Promise<void> {
    this.log('info', `📊 Seeding table: ${tableConfig.table}`);
    this.log('info', `   Description: ${tableConfig.description}`);
    
    // Load raw data
    let records = this.loadData(tableConfig.table, tableConfig.file);
    
    // Hash password fields if specified
    if (tableConfig.hashFields && tableConfig.hashFields.length > 0) {
      this.log('debug', `🔐 Hashing fields: ${tableConfig.hashFields.join(', ')}`);
      records = await this.hashPasswords(records, tableConfig.hashFields);
    }
    
    // Resolve lookup fields if specified
    if (tableConfig.lookupFields) {
      this.log('debug', `🔗 Resolving lookups: ${Object.keys(tableConfig.lookupFields).join(', ')}`);
      records = await this.resolveLookups(records, tableConfig.lookupFields);
    }
    
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const recordData of records) {
      try {
        this.log('debug', `🔍 Processing record: ${JSON.stringify(recordData)}`);
        
        // Validate required fields
        for (const requiredField of tableConfig.requiredFields) {
          const fieldValue = recordData[requiredField];
          this.log('debug', `🔍 Checking field '${requiredField}': value = ${fieldValue}, type = ${typeof fieldValue}, exists = ${recordData.hasOwnProperty(requiredField)}`);
          
          if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
            this.log('error', `❌ Missing required field: ${requiredField} in record: ${JSON.stringify(recordData)}`);
            throw new Error(`Missing required field: ${requiredField}`);
          }
        }
        
        let record;
        const tableName = tableConfig.table;
        
        // Handle different tables with appropriate upsert logic
        switch (tableName) {
          case 'users':
            record = await (this.prisma as any).user.upsert({
              where: { email: recordData.email },
              update: this.config.settings.skipExisting ? {} : recordData,
              create: recordData,
            });
            this.cacheRecord('users', record, ['email', 'username']);
            break;
            
          case 'lessons':
            record = await (this.prisma as any).lesson.upsert({
              where: { id: recordData.id },
              update: this.config.settings.skipExisting ? {} : recordData,
              create: recordData,
            });
            this.cacheRecord('lessons', record, ['id', 'title']);
            break;
            
          case 'problems':
            record = await (this.prisma as any).problem.upsert({
              where: { id: recordData.id },
              update: this.config.settings.skipExisting ? {} : recordData,
              create: recordData,
            });
            this.cacheRecord('problems', record, ['id']);
            break;
            
          case 'problemOptions':
            record = await (this.prisma as any).problemOption.upsert({
              where: { id: recordData.id },
              update: this.config.settings.skipExisting ? {} : recordData,
              create: recordData,
            });
            this.cacheRecord('problemOptions', record, ['id']);
            break;
            
          case 'userProgress':
            record = await (this.prisma as any).userProgress.upsert({
              where: {
                userId_lessonId: {
                  userId: recordData.userId,
                  lessonId: recordData.lessonId,
                }
              },
              update: this.config.settings.skipExisting ? {} : recordData,
              create: recordData,
            });
            this.cacheRecord('userProgress', record, ['userId', 'lessonId']);
            break;
            
          default:
            throw new Error(`Unsupported table: ${tableName}`);
        }
        
        this.log('debug', `✅ Created/Updated ${tableName}: ${this.getRecordIdentifier(record, tableConfig)}`);
        createdCount++;
        
      } catch (error) {
        if (error instanceof Error && error.message.includes('Unique constraint')) {
          this.log('debug', `⏭️ Skipped existing ${tableConfig.table}: ${this.getRecordIdentifier(recordData, tableConfig)}`);
          skippedCount++;
        } else {
          this.log('error', `❌ Failed to create ${tableConfig.table}: ${error}`);
          throw error;
        }
      }
    }
    
    this.log('info', `✅ Table ${tableConfig.table}: ${createdCount} created, ${skippedCount} skipped`);
  }

  /**
   * Get a human-readable identifier for a record
   */
  private getRecordIdentifier(record: any, tableConfig: SeedTable): string {
    // Try to find a meaningful identifier
    const identifiers = ['email', 'username', 'title', 'slug', 'name'];
    
    for (const field of identifiers) {
      if (record[field]) {
        return record[field];
      }
    }
    
    return record.id || 'unknown';
  }

  /**
   * Log message with level
   */
  private log(level: SeedSettings['logLevel'], message: string): void {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    const configLevel = levels[this.config.settings.logLevel];
    const messageLevel = levels[level];
    
    if (messageLevel >= configLevel) {
      const timestamp = new Date().toISOString();
      const prefix = level.toUpperCase().padEnd(5);
      console.log(`${timestamp} [${prefix}] ${message}`);
    }
  }

  /**
   * Run all seeds in dependency order
   */
  async seedAll(): Promise<void> {
    this.log('info', `🚀 Starting database seeding`);
    this.log('info', `📝 ${this.config.description}`);
    
    const startTime = Date.now();
    
    try {
      for (const tableConfig of this.config.seedOrder) {
        await this.seedTable(tableConfig);
      }
      
      const duration = Date.now() - startTime;
      this.log('info', `🎉 Database seeding completed successfully in ${duration}ms`);
      
    } catch (error) {
      this.log('error', `💥 Database seeding failed: ${error}`);
      throw error;
    }
  }

  /**
   * Seed specific table by name
   */
  async seedTableByName(tableName: string): Promise<void> {
    const tableConfig = this.config.seedOrder.find(t => t.table === tableName);
    
    if (!tableConfig) {
      throw new Error(`Table configuration not found: ${tableName}`);
    }
    
    // Load dependencies first
    for (const dependency of tableConfig.dependencies) {
      const depConfig = this.config.seedOrder.find(t => t.table === dependency);
      if (depConfig) {
        await this.seedTableByName(depConfig.table);
      }
    }
    
    await this.seedTable(tableConfig);
  }

  /**
   * List available seed tables
   */
  listTables(): string[] {
    return this.config.seedOrder.map(t => t.table);
  }

  /**
   * Get table information
   */
  getTableInfo(tableName: string): SeedTable | null {
    return this.config.seedOrder.find(t => t.table === tableName) || null;
  }
}
