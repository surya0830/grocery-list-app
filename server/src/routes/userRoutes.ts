import express from 'express';
import { 
  loginUser, 
  registerUser, 
  getUserProfile, 
  updateUserProfile 
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/register', registerUser);

// Protected routes (require authentication)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
