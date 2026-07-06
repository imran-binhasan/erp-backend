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
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date (YYYY-MM-DD)
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to date (YYYY-MM-DD)
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
 *                   required: [product, quantity]
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *     responses:
 *       201:
 *         description: Sale created successfully
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

/**
 * @openapi
 * /sales/{id}:
 *   get:
 *     tags: [Sales]
 *     summary: Get sale by ID
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
 *         description: Sale details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       404:
 *         description: Sale not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */

router.get('/', requirePermission('sale:read'), listSalesHandler);
router.get('/:id', requirePermission('sale:read'), getSaleByIdHandler);
router.post(
  '/',
  requirePermission('sale:create'),
  validate(createSaleSchema),
  createSaleHandler
);

export default router;
