import { Router } from 'express';
import { getDashboardStatsHandler } from './dashboard.controller';
import { authenticate } from '../../core/middleware/auth.middleware';
import { requirePermission } from '../../core/middleware/permission.middleware';

const router = Router();

/**
 * @openapi
 * /dashboard/stats:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats including total products, customers, sales, and low stock items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStats'
 */
router.use(authenticate);

router.get('/stats', requirePermission('dashboard:view'), getDashboardStatsHandler);

export default router;
