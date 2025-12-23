import { Router } from 'express';
import { authRequired } from '../../middleware/auth.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import { listOrders, getOrder, updateOrderStatus } from '../../controllers/admin/orderAdminController.js';

const router = Router();

router.use(authRequired, requireAdmin);
router.get('/', listOrders);
router.get('/:id', getOrder);
router.patch('/:id', updateOrderStatus);

export default router;
