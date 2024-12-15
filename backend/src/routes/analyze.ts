import express from 'express';
import winston from 'winston';
import { analyzeText } from '../controllers/analyze';

const router = express.Router();

router.post('/', analyzeText);

interface ErrorDetails {
  error: string;
  stack?: string;
  path?: string;
  method?: string;
  body?: any;
  params?: any;
  query?: any;
}

// Configure Winston logger
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Write to error.log
    new winston.transports.File({ filename: 'error.log' }),
    // Also log to console in development
    ...(process.env.NODE_ENV !== 'production'
      ? [new winston.transports.Console()]
      : [])
  ]
});

const logError = (message: string, details: ErrorDetails): void => {
  const sanitizedDetails = {
    ...details,
    body: details.body ? '[REDACTED]' : undefined
  };

  logger.error(message, sanitizedDetails);
};

export { logError };
export default router;
