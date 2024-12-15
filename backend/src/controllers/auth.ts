import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModel from '../models/User';

/**
 * Handle password reset request
 */
export async function resetPassword({ req, res }: { req: Request; res: Response; }): Promise<void> {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const MIN_PASSWORD_LENGTH = 8;
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      res.status(400).json({ message: 'Password must be at least 8 characters' });
      return;
    }

    // Find user and verify reset token
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const secret = `${process.env.JWT_SECRET}${user.password}`;
    try {
      jwt.verify(token, secret);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ message: 'Invalid token' });
        return;
      }
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: 'Token expired' });
        return;
      }
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password using proper ObjectId
    await UserModel.findByIdAndUpdate(user._id, { password: hashedPassword });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Handle email verification
 */
export async function verifyEmail({ req, res }: { req: Request; res: Response; }): Promise<void> {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({ message: 'Verification token is required' });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; };

    // Update user's email verification status using type-safe update
    const updateResult = await UserModel.findByIdAndUpdate(
      decoded.userId,
      { $set: { emailVerified: true } }
    );

    if (!updateResult) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
      return;
    }
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Invalid or expired verification token' });
  }
}

/**
 * Handle token refresh
 */
export async function refreshToken({ req, res }: { req: Request; res: Response; }): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token is required' });
      return;
    }

    // Verify and decode refresh token to get user ID
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as { userId: string; };

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
      return;
    }
    console.error('Token refresh error:', error);
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
}

/**
 * Handle authentication errors
 */
export const handleAuthError = (error: unknown, res: Response): void => {
  console.error('Auth error:', error);
  res.status(500).json({ message: 'Authentication error occurred' });
};
