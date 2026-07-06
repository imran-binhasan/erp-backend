import { Router } from 'express';
import {
  createSaleHandler,
  getSaleByIdHandler,
  listSalesHandler,
} from './sale.controller';
import { authenticate } from '../../core/middleware/auth.middleware';
import { requirePermission } from '../../core/middleware/permission.middleware';
import { validate } from '../../core/middleware/validate.middleware';
import { createSaleSchema } from './sale.validation';

const router = Router();

/**
 * @openapi
 * /sales:
 *   get:
 *     tags: [Sales]
 *     summary: List all sales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sales list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *   post:
 *     tags: [Sales]
 *     summary: Create a new sale
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customer, items]
 *             properties:
 *               customer:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Sale created
 *       400:
 *         description: Insufficient stock or validation error
 *       403:
 *         description: Missing sale creation permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.use(authenticate);

router.get('/', requirePermission('sale:read'), listSalesHandler);
router.get('/:id', requirePermission('sale:read'), getSaleByIdHandler);
router.post(
  '/',
  requirePermission('sale:create'),
  validate(createSaleSchema),
  createSaleHandler
);

export default router;
