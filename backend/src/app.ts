import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';

import config from './core/config/config';
import logger from './core/logger/logger';
import DatabaseClient from './core/database/prisma.client';
import { errorHandler, notFoundHandler } from './core/middleware/error.middleware';
import { requestLogger, performanceMonitor } from './core/middleware/logging.middleware';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import volumeRoutes from './modules/volumes/volume.routes';

/**
 * Main Application
 * Pure Fusion Storage-as-Code Backend
 */
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(requestLogger);
app.use(performanceMonitor);

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pure Fusion API',
            version: '1.0.0',
            description: 'Storage-as-Code Self-Service Portal API',
            contact: {
                name: 'Pure Fusion Team',
                email: 'support@purefusion.com',
            },
        },
        servers: [
            {
                url: `http://localhost:${config.port}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/modules/**/*.routes.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'Pure Fusion Backend',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'Pure Fusion Storage-as-Code API',
        version: '1.0.0',
        documentation: '/api-docs',
        endpoints: {
            health: 'GET /health',
            auth: 'POST /api/auth/login',
            volumes: 'GET /api/volumes',
        },
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/volumes', volumeRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully...');
    await DatabaseClient.disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down gracefully...');
    await DatabaseClient.disconnect();
    process.exit(0);
});

// Start server
const PORT = config.port;

app.listen(PORT, () => {
    logger.info(`🚀 Pure Fusion Backend running on port ${PORT}`);
    logger.info(`   Environment: ${config.nodeEnv}`);
    logger.info(`   API Docs: http://localhost:${PORT}/api-docs`);
    logger.info(`   Health: http://localhost:${PORT}/health`);
    logger.info(`   Fusion Mock: ${config.fusionMock.url}`);
});

export default app;
