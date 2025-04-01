import { Request, Response } from 'express';
import Store from '../models/Store';

// @desc    Get all stores
// @route   GET /api/stores
// @access  Private
export const getStores = async (req: Request, res: Response) => {
  try {
    const stores = await Store.find({ isActive: true });
    res.json(stores);
  } catch (err) {
    const error = err as Error; // Type assertion
    res.status(500);
    res.json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Get store by ID
// @route   GET /api/stores/:id
// @access  Private
export const getStoreById = async (req: Request, res: Response) => {
  try {
    const store = await Store.findById(req.params.id);
    
    if (store) {
      res.json(store);
    } else {
      res.status(404);
      throw new Error('Store not found');
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

// @desc    Search products from a store
// @route   GET /api/stores/:id/products
// @access  Private
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const storeId = req.params.id;
    const query = req.query.query as string || '';
    
    const store = await Store.findById(storeId);
    if (!store) {
      res.status(404);
      throw new Error('Store not found');
    }
    
    // In a real implementation, this would integrate with the store's API
    // For now, returning sample data
    const sampleProducts = [
      { id: '1', name: 'Milk', price: 3.99, available: true, category: 'Dairy' },
      { id: '2', name: 'Eggs', price: 2.49, available: true, category: 'Dairy' },
      { id: '3', name: 'Bread', price: 1.99, available: true, category: 'Bakery' }
    ];
    
    // Filter by query if provided
    const filteredProducts = query 
      ? sampleProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
      : sampleProducts;
    
    res.json(filteredProducts);
  } catch (err) {
    const error = err as Error; // Type assertion
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};
