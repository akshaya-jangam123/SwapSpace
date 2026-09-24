import { Request, Response } from 'express';
import { User } from '../models/User';
import { Skill } from '../models/Skill';
import { Item } from '../models/Item';
import { ExchangeRequest } from '../models/ExchangeRequest';
import { Review } from '../models/Review';
import { AuthRequest } from '../middleware/auth';

// @desc    Get user profile by ID with their listings and reviews
// @route   GET /api/users/:id
// @access  Public
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    const [skills, items, reviews, completedExchangesCount] = await Promise.all([
      Skill.find({ owner: user._id, isActive: true }).sort({ createdAt: -1 }),
      Item.find({ owner: user._id, isActive: true }).sort({ createdAt: -1 }),
      Review.find({ reviewee: user._id }).populate('reviewer', 'name avatar college').sort({ createdAt: -1 }),
      ExchangeRequest.countDocuments({
        $or: [{ sender: user._id }, { receiver: user._id }],
        status: 'Completed',
      }),
    ]);

    res.status(200).json({
      success: true,
      user,
      skills,
      items,
      reviews,
      completedExchangesCount,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user profile.',
    });
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/:id
// @access  Private (Own profile)
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;

    // Check ownership or admin
    if (req.user!._id.toString() !== userId && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'You are only authorized to update your own profile.',
      });
      return;
    }

    const {
      name,
      college,
      location,
      bio,
      avatar,
      skillsOffered,
      skillsWanted,
      itemsOffered,
      itemsWanted,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    if (name) user.name = name;
    if (college) user.college = college;
    if (location) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (skillsOffered) user.skillsOffered = Array.isArray(skillsOffered) ? skillsOffered : [skillsOffered];
    if (skillsWanted) user.skillsWanted = Array.isArray(skillsWanted) ? skillsWanted : [skillsWanted];
    if (itemsOffered) user.itemsOffered = Array.isArray(itemsOffered) ? itemsOffered : [itemsOffered];
    if (itemsWanted) user.itemsWanted = Array.isArray(itemsWanted) ? itemsWanted : [itemsWanted];

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile.',
    });
  }
};

// @desc    Get all users with search & filter
// @route   GET /api/users
// @access  Public
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, college, location } = req.query;

    const query: any = { isDisabled: false };

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [
        { name: searchRegex },
        { college: searchRegex },
        { location: searchRegex },
        { skillsOffered: searchRegex },
        { skillsWanted: searchRegex },
        { itemsOffered: searchRegex },
        { itemsWanted: searchRegex },
      ];
    }

    if (college) {
      query.college = new RegExp(String(college), 'i');
    }

    if (location) {
      query.location = new RegExp(String(location), 'i');
    }

    const users = await User.find(query).select('-password').sort({ avgRating: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve users.',
    });
  }
};

// @desc    Get current user dashboard statistics
// @route   GET /api/users/dashboard/stats
// @access  Private
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    const [skillsCount, itemsCount, activeSwapsCount, pendingSentCount, pendingReceivedCount, completedSwapsCount] =
      await Promise.all([
        Skill.countDocuments({ owner: userId, isActive: true }),
        Item.countDocuments({ owner: userId, isActive: true }),
        ExchangeRequest.countDocuments({
          $or: [{ sender: userId }, { receiver: userId }],
          status: 'Accepted',
        }),
        ExchangeRequest.countDocuments({ sender: userId, status: 'Pending' }),
        ExchangeRequest.countDocuments({ receiver: userId, status: 'Pending' }),
        ExchangeRequest.countDocuments({
          $or: [{ sender: userId }, { receiver: userId }],
          status: 'Completed',
        }),
      ]);

    // Fetch recent active exchanges
    const recentActiveExchanges = await ExchangeRequest.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: { $in: ['Pending', 'Accepted'] },
    })
      .populate('sender', 'name avatar college')
      .populate('receiver', 'name avatar college')
      .populate('offeredSkill')
      .populate('offeredItem')
      .populate('requestedSkill')
      .populate('requestedItem')
      .sort({ updatedAt: -1 })
      .limit(5);

    // Fetch user's listings
    const mySkills = await Skill.find({ owner: userId, isActive: true }).sort({ createdAt: -1 }).limit(4);
    const myItems = await Item.find({ owner: userId, isActive: true }).sort({ createdAt: -1 }).limit(4);

    res.status(200).json({
      success: true,
      stats: {
        totalListings: skillsCount + itemsCount,
        totalSkills: skillsCount,
        totalItems: itemsCount,
        activeSwaps: activeSwapsCount,
        pendingRequests: pendingSentCount + pendingReceivedCount,
        pendingSent: pendingSentCount,
        pendingReceived: pendingReceivedCount,
        completedSwaps: completedSwapsCount,
        avgRating: req.user!.avgRating,
        totalReviews: req.user!.totalReviews,
      },
      recentActiveExchanges,
      mySkills,
      myItems,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard stats.',
    });
  }
};
