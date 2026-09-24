import { Request, Response } from 'express';
import { User } from '../models/User';
import { Skill } from '../models/Skill';
import { Item } from '../models/Item';
import { AuthRequest } from '../middleware/auth';
import { calculateUserMatch, hasOverlap } from '../utils/matchScore';

// @desc    Get smart matches for current logged-in user
// @route   GET /api/matches
// @access  Private
export const getSmartMatches = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!._id;

    // Fetch current user with their wants and offers
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    // Fetch all other active users
    const otherUsers = await User.find({
      _id: { $ne: currentUserId },
      isDisabled: false,
    }).select('-password');

    // Calculate match for each user
    const matches = otherUsers
      .map(otherUser => calculateUserMatch(currentUser, otherUser))
      .filter(match => match.score >= 30) // Only return meaningful matches
      .sort((a, b) => b.score - a.score);

    // Group into perfect matches and one-way matches
    const perfectMatches = matches.filter(m => m.matchType === 'perfect');
    const oneWayMatches = matches.filter(m => m.matchType === 'one-way' || m.matchType === 'partial');

    res.status(200).json({
      success: true,
      totalMatches: matches.length,
      perfectCount: perfectMatches.length,
      oneWayCount: oneWayMatches.length,
      perfectMatches,
      oneWayMatches,
      allMatches: matches,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to calculate smart matches.',
    });
  }
};

// @desc    Get compatible listings for a specific skill or item
// @route   GET /api/matches/listing/:type/:id
// @access  Public
export const getListingMatches = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, id } = req.params;

    if (type === 'skill') {
      const skill = await Skill.findById(id).populate('owner', 'name avatar college location');
      if (!skill) {
        res.status(404).json({ success: false, message: 'Skill not found.' });
        return;
      }

      // Find skills where the other person's name matches what this skill wants,
      // or where what the other person wants matches this skill's name
      const otherSkills = await Skill.find({
        _id: { $ne: skill._id },
        owner: { $ne: skill.owner._id },
        isActive: true,
      }).populate('owner', 'name avatar college location');

      const matches = otherSkills
        .map(other => {
          const directMatch = hasOverlap(skill.wantInExchange, other.name);
          const reverseMatch = hasOverlap(other.wantInExchange, skill.name);

          let score = 30;
          let matchType = 'partial';

          if (directMatch && reverseMatch) {
            score = 95;
            matchType = 'perfect';
          } else if (directMatch) {
            score = 75;
            matchType = 'one-way';
          } else if (reverseMatch) {
            score = 65;
            matchType = 'one-way';
          }

          return {
            listing: other,
            type: 'skill',
            score,
            matchType,
            description: directMatch && reverseMatch
              ? `They offer ${other.name} (which you want) and want ${skill.name} (which you offer)!`
              : directMatch
              ? `They offer ${other.name}, matching your exchange wish.`
              : `They want ${skill.name}, matching your offer.`,
          };
        })
        .filter(m => m.score >= 50)
        .sort((a, b) => b.score - a.score);

      res.status(200).json({ success: true, matches });
      return;
    }

    if (type === 'item') {
      const item = await Item.findById(id).populate('owner', 'name avatar college location');
      if (!item) {
        res.status(404).json({ success: false, message: 'Item not found.' });
        return;
      }

      const otherItems = await Item.find({
        _id: { $ne: item._id },
        owner: { $ne: item.owner._id },
        isActive: true,
      }).populate('owner', 'name avatar college location');

      const matches = otherItems
        .map(other => {
          const directMatch = hasOverlap(item.wantInExchange, other.name);
          const reverseMatch = hasOverlap(other.wantInExchange, item.name);

          let score = 30;
          let matchType = 'partial';

          if (directMatch && reverseMatch) {
            score = 95;
            matchType = 'perfect';
          } else if (directMatch) {
            score = 75;
            matchType = 'one-way';
          } else if (reverseMatch) {
            score = 65;
            matchType = 'one-way';
          }

          return {
            listing: other,
            type: 'item',
            score,
            matchType,
            description: directMatch && reverseMatch
              ? `They offer ${other.name} (which you want) and want ${item.name} (which you offer)!`
              : directMatch
              ? `They offer ${other.name}, matching your exchange wish.`
              : `They want ${item.name}, matching your offer.`,
          };
        })
        .filter(m => m.score >= 50)
        .sort((a, b) => b.score - a.score);

      res.status(200).json({ success: true, matches });
      return;
    }

    res.status(400).json({ success: false, message: 'Invalid listing type. Must be "skill" or "item".' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to match listing.',
    });
  }
};
