import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import fusionMockRoutes from './fusionMock.routes';
import config from '../../core/config/config';
import logger from '../../core/logger/logger';

/**
 * Fusion Mock Server
 * Standalone server simulating Pure Fusion API
 */
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    logger.info(`Fusion Mock: ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/v1', fusionMockRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'Pure Fusion Mock API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /v1/health',
            createVolume: 'POST /v1/volumes',
            getVolumes: 'GET /v1/volumes',
            getVolume: 'GET /v1/volumes/:id',
            deleteVolume: 'DELETE /v1/volumes/:id',
        },
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.url} not found`,
    });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Fusion Mock Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message || 'An unexpected error occurred',
    });
});

// Start server
const PORT = config.fusionMock.port;

app.listen(PORT, () => {
    logger.info(`🚀 Fusion Mock API running on port ${PORT}`);
    logger.info(`   Health: http://localhost:${PORT}/v1/health`);
    logger.info(`   API: http://localhost:${PORT}/v1/volumes`);
});

export default app;
