import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express, Application } from 'express';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import path from 'path';
import fs from 'fs';

/**
 * Swagger configuration options
 */
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Math Learning App API',
      version: '1.0.0',
      description: 'A comprehensive Duolingo-style math learning API with XP/streak system, lesson management, and progress tracking. Built with Express.js, TypeScript, Prisma, and Zod validation.',
      contact: {
        name: 'API Support',
        email: 'support@mathlearningapp.com',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.example.com' 
          : 'http://localhost:3002',
        description: process.env.NODE_ENV === 'production' 
          ? 'Production server' 
          : 'Development server',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          required: ['success', 'error', 'timestamp'],
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'An error occurred',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                  code: { type: 'string' },
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-08T01:00:00.000Z',
            },
          },
        },
        ValidationError: {
          allOf: [
            { $ref: '#/components/schemas/Error' },
            {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Validation failed',
                },
              },
            },
          ],
        },
        SuccessResponse: {
          type: 'object',
          required: ['success', 'timestamp'],
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operation successful',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-08T01:00:00.000Z',
            },
          },
        },
        PaginationMeta: {
          type: 'object',
          required: ['page', 'limit', 'total', 'totalPages'],
          properties: {
            page: {
              type: 'integer',
              minimum: 1,
              example: 1,
            },
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              example: 10,
            },
            total: {
              type: 'integer',
              minimum: 0,
              example: 25,
            },
            totalPages: {
              type: 'integer',
              minimum: 0,
              example: 3,
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad Request - Validation Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints for monitoring and status verification',
      },
      {
        name: 'Lessons',
        description: 'Math lesson management - browse lessons, get problems, submit answers',
      },
      {
        name: 'Profile',
        description: 'User profile and statistics - XP, streak, and learning progress',
      },
    ],
  },
  apis: [
    path.join(__dirname, '../../features/**/*.controller.ts'),
    path.join(__dirname, '../../features/**/*.dto.ts'),
    path.join(__dirname, '../../**/*.swagger.ts'),
  ],
};

/**
 * Generate OpenAPI specification
 */
export function generateOpenApiSpec() {
  return swaggerJsdoc(swaggerOptions);
}

/**
 * Setup Swagger UI
 */
export function setupSwagger(app: Application) {
  const specs = generateOpenApiSpec();
  
  // Serve Swagger UI
  app.use('/api/docs', swaggerUi.serve);
  app.get('/api/docs', swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Backend API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
    },
  }));

  // Serve OpenAPI JSON
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  return specs;
}

/**
 * Convert Zod schema to OpenAPI schema
 */
export function zodToOpenApi(schema: z.ZodSchema, name?: string) {
  return zodToJsonSchema(schema, name);
}

/**
 * Export OpenAPI specification to file
 */
export function exportOpenApiSpec(outputPath?: string) {
  const specs = generateOpenApiSpec();
  const outputFile = outputPath || path.join(process.cwd(), 'openapi.json');
  
  try {
    fs.writeFileSync(outputFile, JSON.stringify(specs, null, 2));
    console.log(`OpenAPI specification exported to: ${outputFile}`);
    return outputFile;
  } catch (error) {
    console.error('Failed to export OpenAPI specification:', error);
    throw error;
  }
}

/**
 * Swagger documentation decorator for routes
 */
export function SwaggerDoc(documentation: any) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // Store swagger documentation metadata
    if (!target.constructor.swaggerDocs) {
      target.constructor.swaggerDocs = {};
    }
    target.constructor.swaggerDocs[propertyKey] = documentation;
  };
}

/**
 * Generate schema reference for Swagger
 */
export function createSchemaRef(schemaName: string) {
  return {
    $ref: `#/components/schemas/${schemaName}`,
  };
}

/**
 * Create response schema for Swagger
 */
export function createResponseSchema(dataSchema: any, description: string = 'Successful response') {
  return {
    description,
    content: {
      'application/json': {
        schema: {
          allOf: [
            { $ref: '#/components/schemas/SuccessResponse' },
            {
              type: 'object',
              properties: {
                data: dataSchema,
              },
            },
          ],
        },
      },
    },
  };
}

/**
 * Create paginated response schema for Swagger
 */
export function createPaginatedResponseSchema(itemSchema: any, description: string = 'Paginated response') {
  return {
    description,
    content: {
      'application/json': {
        schema: {
          allOf: [
            { $ref: '#/components/schemas/SuccessResponse' },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: itemSchema,
                },
                pagination: {
                  $ref: '#/components/schemas/PaginationMeta',
                },
              },
            },
          ],
        },
      },
    },
  };
}
