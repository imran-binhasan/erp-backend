import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import roleRoutes from '../modules/role/role.routes';
import userRoutes from '../modules/user/user.routes';
import productRoutes from '../modules/product/product.routes';
import customerRoutes from '../modules/customer/customer.routes';
import saleRoutes from '../modules/sale/sale.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/customers', customerRoutes);
router.use('/sales', saleRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
