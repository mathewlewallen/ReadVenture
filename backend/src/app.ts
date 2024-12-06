import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet'; // Security middleware
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';

import analyzeRoutes from './routes/analyze';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import storyRoutes from './routes/stories';

// Load environment variables early to ensure availability
dotenv.config();

interface ServerConfig {
  port: number;
  mongoUri: string;
  nodeEnv: string;
}

// Centralize configuration
const config: ServerConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGO_URI || '',
  nodeEnv: process.env.NODE_ENV || 'development',
};

// MongoDB connection options with proper typing
const mongooseOptions: mongoose.ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: config.nodeEnv === 'development',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Force IPv4
};

const app: Application = express();

// Security and performance middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
}));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/v1/analyze', analyzeRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/stories', storyRoutes);

// Global error handler
app.use(errorHandler);

/**
 * Establishes connection to MongoDB
 * @throws {Error} If MongoDB URI is not defined or connection fails
 */
const connectDB = async (): Promise<void> => {
  if (!config.mongoUri) {
    throw new Error('MongoDB URI is not defined in environment variables');
  }

  try {
    await mongoose.connect(config.mongoUri, mongooseOptions);
    console.log('📦 Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

/**
 * Initializes the server with database connection and error handlers
 */
const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Received shutdown signal');
      await mongoose.connection.close();
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
};

// Global error handlers
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Start server only if this file is run directly
if (require.main === module) {
  startServer().catch((error: Error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export default app;
