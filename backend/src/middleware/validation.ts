import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

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
];

export const storyValidation = [
  body('title').isString().trim().notEmpty(),
  body('content').isString().trim().notEmpty(),
  body('difficulty').isInt({ min: 1, max: 5 }),
  body('ageRange.min').isInt({ min: 4 }),
  body('ageRange.max').isInt({ max: 12 }),
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
 * Generic validation middleware
 * Checks for validation errors and returns appropriate response
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array(),
    });
  }
  next();
};

/**
 * Story-specific validation middleware
 * Implements additional story validation logic
 */
export const validateStory = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // TODO: Implement custom story validation logic
  // Examples: content length limits, format checking, etc.
  next();
};

/**
 * Progress-specific validation middleware
 * Implements additional progress validation logic
 */
export const validateProgress = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // TODO: Implement custom progress validation logic
  // Examples: time constraints, progress limits, etc.
  next();
};
