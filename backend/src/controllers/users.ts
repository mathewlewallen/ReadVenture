import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/User';

interface AuthRequest extends Request {
  user?: { id: string };
}

interface RegisterRequest {
  username: string;
  password: string;
  parentEmail: string;
  parentConsent?: boolean;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface TokenPayload {
  userId: string;
}

interface UserResponse {
  id: string;
  username: string;
  parentEmail: string;
  parentConsent: boolean;
  createdAt: Date;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ userId } as TokenPayload, secret, { expiresIn: '24h' });
};

export type ControllerHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const register = async (
  req: Request<never, UserResponse, RegisterRequest>,
  res: Response,
): Promise<void> => {
  try {
    const { username, password, parentEmail } = req.body;

    if (!validateEmail(parentEmail)) {
      res.status(400).json({ message: 'Invalid email format' });
      return;
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: 'Username already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      parentEmail,
      parentConsent: false,
      createdAt: new Date(),
    });

    const token = generateToken(newUser.id);
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        parentEmail: newUser.parentEmail,
        parentConsent: newUser.parentalConsent,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (
  req: Request<never, UserResponse, LoginRequest>,
  res: Response,
): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user.id);
    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        parentEmail: user.parentEmail,
        parentConsent: user.parentalConsent,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({
      id: user.id,
      username: user.username,
      parentEmail: user.parentEmail,
      parentConsent: user.parentalConsent,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Get user error:', error);
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $set: req.body },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({
      id: user.id,
      username: user.username,
      parentEmail: user.parentEmail,
      parentConsent: user.parentalConsent,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Update user error:', error);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({
      id: user.id,
      username: user.username,
      parentEmail: user.parentEmail,
      parentConsent: user.parentalConsent,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(
      users.map((user) => ({
        id: user.id,
        username: user.username,
        parentEmail: user.parentEmail,
        parentConsent: user.parentalConsent,
        createdAt: user.createdAt,
      }))
    );
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
