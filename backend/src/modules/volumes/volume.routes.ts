import { Router } from 'express';
import { VolumeController } from './volume.controller';
import { VolumeService } from './volume.service';
import { VolumeRepository } from './volume.repository';
import { authenticate } from '../../core/middleware/auth.middleware';
import { asyncHandler } from '../../core/middleware/error.middleware';

/**
 * Volume Routes
 * Defines all volume management endpoints
 */
const router = Router();

// Initialize dependencies
const volumeRepository = new VolumeRepository();
const volumeService = new VolumeService(volumeRepository);
const volumeController = new VolumeController(volumeService);

/**
 * @swagger
 * /api/volumes:
 *   post:
 *     summary: Create a new volume
 *     tags: [Volumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - size_gb
 *               - performance_class
 *               - protection_policy
 *               - environment
 *             properties:
 *               name:
 *                 type: string
 *               size_gb:
 *                 type: number
 *                 minimum: 10
 *                 maximum: 5000
 *               performance_class:
 *                 type: string
 *                 enum: [gold, silver, bronze]
 *               protection_policy:
 *                 type: string
 *                 enum: [daily, hourly, none]
 *               environment:
 *                 type: string
 *                 enum: [dev, test, prod]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                     value:
 *                       type: string
 *     responses:
 *       201:
 *         description: Volume created successfully
 *       400:
 *         description: Invalid request
 *       409:
 *         description: Volume name already exists
 */
router.post('/', authenticate, asyncHandler(volumeController.createVolume));

/**
 * @swagger
 * /api/volumes:
 *   get:
 *     summary: Get all volumes
 *     tags: [Volumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [creating, ready, failed, deleting]
 *       - in: query
 *         name: environment
 *         schema:
 *           type: string
 *           enum: [dev, test, prod]
 *     responses:
 *       200:
 *         description: List of volumes
 */
router.get('/', authenticate, asyncHandler(volumeController.getVolumes));

/**
 * @swagger
 * /api/volumes/{id}:
 *   get:
 *     summary: Get volume by ID
 *     tags: [Volumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Volume details
 *       404:
 *         description: Volume not found
 */
router.get('/:id', authenticate, asyncHandler(volumeController.getVolumeById));

/**
 * @swagger
 * /api/volumes/{id}:
 *   patch:
 *     summary: Update volume
 *     tags: [Volumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               size_gb:
 *                 type: number
 *               performance_class:
 *                 type: string
 *               protection_policy:
 *                 type: string
 *               tags:
 *                 type: array
 *     responses:
 *       200:
 *         description: Volume updated successfully
 *       404:
 *         description: Volume not found
 */
router.patch('/:id', authenticate, asyncHandler(volumeController.updateVolume));

/**
 * @swagger
 * /api/volumes/{id}:
 *   delete:
 *     summary: Delete volume
 *     tags: [Volumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Volume deleted successfully
 *       404:
 *         description: Volume not found
 */
router.delete('/:id', authenticate, asyncHandler(volumeController.deleteVolume));

export default router;
