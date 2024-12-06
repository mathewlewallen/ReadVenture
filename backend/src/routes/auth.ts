import express, { Router, Request, Response } from 'express';
import { register, login } from '../controllers/users';
import { validateRegistration, validateLogin } from '../middleware/validation';
import { errorHandler } from '../middleware/errorHandler';

const router: Router = express.Router();

// Authentication routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Password reset routes
router.post('/forgot-password', async (_req: Request, res: Response) => {
  // Temporary response until implementation
  res.status(501).json({ message: 'Password reset functionality coming soon' });
});

router.post('/reset-password', async (_req: Request, res: Response) => {
  // Temporary response until implementation
  res.status(501).json({ message: 'Password reset functionality coming soon' });
});

// Error handling
router.use(errorHandler);

export default router;