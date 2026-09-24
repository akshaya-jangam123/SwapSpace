import { Router } from 'express';
import { body } from 'express-validator';
import {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  getMySkills,
} from '../controllers/skill.controller';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', getSkills);
router.get('/my/listings', protect, getMySkills);
router.get('/:id', getSkillById);

router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Skill name is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('level').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Level must be Beginner, Intermediate, or Advanced'),
    body('availability').trim().notEmpty().withMessage('Availability is required'),
    body('wantInExchange').trim().notEmpty().withMessage('What you want in exchange is required'),
    validate,
  ],
  createSkill
);

router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);

export default router;
