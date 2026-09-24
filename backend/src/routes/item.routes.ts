import { Router } from 'express';
import { body } from 'express-validator';
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyItems,
} from '../controllers/item.controller';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', getItems);
router.get('/my/listings', protect, getMyItems);
router.get('/:id', getItemById);

router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Item name is required'),
    body('category')
      .isIn(['Books', 'Electronics', 'Study Materials', 'Stationery', 'Sports', 'Accessories', 'Other'])
      .withMessage('Invalid category'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('condition').isIn(['New', 'Like New', 'Good', 'Used']).withMessage('Invalid condition'),
    body('availability').trim().notEmpty().withMessage('Availability is required'),
    body('wantInExchange').trim().notEmpty().withMessage('What you want in exchange is required'),
    validate,
  ],
  createItem
);

router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

export default router;
