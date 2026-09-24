import { Request, Response } from 'express';
import { User } from '../models/User';
import { Skill } from '../models/Skill';
import { Item } from '../models/Item';
import { ExchangeRequest } from '../models/ExchangeRequest';
import { Report } from '../models/Report';
import { Review } from '../models/Review';
import { AuthRequest } from '../middleware/auth';

// @desc    Get comprehensive admin platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalSkills,
      totalItems,
      activeExchanges,
      completedExchanges,
      pendingReports,
      totalReviews,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Skill.countDocuments({ isActive: true }),
      Item.countDocuments({ isActive: true }),
      ExchangeRequest.countDocuments({ status: { $in: ['Pending', 'Accepted'] } }),
      ExchangeRequest.countDocuments({ status: 'Completed' }),
      Report.countDocuments({ status: 'Pending' }),
      Review.countDocuments(),
    ]);

    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(6);
    const recentExchanges = await ExchangeRequest.find()
      .populate('sender', 'name avatar college')
      .populate('receiver', 'name avatar college')
      .populate('offeredSkill')
      .populate('offeredItem')
      .populate('requestedSkill')
      .populate('requestedItem')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalSkills,
        totalItems,
        activeExchanges,
        completedExchanges,
        pendingReports,
        totalReviews,
      },
      recentUsers,
      recentExchanges,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch admin stats.',
    });
  }
};

// @desc    Toggle user status (Enable / Disable)
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin)
export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    if (user.role === 'admin') {
      res.status(400).json({
        success: false,
        message: 'Cannot disable an administrator account.',
      });
      return;
    }

    user.isDisabled = !user.isDisabled;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isDisabled ? 'disabled' : 'enabled'} successfully.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isDisabled: user.isDisabled,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to toggle user status.',
    });
  }
};

// @desc    Admin delete inappropriate skill listing
// @route   DELETE /api/admin/skills/:id
// @access  Private (Admin)
export const deleteSkillAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      res.status(404).json({ success: false, message: 'Skill listing not found.' });
      return;
    }

    await Skill.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Skill listing removed by moderator.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete skill.',
    });
  }
};

// @desc    Admin delete inappropriate item listing
// @route   DELETE /api/admin/items/:id
// @access  Private (Admin)
export const deleteItemAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Item listing not found.' });
      return;
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item listing removed by moderator.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete item.',
    });
  }
};

// @desc    Get all exchange requests for admin review
// @route   GET /api/admin/exchanges
// @access  Private (Admin)
export const getAllExchangesAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const exchanges = await ExchangeRequest.find()
      .populate('sender', 'name email college')
      .populate('receiver', 'name email college')
      .populate('offeredSkill')
      .populate('offeredItem')
      .populate('requestedSkill')
      .populate('requestedItem')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: exchanges.length,
      exchanges,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch platform exchanges.',
    });
  }
};
