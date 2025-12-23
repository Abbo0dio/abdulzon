import { Router } from 'express';
import { authRequired } from '../../middleware/auth.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import {
  listProducts,
  createProduct,
  getProduct,
  updateProduct,
  patchProduct,
  deleteProduct
} from '../../controllers/admin/productAdminController.js';

const router = Router();

router.use(authRequired, requireAdmin);
router.get('/', listProducts);
router.post('/', createProduct);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.patch('/:id', patchProduct);
router.delete('/:id', deleteProduct);

export default router;
