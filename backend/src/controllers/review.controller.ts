import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { ExchangeRequest } from '../models/ExchangeRequest';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

// @desc    Create rating and review after completed exchange
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { exchangeId, rating, comment } = req.body;
    const reviewerId = req.user!._id;

    if (!exchangeId || !rating || !comment) {
      res.status(400).json({
        success: false,
        message: 'Exchange ID, rating (1-5), and feedback comment are required.',
      });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5 stars.',
      });
      return;
    }

    const exchange = await ExchangeRequest.findById(exchangeId);
    if (!exchange) {
      res.status(404).json({
        success: false,
        message: 'Exchange request not found.',
      });
      return;
    }

    // Rule 5: Only completed exchanges can be reviewed
    if (exchange.status !== 'Completed') {
      res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted for completed exchanges.',
      });
      return;
    }

    // Check participant
    const isSender = exchange.sender.toString() === reviewerId.toString();
    const isReceiver = exchange.receiver.toString() === reviewerId.toString();

    if (!isSender && !isReceiver) {
      res.status(403).json({
        success: false,
        message: 'You were not a participant in this exchange.',
      });
      return;
    }

    const revieweeId = isSender ? exchange.receiver : exchange.sender;

    // Rule 6: Users cannot review the same exchange twice
    const existingReview = await Review.findOne({
      reviewer: reviewerId,
      exchange: exchangeId,
    });

    if (existingReview) {
      res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this exchange.',
      });
      return;
    }

    const review = await Review.create({
      reviewer: reviewerId,
      reviewee: revieweeId,
      exchange: exchangeId,
      rating,
      comment: comment.trim(),
    });

    // Update target user's avgRating & totalReviews
    const allUserReviews = await Review.find({ reviewee: revieweeId });
    const totalRatings = allUserReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRatings / allUserReviews.length).toFixed(1));

    await User.findByIdAndUpdate(revieweeId, {
      avgRating,
      totalReviews: allUserReviews.length,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'name avatar college')
      .populate('reviewee', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Review submitted successfully.',
      review: populatedReview,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit review.',
    });
  }
};

// @desc    Get all reviews for a specific user
// @route   GET /api/reviews/user/:userId
// @access  Public
export const getUserReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ reviewee: userId })
      .populate('reviewer', 'name avatar college location')
      .populate({
        path: 'exchange',
        populate: ['offeredSkill', 'offeredItem', 'requestedSkill', 'requestedItem'],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch reviews.',
    });
  }
};

// @desc    Get reviews given or received by current user
// @route   GET /api/reviews/my/all
// @access  Private
export const getMyReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    const [received, given] = await Promise.all([
      Review.find({ reviewee: userId })
        .populate('reviewer', 'name avatar college')
        .sort({ createdAt: -1 }),
      Review.find({ reviewer: userId })
        .populate('reviewee', 'name avatar college')
        .sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      received,
      given,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch your reviews.',
    });
  }
};
