import { Router } from 'express';
import { loginHandler, changePasswordHandler } from './auth.controller';
import { validate } from '../../core/middleware/validate.middleware';
import { authenticate } from '../../core/middleware/auth.middleware';
import { loginSchema, changePasswordSchema } from './auth.validation';

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     description: Authenticate user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: admin@example.com
 *             password: admin123
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/login', validate(loginSchema), loginHandler);

/**
 * @openapi
 * /auth/change-password:
 *   post:
 *     tags: [Auth]
 *     summary: Change password
 *     description: Change authenticated user's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password is incorrect
 */
router.post('/change-password', authenticate, validate(changePasswordSchema), changePasswordHandler);

export default router;
