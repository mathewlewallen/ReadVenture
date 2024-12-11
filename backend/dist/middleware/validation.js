"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProgress = exports.validateStory = exports.validate = exports.validateProgressInput = exports.progressValidation = exports.storyValidation = exports.validateStoryInput = exports.validateUserInput = void 0;
const express_validator_1 = require("express-validator");
/**
 * Validation rules for user registration/update
 * Validates email format, password strength, role assignment, and display name
 */
exports.validateUserInput = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    (0, express_validator_1.body)('role')
        .isIn(['student', 'parent'])
        .withMessage('Role must be either "student" or "parent"'),
    (0, express_validator_1.body)('displayName').trim().notEmpty().withMessage('Display name is required'),
];
/**
 * Validation rules for story creation/update
 * Ensures story content meets required format and metadata standards
 */
exports.validateStoryInput = [
    (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('content').trim().notEmpty().withMessage('Content is required'),
    (0, express_validator_1.body)('readingLevel')
        .isInt({ min: 1, max: 12 })
        .withMessage('Reading level must be between 1 and 12'),
    (0, express_validator_1.body)('ageRange')
        .isArray()
        .withMessage('Age range must be an array')
        .custom((value) => value.length === 2)
        .withMessage('Age range must contain exactly 2 values'),
    (0, express_validator_1.body)('genre').trim().notEmpty().withMessage('Genre is required'),
];
exports.storyValidation = [
    (0, express_validator_1.body)('title').isString().trim().notEmpty(),
    (0, express_validator_1.body)('content').isString().trim().notEmpty(),
    (0, express_validator_1.body)('difficulty').isInt({ min: 1, max: 5 }),
    (0, express_validator_1.body)('ageRange.min').isInt({ min: 4 }),
    (0, express_validator_1.body)('ageRange.max').isInt({ max: 12 }),
];
exports.progressValidation = [
    (0, express_validator_1.body)('storyId').isMongoId(),
    (0, express_validator_1.body)('sessionData.wordsRead').isInt({ min: 0 }),
    (0, express_validator_1.body)('sessionData.accuracy').isFloat({ min: 0, max: 100 }),
];
/**
 * Validation rules for progress tracking
 * Validates user progress metrics and ensures data integrity
 */
exports.validateProgressInput = [
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID is required'),
    (0, express_validator_1.body)('storyId').notEmpty().withMessage('Story ID is required'),
    (0, express_validator_1.body)('wordsRead')
        .isInt({ min: 0 })
        .withMessage('Words read must be a positive number'),
    (0, express_validator_1.body)('accuracy')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Accuracy must be between 0 and 100'),
    (0, express_validator_1.body)('timeSpent')
        .isInt({ min: 0 })
        .withMessage('Time spent must be a positive number'),
];
/**
 * Generic validation middleware
 * Checks for validation errors and returns appropriate response
 */
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            errors: errors.array(),
        });
    }
    next();
};
exports.validate = validate;
/**
 * Story-specific validation middleware
 * Implements additional story validation logic
 */
const validateStory = (req, res, next) => {
    // TODO: Implement custom story validation logic
    // Examples: content length limits, format checking, etc.
    next();
};
exports.validateStory = validateStory;
/**
 * Progress-specific validation middleware
 * Implements additional progress validation logic
 */
const validateProgress = (req, res, next) => {
    // TODO: Implement custom progress validation logic
    // Examples: time constraints, progress limits, etc.
    next();
};
exports.validateProgress = validateProgress;
//# sourceMappingURL=validation.js.map