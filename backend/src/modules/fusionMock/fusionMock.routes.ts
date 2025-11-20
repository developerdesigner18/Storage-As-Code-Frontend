import { Router } from 'express';
import { FusionMockController } from './fusionMock.controller';
import { FusionMockService } from './fusionMock.service';

/**
 * Fusion Mock Routes
 * Simulates Pure Fusion API endpoints
 */
const router = Router();

// Initialize dependencies
const fusionMockService = new FusionMockService();
const fusionMockController = new FusionMockController(fusionMockService);

// Health check
router.get('/health', fusionMockController.healthCheck);

// Volume endpoints
router.post('/volumes', fusionMockController.createVolume);
router.get('/volumes', fusionMockController.getAllVolumes);
router.get('/volumes/:id', fusionMockController.getVolume);
router.delete('/volumes/:id', fusionMockController.deleteVolume);

export default router;
