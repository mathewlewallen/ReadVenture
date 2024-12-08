import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Define types for token payload and extended request
interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

interface AuthRequest extends Request {
  user?: TokenPayload;
}

/**
 * Middleware to authenticate requests using JWT tokens
 * @param req - Express request object with auth header
 * @param res - Express response object
 * @param next - Express next function
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Extract authorization header
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      res.status(401).json({ message: 'No authorization header found' });
      return;
    }

    // Clean and validate token
    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    // Verify JWT secret exists
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    // Verify and decode token
    const decoded = jwt.verify(token, secret) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
      return;
    }
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Middleware to check if authenticated user is an admin
 * @param req - Express request object with user data
 * @param res - Express response object
 * @param next - Express next function
 */
export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // TODO: Implement proper admin check logic
    // Example: Check user role in database
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Router configuration
const router = Router();

/**
 * Auth routes configuration
 */
router.post('/reset-password', async (req, res) => {
  try {
    await resetPassword(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Password reset failed' });
  }
});

router.post('/verify-email', async (req, res) => {
  try {
    await verifyEmail(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Email verification failed' });
  }
});

router.post('/refresh-token', authenticate, async (req, res) => {
  try {
    await refreshToken(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Token refresh failed' });
  }
});

export default router;
