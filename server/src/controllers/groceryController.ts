import { Request, Response } from 'express';
import GroceryList from '../models/GroceryList';
import mongoose from 'mongoose';

// @desc    Get all grocery lists for a user
// @route   GET /api/grocery/lists
// @access  Private
export const getLists = async (req: Request, res: Response) => {
  try {
    const lists = await GroceryList.find({ user: req.user._id });
    res.json(lists);
  } catch (err) {
    const error = err as Error; // Type assertion
    res.status(500);
    res.json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Create a grocery list
// @route   POST /api/grocery/lists
// @access  Private
export const createList = async (req: Request, res: Response) => {
  try {
    const { name, isDefault } = req.body;

    if (!name) {
      res.status(400);
      throw new Error('Please provide a name for the list');
    }

    // If this list is set as default, update other lists
    if (isDefault) {
      await GroceryList.updateMany(
        { user: req.user._id, isDefault: true },
        { isDefault: false }
      );
    }

    const newList = await GroceryList.create({
      name,
      user: req.user._id,
      isDefault: isDefault || false,
      items: [],
    });

    res.status(201).json(newList);
  } catch (err) {
    const error = err as Error; // Type assertion
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Get grocery list by ID
// @route   GET /api/grocery/lists/:id
// @access  Private
export const getListById = async (req: Request, res: Response) => {
  try {
    const list = await GroceryList.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (list) {
      res.json(list);
    } else {
      res.status(404);
      throw new Error('List not found');
    }
  } catch (err) {
    const error = err as Error; // Type assertion
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Update grocery list
// @route   PUT /api/grocery/lists/:id
// @access  Private
export const updateList = async (req: Request, res: Response) => {
  try {
    const { name, isDefault, store, dateCompleted } = req.body;

    const list = await GroceryList.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!list) {
      res.status(404);
      throw new Error('List not found');
    }

    // If this list is being set as default, update other lists
    if (isDefault && !list.isDefault) {
      await GroceryList.updateMany(
        { user: req.user._id, isDefault: true },
        { isDefault: false }
      );
    }

    // Update list fields
    list.name = name || list.name;
    list.isDefault = isDefault !== undefined ? isDefault : list.isDefault;
    
    if (store) {
      // Use the appropriate ObjectId type
      list.store = new mongoose.Types.ObjectId(store);
    }
    
    if (dateCompleted !== undefined) {
      list.dateCompleted = dateCompleted ? new Date(dateCompleted) : undefined;
    }

    const updatedList = await list.save();
    res.json(updatedList);
  } catch (err) {
    const error = err as Error; // Type assertion
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Delete grocery list
// @route   DELETE /api/grocery/lists/:id
// @access  Private
export const deleteList = async (req: Request, res: Response) => {
  try {
    const list = await GroceryList.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!list) {
      res.status(404);
      throw new Error('List not found');
    }

    res.json({ message: 'List removed' });
  } catch (err) {
    const error = err as Error; // Type assertion
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Add item to grocery list
// @route   POST /api/grocery/items
// @access  Private
export const addItem = async (req: Request, res: Response) => {
  try {
    const { listId, name, quantity, unit, category, notes, expiryDate } = req.body;

    if (!listId || !name) {
      res.status(400);
      throw new Error('Please provide listId and item name');
    }

    const list = await GroceryList.findOne({
      _id: listId,
      user: req.user._id,
    });

    if (!list) {
      res.status(404);
      throw new Error('List not found');
    }

    // Add item to list
    list.items.push({
      name,
      quantity: quantity || 1,
      unit: unit || 'item',
      category: category || 'Other',
      isCompleted: false,
      notes,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
    });

    const updatedList = await list.save();
    res.status(201).json(updatedList);
  } catch (err) {
    const error = err as Error; // Type assertion
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Update item in grocery list
// @route   PUT /api/grocery/items/:itemId
// @access  Private
export const updateItem = async (req: Request, res: Response) => {
  try {
    const { listId, quantity, unit, isCompleted, notes, expiryDate } = req.body;
    const itemId = req.params.itemId;

    if (!listId) {
      res.status(400);
      throw new Error('Please provide listId');
    }

    const list = await GroceryList.findOne({
      _id: listId,
      user: req.user._id,
    });

    if (!list) {
      res.status(404);
      throw new Error('List not found');
    }

    // Find the item index in the items array by matching the string representation of _id
    const itemIndex = list.items.findIndex(
      item => item._id && item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      res.status(404);
      throw new Error('Item not found in list');
    }

    // Update item fields
    if (quantity !== undefined) list.items[itemIndex].quantity = quantity;
    if (unit) list.items[itemIndex].unit = unit;
    if (isCompleted !== undefined) list.items[itemIndex].isCompleted = isCompleted;
    if (notes !== undefined) list.items[itemIndex].notes = notes;
    if (expiryDate !== undefined) {
      list.items[itemIndex].expiryDate = expiryDate ? new Date(expiryDate) : undefined;
    }

    const updatedList = await list.save();
    res.json(updatedList);
  } catch (err) {
    const error = err as Error; // Type assertion
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Delete item from grocery list
// @route   DELETE /api/grocery/items/:itemId
// @access  Private
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { listId } = req.query as { listId?: string };
    const itemId = req.params.itemId;

    if (!listId) {
      res.status(400);
      throw new Error('Please provide listId');
    }

    const list = await GroceryList.findOne({
      _id: listId,
      user: req.user._id,
    });

    if (!list) {
      res.status(404);
      throw new Error('List not found');
    }

    // Remove the item from the items array by filtering based on _id string comparison
    list.items = list.items.filter(
      item => !item._id || item._id.toString() !== itemId
    );
    
    const updatedList = await list.save();
    res.json(updatedList);
  } catch (err) {
    const error = err as Error; // Type assertion
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};
