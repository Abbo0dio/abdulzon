import { Router } from 'express';
import { authRequired } from '../../middleware/auth.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import { summary, salesByDay, topProducts } from '../../controllers/admin/analyticsController.js';

const router = Router();

router.use(authRequired, requireAdmin);
router.get('/summary', summary);
router.get('/sales-by-day', salesByDay);
router.get('/top-products', topProducts);

export default router;
