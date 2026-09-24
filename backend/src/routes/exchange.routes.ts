import { Router } from 'express';
import { body } from 'express-validator';
import {
  createExchange,
  getSentExchanges,
  getReceivedExchanges,
  getExchangeById,
  acceptExchange,
  rejectExchange,
  cancelExchange,
  completeExchange,
} from '../controllers/exchange.controller';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(protect);

router.get('/sent', getSentExchanges);
router.get('/received', getReceivedExchanges);
router.get('/:id', getExchangeById);

router.post(
  '/',
  [
    body('receiverId').notEmpty().withMessage('Receiver ID is required'),
    body('message').trim().notEmpty().withMessage('Introduction message is required'),
    validate,
  ],
  createExchange
);

router.put('/:id/accept', acceptExchange);
router.put('/:id/reject', rejectExchange);
router.put('/:id/cancel', cancelExchange);
router.put('/:id/complete', completeExchange);

export default router;
