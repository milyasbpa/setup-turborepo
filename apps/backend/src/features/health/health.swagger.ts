/**
 * @swagger
 * components:
 *   schemas:
 *     HealthStatus:
 *       type: object
 *       required:
 *         - status
 *         - service
 *         - timestamp
 *         - uptime
 *         - version
 *       properties:
 *         status:
 *           type: string
 *           example: "OK"
 *           description: Current health status
 *         service:
 *           type: string
 *           example: "backend"
 *           description: Service name
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2025-08-08T01:00:00.000Z"
 *           description: Health check timestamp
 *         uptime:
 *           type: number
 *           example: 3600.123
 *           description: Service uptime in seconds
 *         version:
 *           type: string
 *           example: "1.0.0"
 *           description: Service version
 *         environment:
 *           type: string
 *           example: "development"
 *           description: Current environment
 *         dependencies:
 *           type: object
 *           additionalProperties:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [healthy, unhealthy, degraded]
 *                 example: "healthy"
 *               responseTime:
 *                 type: number
 *                 example: 15.5
 *               lastCheck:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-08T01:00:00.000Z"
 *           description: Status of service dependencies
 *     
 *     HealthResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/HealthStatus'
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Get service health status
 *     description: Returns the current health status of the service including uptime, version, and dependency status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             example:
 *               success: true
 *               data:
 *                 status: "OK"
 *                 service: "backend"
 *                 timestamp: "2025-08-08T01:00:00.000Z"
 *                 uptime: 3600.123
 *                 version: "1.0.0"
 *                 environment: "development"
 *               message: "Health check successful"
 *               timestamp: "2025-08-08T01:00:00.000Z"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
