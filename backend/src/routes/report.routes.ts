import { Router } from 'express';
import { body } from 'express-validator';
import { createReport, getReports, updateReportStatus } from '../controllers/report.controller';
import { protect, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(protect);

router.post(
  '/',
  [
    body('targetType').isIn(['User', 'Skill', 'Item', 'Message']).withMessage('Invalid target type'),
    body('targetId').notEmpty().withMessage('Target ID is required'),
    body('reason').trim().notEmpty().withMessage('Report reason is required'),
    body('description').trim().notEmpty().withMessage('Report description is required'),
    validate,
  ],
  createReport
);

router.get('/', requireAdmin, getReports);
router.put('/:id', requireAdmin, updateReportStatus);

export default router;
