import { Request, Response } from 'express';
import { Message } from '../models/Message';
import { ExchangeRequest } from '../models/ExchangeRequest';
import { AuthRequest } from '../middleware/auth';

// @desc    Send a message in an accepted exchange conversation
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { exchangeId, content } = req.body;
    const senderId = req.user!._id;

    if (!exchangeId || !content || !content.trim()) {
      res.status(400).json({
        success: false,
        message: 'Exchange ID and message content are required.',
      });
      return;
    }

    const exchange = await ExchangeRequest.findById(exchangeId);
    if (!exchange) {
      res.status(404).json({
        success: false,
        message: 'Exchange not found.',
      });
      return;
    }

    // Check if user is participant
    const isSender = exchange.sender.toString() === senderId.toString();
    const isReceiver = exchange.receiver.toString() === senderId.toString();

    if (!isSender && !isReceiver) {
      res.status(403).json({
        success: false,
        message: 'You are not a participant in this exchange conversation.',
      });
      return;
    }

    // Determine receiver
    const receiverId = isSender ? exchange.receiver : exchange.sender;

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      exchange: exchangeId,
      content: content.trim(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send message.',
    });
  }
};

// @desc    Get all messages for an exchange conversation
// @route   GET /api/messages/:exchangeId
// @access  Private
export const getExchangeMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { exchangeId } = req.params;
    const userId = req.user!._id;

    const exchange = await ExchangeRequest.findById(exchangeId);
    if (!exchange) {
      res.status(404).json({
        success: false,
        message: 'Exchange not found.',
      });
      return;
    }

    const isSender = exchange.sender.toString() === userId.toString();
    const isReceiver = exchange.receiver.toString() === userId.toString();

    if (!isSender && !isReceiver && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'You are not authorized to view this conversation.',
      });
      return;
    }

    // Mark unread messages sent to current user as read
    await Message.updateMany(
      { exchange: exchangeId, receiver: userId, isRead: false },
      { $set: { isRead: true } }
    );

    const messages = await Message.find({ exchange: exchangeId })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch messages.',
    });
  }
};

// @desc    Get list of all active conversations for current user
// @route   GET /api/messages/conversations/list
// @access  Private
export const getConversationsList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    // Find all exchanges where the user is a participant and status is Accepted or Completed
    const exchanges = await ExchangeRequest.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: { $in: ['Accepted', 'Completed'] },
    })
      .populate('sender', 'name avatar college location')
      .populate('receiver', 'name avatar college location')
      .populate('offeredSkill')
      .populate('offeredItem')
      .populate('requestedSkill')
      .populate('requestedItem')
      .sort({ updatedAt: -1 });

    // Fetch the last message and unread count for each exchange
    const conversations = await Promise.all(
      exchanges.map(async exchange => {
        const lastMessage = await Message.findOne({ exchange: exchange._id })
          .populate('sender', 'name')
          .sort({ createdAt: -1 });

        const unreadCount = await Message.countDocuments({
          exchange: exchange._id,
          receiver: userId,
          isRead: false,
        });

        const otherUser =
          exchange.sender._id.toString() === userId.toString()
            ? exchange.receiver
            : exchange.sender;

        return {
          exchange,
          otherUser,
          lastMessage,
          unreadCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch conversations.',
    });
  }
};
