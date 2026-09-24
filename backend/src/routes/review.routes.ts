import { Router } from 'express';
import { body } from 'express-validator';
import { createReview, getUserReviews, getMyReviews } from '../controllers/review.controller';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/user/:userId', getUserReviews);
router.get('/my/all', protect, getMyReviews);

router.post(
  '/',
  protect,
  [
    body('exchangeId').notEmpty().withMessage('Exchange ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5 stars'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
    validate,
  ],
  createReview
);

export default router;
