#!/usr/bin/env tsx

import { exportOpenApiSpec } from '../core/swagger';
import path from 'path';

async function main() {
  try {
    console.log('🚀 Exporting OpenAPI specification...');
    
    // Default path to turbo root level for shared access
    const defaultPath = path.join(process.cwd(), '../../openapi.json');
    const outputPath = process.argv[2] || defaultPath;
    const exportedFile = exportOpenApiSpec(outputPath);
    
    console.log('✅ OpenAPI specification exported successfully!');
    console.log(`📁 File location: ${exportedFile}`);
    console.log('📖 You can use this file to:');
    console.log('  - Import into Postman or Insomnia');
    console.log('  - Generate client SDKs in frontend');
    console.log('  - Share API documentation');
    console.log('  - Validate API compliance');
    
  } catch (error) {
    console.error('❌ Failed to export OpenAPI specification:');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();
