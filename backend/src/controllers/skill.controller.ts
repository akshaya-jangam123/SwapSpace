import { Request, Response } from 'express';
import { Skill } from '../models/Skill';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

// @desc    Create a new skill listing
// @route   POST /api/skills
// @access  Private
export const createSkill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category, description, level, availability, wantInExchange } = req.body;

    const skill = await Skill.create({
      owner: req.user!._id,
      name,
      category,
      description,
      level,
      availability,
      wantInExchange,
    });

    // Also add to user's skillsOffered if not already present
    await User.findByIdAndUpdate(req.user!._id, {
      $addToSet: { skillsOffered: name },
    });

    const populatedSkill = await Skill.findById(skill._id).populate('owner', 'name avatar college location avgRating totalReviews');

    res.status(201).json({
      success: true,
      message: 'Skill listing created successfully!',
      skill: populatedSkill,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create skill listing.',
    });
  }
};

// @desc    Get all skill listings with search and filters
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, level, location, college, limit = 50, page = 1 } = req.query;

    const query: any = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (level && level !== 'All') {
      query.level = level;
    }

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { wantInExchange: searchRegex },
        { category: searchRegex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    let skillsQuery = Skill.find(query)
      .populate('owner', 'name avatar college location avgRating totalReviews')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    let skills = await skillsQuery;

    // Filter by location / college if specified
    if (location) {
      const locRegex = new RegExp(String(location), 'i');
      skills = skills.filter((s: any) => s.owner && locRegex.test(s.owner.location));
    }

    if (college) {
      const colRegex = new RegExp(String(college), 'i');
      skills = skills.filter((s: any) => s.owner && colRegex.test(s.owner.college));
    }

    const total = await Skill.countDocuments(query);

    res.status(200).json({
      success: true,
      count: skills.length,
      total,
      skills,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch skill listings.',
    });
  }
};

// @desc    Get single skill by ID
// @route   GET /api/skills/:id
// @access  Public
export const getSkillById = async (req: Request, res: Response): Promise<void> => {
  try {
    const skill = await Skill.findById(req.params.id).populate(
      'owner',
      'name email avatar college location bio avgRating totalReviews skillsOffered itemsOffered'
    );

    if (!skill || !skill.isActive) {
      res.status(404).json({
        success: false,
        message: 'Skill listing not found or has been removed.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      skill,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch skill details.',
    });
  }
};

// @desc    Update skill listing
// @route   PUT /api/skills/:id
// @access  Private (Owner only)
export const updateSkill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404).json({
        success: false,
        message: 'Skill listing not found.',
      });
      return;
    }

    // Check ownership or admin
    if (skill.owner.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'You can only edit your own skill listings.',
      });
      return;
    }

    const { name, category, description, level, availability, wantInExchange, isActive } = req.body;

    if (name) skill.name = name;
    if (category) skill.category = category;
    if (description) skill.description = description;
    if (level) skill.level = level;
    if (availability) skill.availability = availability;
    if (wantInExchange) skill.wantInExchange = wantInExchange;
    if (isActive !== undefined) skill.isActive = isActive;

    await skill.save();

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully!',
      skill,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update skill.',
    });
  }
};

// @desc    Delete skill listing
// @route   DELETE /api/skills/:id
// @access  Private (Owner or Admin)
export const deleteSkill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404).json({
        success: false,
        message: 'Skill listing not found.',
      });
      return;
    }

    if (skill.owner.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'You can only delete your own skill listings.',
      });
      return;
    }

    await Skill.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Skill listing deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete skill listing.',
    });
  }
};

// @desc    Get listings created by current user
// @route   GET /api/skills/my/listings
// @access  Private
export const getMySkills = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const skills = await Skill.find({ owner: req.user!._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      skills,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch your skills.',
    });
  }
};
