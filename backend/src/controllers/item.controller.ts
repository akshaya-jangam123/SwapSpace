import { Request, Response } from 'express';
import { Item } from '../models/Item';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

// @desc    Create a new item listing
// @route   POST /api/items
// @access  Private
export const createItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category, description, condition, imageUrl, availability, wantInExchange } = req.body;

    const item = await Item.create({
      owner: req.user!._id,
      name,
      category,
      description,
      condition,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
      availability,
      wantInExchange,
    });

    // Also add to user's itemsOffered if not already present
    await User.findByIdAndUpdate(req.user!._id, {
      $addToSet: { itemsOffered: name },
    });

    const populatedItem = await Item.findById(item._id).populate('owner', 'name avatar college location avgRating totalReviews');

    res.status(201).json({
      success: true,
      message: 'Item listing created successfully!',
      item: populatedItem,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create item listing.',
    });
  }
};

// @desc    Get all item listings with search and filters
// @route   GET /api/items
// @access  Public
export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, condition, location, college, limit = 50, page = 1 } = req.query;

    const query: any = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (condition && condition !== 'All') {
      query.condition = condition;
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

    let items = await Item.find(query)
      .populate('owner', 'name avatar college location avgRating totalReviews')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Filter by location / college if specified
    if (location) {
      const locRegex = new RegExp(String(location), 'i');
      items = items.filter((it: any) => it.owner && locRegex.test(it.owner.location));
    }

    if (college) {
      const colRegex = new RegExp(String(college), 'i');
      items = items.filter((it: any) => it.owner && colRegex.test(it.owner.college));
    }

    const total = await Item.countDocuments(query);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      items,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch item listings.',
    });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'owner',
      'name email avatar college location bio avgRating totalReviews skillsOffered itemsOffered'
    );

    if (!item || !item.isActive) {
      res.status(404).json({
        success: false,
        message: 'Item listing not found or has been removed.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch item details.',
    });
  }
};

// @desc    Update item listing
// @route   PUT /api/items/:id
// @access  Private (Owner only)
export const updateItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item listing not found.',
      });
      return;
    }

    if (item.owner.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'You can only edit your own item listings.',
      });
      return;
    }

    const { name, category, description, condition, imageUrl, availability, wantInExchange, isActive } = req.body;

    if (name) item.name = name;
    if (category) item.category = category;
    if (description) item.description = description;
    if (condition) item.condition = condition;
    if (imageUrl !== undefined) item.imageUrl = imageUrl;
    if (availability) item.availability = availability;
    if (wantInExchange) item.wantInExchange = wantInExchange;
    if (isActive !== undefined) item.isActive = isActive;

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Item updated successfully!',
      item,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update item.',
    });
  }
};

// @desc    Delete item listing
// @route   DELETE /api/items/:id
// @access  Private (Owner or Admin)
export const deleteItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item listing not found.',
      });
      return;
    }

    if (item.owner.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'You can only delete your own item listings.',
      });
      return;
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item listing deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete item listing.',
    });
  }
};

// @desc    Get item listings created by current user
// @route   GET /api/items/my/listings
// @access  Private
export const getMyItems = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const items = await Item.find({ owner: req.user!._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      items,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch your items.',
    });
  }
};
