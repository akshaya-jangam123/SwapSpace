import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, college, location, bio, skillsOffered, skillsWanted, itemsOffered, itemsWanted } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
      return;
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      college,
      location,
      bio: bio || '',
      skillsOffered: skillsOffered || [],
      skillsWanted: skillsWanted || [],
      itemsOffered: itemsOffered || [],
      itemsWanted: itemsWanted || [],
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        location: user.location,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
        itemsOffered: user.itemsOffered,
        itemsWanted: user.itemsWanted,
        avgRating: user.avgRating,
        totalReviews: user.totalReviews,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed.',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    if (user.isDisabled) {
      res.status(403).json({
        success: false,
        message: 'Your account has been suspended by an administrator.',
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        location: user.location,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
        itemsOffered: user.itemsOffered,
        itemsWanted: user.itemsWanted,
        avgRating: user.avgRating,
        totalReviews: user.totalReviews,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed.',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        location: user.location,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
        itemsOffered: user.itemsOffered,
        itemsWanted: user.itemsWanted,
        avgRating: user.avgRating,
        totalReviews: user.totalReviews,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user data.',
    });
  }
};
