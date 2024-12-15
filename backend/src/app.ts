/**
 * Main application entry point with Express server setup
 * @module app
 */

// Core dependencies
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';

// Security dependencies

// Routes and middleware
import errorHandler from './middleware/errorHandler';
import analyzeRoutes from './routes/analyze';
import authRoutes from './routes/auth';
import storyRoutes from './routes/stories';
import userRoutes from './routes/users';

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
export const config: ServerConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGO_URI || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
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
