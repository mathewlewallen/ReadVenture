import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

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

export const register = async (
  req: Request<never, UserResponse, RegisterRequest>,
  res: Response
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

    const user = await User.create({
      username,
      password: hashedPassword,
      parentEmail,
      parentConsent: false,
      createdAt: new Date(),
    });

    const token = generateToken(user.id);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        parentEmail: user.parentEmail,
        parentConsent: user.parentConsent,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (
  req: Request<never, UserResponse, LoginRequest>,
  res: Response
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
        parentConsent: user.parentConsent,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};