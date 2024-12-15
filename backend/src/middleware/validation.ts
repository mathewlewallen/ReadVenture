import { NextFunction, Request, Response } from 'express';
import { body, validationResult, ValidationError } from 'express-validator';

/**
 * Enhanced validation middleware with proper error handling
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map((err: ValidationError) => ({
        field: err.type,
        message: err.msg,
        value: err.type
      }))
    });
    return;
  }
  next();
};

/**
 * Validation rules for user registration/update
 * Validates email format, password strength, role assignment, and display name
 */
export const validateUserInput = [
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('role')
    .isIn(['student', 'parent'])
    .withMessage('Role must be either "student" or "parent"'),
  body('displayName').trim().notEmpty().withMessage('Display name is required'),
  validate // Add validate as the last middleware
];

/**
 * Validation rules for story creation/update
 * Ensures story content meets required format and metadata standards
 */
export const validateStoryInput = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('readingLevel')
    .isInt({ min: 1, max: 12 })
    .withMessage('Reading level must be between 1 and 12'),
  body('ageRange')
    .isArray()
    .withMessage('Age range must be an array')
    .custom((value: number[]) => value.length === 2)
    .withMessage('Age range must contain exactly 2 values'),
  body('genre').trim().notEmpty().withMessage('Genre is required'),
  validate
];

export const storyValidation = [
  body('title').isString().trim().notEmpty(),
  body('content').isString().trim().notEmpty(),
  body('difficulty').isInt({ min: 1, max: 5 }),
  body('ageRange.min').isInt({ min: 4 }),
  body('ageRange.max').isInt({ max: 12 }),
  validate
];

export const progressValidation = [
  body('storyId').isMongoId(),
  body('sessionData.wordsRead').isInt({ min: 0 }),
  body('sessionData.accuracy').isFloat({ min: 0, max: 100 }),
];

/**
 * Validation rules for progress tracking
 * Validates user progress metrics and ensures data integrity
 */
export const validateProgressInput = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('storyId').notEmpty().withMessage('Story ID is required'),
  body('wordsRead')
    .isInt({ min: 0 })
    .withMessage('Words read must be a positive number'),
  body('accuracy')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Accuracy must be between 0 and 100'),
  body('timeSpent')
    .isInt({ min: 0 })
    .withMessage('Time spent must be a positive number'),
];

/**
 * Story-specific validation middleware
 * Implements additional story validation logic
 */
export const validateStory = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { content, title, readingLevel } = req.body;

  // Content length validation
  if (content.length < 100 || content.length > 10000) {
    return res.status(400).json({
      status: 'error',
      message: 'Story content must be between 100 and 10000 characters',
    });
  }

  // Title length validation
  if (title.length < 3 || title.length > 100) {
    return res.status(400).json({
      status: 'error',
      message: 'Title must be between 3 and 100 characters',
    });
  }

  // Check reading level appropriateness
  const wordCount = content.split(/\s+/).length;
  const averageWordLength = content.length / wordCount;
  const expectedWordLength = 4 + readingLevel * 0.5;

  if (Math.abs(averageWordLength - expectedWordLength) > 2) {
    return res.status(400).json({
      status: 'error',
      message: 'Story complexity does not match reading level',
    });
  }

  next();
};

/**
 * Implements custom progress validation rules
 */
export const validateProgress = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { wordsRead, accuracy, timeSpent, lastSession } = req.body;

  // Validate reading speed
  const wordsPerMinute = (wordsRead / timeSpent) * 60;
  if (wordsPerMinute > 500 || wordsPerMinute < 50) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid reading speed detected',
    });
  }

  // Validate session frequency
  if (lastSession) {
    const timeSinceLastSession = Date.now() - new Date(lastSession).getTime();
    const minSessionGap = 5 * 60 * 1000; // 5 minutes
    if (timeSinceLastSession < minSessionGap) {
      return res.status(400).json({
        status: 'error',
        message: 'Sessions must be at least 5 minutes apart',
      });
    }
  }

  // Validate progress consistency
  if (accuracy === 100 && wordsPerMinute > 300) {
    return res.status(400).json({
      status: 'error',
      message: 'Suspicious reading pattern detected',
    });
  }

  next();
};

/**
 * Validation rules for user registration
 */
export const validateRegistration = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  body('displayName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Display name must be between 2 and 50 characters'),
  body('role')
    .isIn(['student', 'parent'])
    .withMessage('Role must be either "student" or "parent"'),
  body('parentEmail')
    .optional()
    .isEmail()
    .withMessage('Invalid parent email format')
    .normalizeEmail(),
];

/**
 * Validation rules for user login
 */
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Validation rules for user updates
 * Validates user profile update fields
 */
export const validateUserUpdate = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('displayName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Display name must be between 2 and 50 characters'),
  body('settings')
    .optional()
    .isObject()
    .withMessage('Settings must be an object'),
  body('settings.readingLevel')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Reading level must be between 1 and 12'),
  body('settings.notifications')
    .optional()
    .isBoolean()
    .withMessage('Notifications must be a boolean'),
  validate
];

/**
 * Validation rules for story listing/filtering
 */
export const validateStoryFilters = [
  body('difficulty').optional().isInt({ min: 1, max: 10 }),
  body('ageRange').optional().isArray(),
  body('limit').optional().isInt({ min: 1, max: 50 }),
  validate
];
