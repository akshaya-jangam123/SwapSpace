import { Router } from 'express';
import { getUserById, updateUser, getUsers, getDashboardStats } from '../controllers/user.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getUsers);
router.get('/dashboard/stats', protect, getDashboardStats);
router.get('/:id', getUserById);
router.put('/:id', protect, updateUser);

export default router;
