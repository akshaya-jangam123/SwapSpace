import { Router } from 'express';
import { getSmartMatches, getListingMatches } from '../controllers/match.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', protect, getSmartMatches);
router.get('/listing/:type/:id', getListingMatches);

export default router;
