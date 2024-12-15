import { Request, Response, NextFunction } from 'express';
import { logError } from '../routes/analyze';

/**
 * Error Handler Middleware
 *
 * Centralized error handling middleware for Express application.
 * Handles different types of errors and provides consistent error responses.
 */


interface ErrorWithStatus extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  error: ErrorWithStatus,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error details
  logError('API Error:', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Set default status code if not provided
  const statusCode = error.status || 500;
  const errorCode = error.code || 'INTERNAL_SERVER_ERROR';

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    code: errorCode,
    message: error.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
    }),
  });
};

export default errorHandler;
