import express from 'express';
import { getStores, getStoreById, searchProducts } from '../controllers/storeController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Store routes
router.get('/', getStores);
router.get('/:id', getStoreById);
router.get('/:id/products', searchProducts);

export default router;
