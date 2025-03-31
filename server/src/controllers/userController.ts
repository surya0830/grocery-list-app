import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Generate JWT token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        preferences: user.preferences,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
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

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate request
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      preferences: {
        defaultStores: [],
        dietaryRestrictions: [],
        notifications: true,
      },
    });

    if (user) {
      // Return user data with token
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        preferences: user.preferences,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
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

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        preferences: user.preferences,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update fields if provided in request
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.preferences) {
        user.preferences = {
          ...user.preferences,
          ...req.body.preferences,
        };
      }
      
      // Update password if provided
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        preferences: updatedUser.preferences,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('User not found');
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
