import express from 'express';
import {
  getLists,
  createList,
  getListById,
  updateList,
  deleteList,
  addItem,
  updateItem,
  deleteItem,
} from '../controllers/groceryController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// List routes
router.route('/lists')
  .get(getLists)
  .post(createList);

router.route('/lists/:id')
  .get(getListById)
  .put(updateList)
  .delete(deleteList);

// Item routes
router.route('/items')
  .post(addItem);

router.route('/items/:itemId')
  .put(updateItem)
  .delete(deleteItem);

export default router;
