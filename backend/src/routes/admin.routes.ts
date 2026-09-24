import { Router } from 'express';
import {
  getAdminStats,
  toggleUserStatus,
  deleteSkillAdmin,
  deleteItemAdmin,
  getAllExchangesAdmin,
} from '../controllers/admin.controller';
import { protect, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(protect);
router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/exchanges', getAllExchangesAdmin);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/skills/:id', deleteSkillAdmin);
router.delete('/items/:id', deleteItemAdmin);

export default router;
