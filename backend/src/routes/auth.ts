import express, { Router, Request, Response } from 'express';
import { register, login } from '../controllers/users';
import { validateRegistration, validateLogin } from '../middleware/validation';
import { errorHandler } from '../middleware/errorHandler';
import { resetPassword, verifyEmail, refreshToken } from '../controllers/auth';

const router: Router = express.Router();

// Authentication routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Password reset routes
router.post('/forgot-password', async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Password reset functionality coming soon' });
});

// Error handling
router.use(errorHandler);

// Authentication endpoints
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    await resetPassword(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

router.post('/verify-email', async (req: Request, res: Response) => {
  try {
    await verifyEmail(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify email' });
  }
});

router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    await refreshToken(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Failed to refresh token' });
  }
});

router.post('/logout', async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Logout functionality coming soon' });
});

router.post('/validate-token', async (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Token validation coming soon' });
});

router.post('/change-password', async (_req: Request, res: Response) => {
  res
    .status(501)
    .json({ message: 'Password change functionality coming soon' });
});

export default router;
