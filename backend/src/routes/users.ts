import express, { Router, Request, Response, NextFunction } from 'express';

import {
  getMe,
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
} from '../controllers/users';
import { authenticate } from '../middleware/auth';
import { validateUserUpdate } from '../middleware/validation';

const router: Router = express.Router();

type ControllerHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// Protected routes
router.get('/me', authenticate, getMe as ControllerHandler);
router.put('/me', authenticate, validateUserUpdate, updateUser as ControllerHandler);
router.delete('/me', authenticate, deleteUser as ControllerHandler);

// Admin routes
router.get('/', authenticate, getAllUsers as ControllerHandler);
router.get('/:id', authenticate, getUserById as ControllerHandler);

// Password management
router.post(
  '/change-password',
  authenticate,
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(501).json({ message: 'Password change functionality coming soon' });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/profile',
  authenticate,
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(501).json({ message: 'Profile update functionality coming soon' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
