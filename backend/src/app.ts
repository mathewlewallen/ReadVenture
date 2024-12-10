/**
 * Main application entry point with Express server setup
 * @module app
 */

// Core dependencies
import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Security dependencies
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';

// Routes and middleware
import { errorHandler } from '../middleware/errorHandler';
import analyzeRoutes from '../routes/analyze';
import authRoutes from '../routes/auth';
import storyRoutes from '../routes/stories';
import userRoutes from '../routes/users';

// Load environment variables
dotenv.config();

/**
 * Server configuration interface
 */
interface ServerConfig {
  port: number;
  mongoUri: string;
  nodeEnv: string;
  corsOrigin: string;
}

/**
 * Centralized configuration object
 */
const config: ServerConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGO_URI || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

/**
 * MongoDB connection options with recommended security settings
 */
const mongooseOptions: mongoose.ConnectOptions = {
  autoIndex: config.nodeEnv === 'development',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  // Add these recommended security options
  ssl: config.nodeEnv === 'production',
  authSource: 'admin',
};

// Create Express application instance
const app: Application = express();

/**
 * Security middleware configuration
 */
// Enhanced Helmet configuration
app.use(
  helmet({
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: true,
    dnsPrefetchControl: true,
    frameguard: true,
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: true,
    referrerPolicy: true,
    xssFilter: true,
  }),
);

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Rate limiting configuration
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// Request parsing with security limits
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

/**
 * Health check endpoint
 */
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * API route configuration
 */
app.use('/api/v1/analyze', analyzeRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/stories', storyRoutes);

// Global error handler
app.use(errorHandler);

// Rest of the code remains the same...
