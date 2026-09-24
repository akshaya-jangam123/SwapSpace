import { Request, Response } from 'express';
import { ExchangeRequest } from '../models/ExchangeRequest';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

// @desc    Create new exchange request
// @route   POST /api/exchanges
// @access  Private
export const createExchange = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      receiverId,
      exchangeType = 'Skill',
      offeredSkill,
      offeredItem,
      requestedSkill,
      requestedItem,
      customOfferText,
      customRequestText,
      message,
    } = req.body;

    const senderId = req.user!._id;

    // Rule 1: Cannot exchange with self
    if (senderId.toString() === receiverId) {
      res.status(400).json({
        success: false,
        message: 'You cannot send an exchange request to yourself.',
      });
      return;
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      res.status(404).json({
        success: false,
        message: 'Recipient user not found.',
      });
      return;
    }

    // Check if an identical active pending request already exists
    const existingPending = await ExchangeRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: 'Pending',
      ...(offeredSkill && { offeredSkill }),
      ...(offeredItem && { offeredItem }),
      ...(requestedSkill && { requestedSkill }),
      ...(requestedItem && { requestedItem }),
    });

    if (existingPending) {
      res.status(400).json({
        success: false,
        message: 'You already have an active pending exchange request with this user for these items/skills.',
      });
      return;
    }

    const exchange = await ExchangeRequest.create({
      sender: senderId,
      receiver: receiverId,
      exchangeType,
      offeredSkill: offeredSkill || undefined,
      offeredItem: offeredItem || undefined,
      requestedSkill: requestedSkill || undefined,
      requestedItem: requestedItem || undefined,
      customOfferText: customOfferText || '',
      customRequestText: customRequestText || '',
      message,
      status: 'Pending',
    });

    const populatedExchange = await ExchangeRequest.findById(exchange._id)
      .populate('sender', 'name avatar college location')
      .populate('receiver', 'name avatar college location')
      .populate('offeredSkill')
      .populate('offeredItem')
      .populate('requestedSkill')
      .populate('requestedItem');

    res.status(201).json({
      success: true,
      message: 'Exchange request sent successfully!',
      exchange: populatedExchange,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create exchange request.',
    });
  }
};

// @desc    Get sent exchange requests for current user
// @route   GET /api/exchanges/sent
// @access  Private
export const getSentExchanges = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const exchanges = await ExchangeRequest.find({ sender: req.user!._id })
      .populate('receiver', 'name avatar college location')
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
      message: error.message || 'Failed to fetch sent exchange requests.',
    });
  }
};

// @desc    Get received exchange requests for current user
// @route   GET /api/exchanges/received
// @access  Private
export const getReceivedExchanges = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const exchanges = await ExchangeRequest.find({ receiver: req.user!._id })
      .populate('sender', 'name avatar college location')
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
      message: error.message || 'Failed to fetch received exchange requests.',
    });
  }
};

// @desc    Get single exchange request by ID
// @route   GET /api/exchanges/:id
// @access  Private (Participant or Admin)
export const getExchangeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const exchange = await ExchangeRequest.findById(req.params.id)
      .populate('sender', 'name email avatar college location bio avgRating totalReviews skillsOffered itemsOffered')
      .populate('receiver', 'name email avatar college location bio avgRating totalReviews skillsOffered itemsOffered')
      .populate('offeredSkill')
      .populate('offeredItem')
      .populate('requestedSkill')
      .populate('requestedItem');

    if (!exchange) {
      res.status(404).json({
        success: false,
        message: 'Exchange request not found.',
      });
      return;
    }

    const isSender = exchange.sender._id.toString() === req.user!._id.toString();
    const isReceiver = exchange.receiver._id.toString() === req.user!._id.toString();
    const isAdmin = req.user!.role === 'admin';

    if (!isSender && !isReceiver && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'You are not authorized to view this exchange details.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      exchange,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch exchange details.',
    });
  }
};

// @desc    Accept exchange request
// @route   PUT /api/exchanges/:id/accept
// @access  Private (Receiver only)
export const acceptExchange = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const exchange = await ExchangeRequest.findById(req.params.id);

    if (!exchange) {
      res.status(404).json({
        success: false,
        message: 'Exchange request not found.',
      });
      return;
    }

    // Rule 2 & 4: Only the receiver can accept a request
    if (exchange.receiver.toString() !== req.user!._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Only the recipient of this request can accept it.',
      });
      return;
    }

    if (exchange.status !== 'Pending') {
      res.status(400).json({
        success: false,
        message: `Cannot accept an exchange that is currently ${exchange.status}.`,
      });
      return;
    }

    exchange.status = 'Accepted';
    await exchange.save();

    const updatedExchange = await ExchangeRequest.findById(exchange._id)
      .populate('sender', 'name avatar college location')
      .populate('receiver', 'name avatar college location')
      .populate('offeredSkill')
      .populate('offeredItem')
      .populate('requestedSkill')
      .populate('requestedItem');

    res.status(200).json({
      success: true,
      message: 'Exchange request accepted! You can now chat and coordinate the exchange.',
      exchange: updatedExchange,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to accept exchange request.',
    });
  }
};

// @desc    Reject exchange request
// @route   PUT /api/exchanges/:id/reject
// @access  Private (Receiver only)
export const rejectExchange = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const exchange = await ExchangeRequest.findById(req.params.id);

    if (!exchange) {
      res.status(404).json({
        success: false,
        message: 'Exchange request not found.',
      });
      return;
    }

    // Only the receiver can reject a request
    if (exchange.receiver.toString() !== req.user!._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Only the recipient of this request can reject it.',
      });
      return;
    }

    if (exchange.status !== 'Pending') {
      res.status(400).json({
        success: false,
        message: `Cannot reject an exchange that is currently ${exchange.status}.`,
      });
      return;
    }

    exchange.status = 'Rejected';
    await exchange.save();

    res.status(200).json({
      success: true,
      message: 'Exchange request declined.',
      exchange,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject exchange request.',
    });
  }
};

// @desc    Cancel exchange request
// @route   PUT /api/exchanges/:id/cancel
// @access  Private (Sender or Receiver)
export const cancelExchange = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const exchange = await ExchangeRequest.findById(req.params.id);

    if (!exchange) {
      res.status(404).json({
        success: false,
        message: 'Exchange request not found.',
      });
      return;
    }

    const isSender = exchange.sender.toString() === req.user!._id.toString();
    const isReceiver = exchange.receiver.toString() === req.user!._id.toString();

    if (!isSender && !isReceiver) {
      res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this exchange.',
      });
      return;
    }

    if (exchange.status === 'Completed') {
      res.status(400).json({
        success: false,
        message: 'Completed exchanges cannot be cancelled.',
      });
      return;
    }

    exchange.status = 'Cancelled';
    await exchange.save();

    res.status(200).json({
      success: true,
      message: 'Exchange has been cancelled.',
      exchange,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel exchange.',
    });
  }
};

// @desc    Mark exchange as completed
// @route   PUT /api/exchanges/:id/complete
// @access  Private (Participants)
export const completeExchange = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const exchange = await ExchangeRequest.findById(req.params.id);

    if (!exchange) {
      res.status(404).json({
        success: false,
        message: 'Exchange request not found.',
      });
      return;
    }

    const isSender = exchange.sender.toString() === req.user!._id.toString();
    const isReceiver = exchange.receiver.toString() === req.user!._id.toString();

    if (!isSender && !isReceiver) {
      res.status(403).json({
        success: false,
        message: 'Only participants in this exchange can mark it as completed.',
      });
      return;
    }

    if (exchange.status !== 'Accepted') {
      res.status(400).json({
        success: false,
        message: 'Only accepted exchanges can be marked as completed.',
      });
      return;
    }

    if (isSender) {
      exchange.completedBySender = true;
    }
    if (isReceiver) {
      exchange.completedByReceiver = true;
    }

    // Mark as completed
    exchange.status = 'Completed';
    await exchange.save();

    const updatedExchange = await ExchangeRequest.findById(exchange._id)
      .populate('sender', 'name avatar college location')
      .populate('receiver', 'name avatar college location')
      .populate('offeredSkill')
      .populate('offeredItem')
      .populate('requestedSkill')
      .populate('requestedItem');

    res.status(200).json({
      success: true,
      message: 'Exchange marked as completed! You can now leave a rating and review.',
      exchange: updatedExchange,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete exchange.',
    });
  }
};
