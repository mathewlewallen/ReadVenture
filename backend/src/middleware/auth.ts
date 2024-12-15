import { NextFunction, Router } from 'express';
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import { ParsedQs } from 'qs';
import { Collection, ObjectId } from 'mongodb';

// Define types for token payload and extended request
interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

interface AuthRequest extends Request {
  user?: TokenPayload;
}

// Define interface for User
interface User {
  _id: ObjectId;
  role: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  lastLogin: Date;
  status: 'active' | 'inactive' | 'suspended';
}

// Ensure db is properly typed
declare const db: {
  collection(name: string): Collection;
};

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

    // Convert string ID to ObjectId
    const userId = new ObjectId(req.user.userId);

    // Update the query with proper typing
    const user = await db.collection('users').findOne<User>({ _id: userId });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.role !== 'admin') {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    next();
  } catch (error) {
    // Add more specific error handling
    if (error instanceof Error && error.name === 'BSONTypeError') {
      res.status(400).json({ message: 'Invalid user ID format' });
      return;
    }
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
function resetPassword(_req: Request<{}, any, any, ParsedQs, Record<string, any>>, _res: Response<any, Record<string, any>, number>) {
  throw new Error('Function not implemented.');
}

function verifyEmail(_req: Request<{}, any, any, ParsedQs, Record<string, any>>, _res: Response<any, Record<string, any>, number>) {
  throw new Error('Function not implemented.');
}

function refreshToken(_req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, _res: Response<any, Record<string, any>, number>) {
  throw new Error('Function not implemented.');
}

