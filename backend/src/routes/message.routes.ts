import { Router } from 'express';
import { body } from 'express-validator';
import {
  sendMessage,
  getExchangeMessages,
  getConversationsList,
} from '../controllers/message.controller';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(protect);

router.get('/conversations/list', getConversationsList);
router.get('/:exchangeId', getExchangeMessages);

router.post(
  '/',
  [
    body('exchangeId').notEmpty().withMessage('Exchange ID is required'),
    body('content').trim().notEmpty().withMessage('Message content cannot be empty'),
    validate,
  ],
  sendMessage
);

export default router;
