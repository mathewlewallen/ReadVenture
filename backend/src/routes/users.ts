import express, { Router, Request, Response } from 'express';

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

// Protected routes
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, validateUserUpdate, updateUser);
router.delete('/me', authenticate, deleteUser);

// Admin routes
router.get('/', authenticate, getAllUsers);
router.get('/:id', authenticate, getUserById);

// Password management
router.post(
  '/change-password',
  authenticate,
  async (_req: Request, _res: Response) => {
    _res
      .status(501)
      .json({ message: 'Password change functionality coming soon' });
  },
);

// Profile management
router.put('/profile', authenticate, async (_req: Request, _res: Response) => {
  _res
    .status(501)
    .json({ message: 'Profile update functionality coming soon' });
});

export default usersRouter;
