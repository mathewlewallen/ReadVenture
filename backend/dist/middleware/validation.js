"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStoryFilters = exports.validateUserUpdate = exports.validateLogin = exports.validateRegistration = exports.validateProgress = exports.validateStory = exports.validateProgressInput = exports.progressValidation = exports.storyValidation = exports.validateStoryInput = exports.validateUserInput = exports.validate = void 0;
const express_validator_1 = require("express-validator");
/**
 * Enhanced validation middleware with proper error handling
 */
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: errors.array().map((err) => ({
                field: err.type,
                message: err.msg,
                value: err.type
            }))
        });
        return;
    }
    next();
};
exports.validate = validate;
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
    exports.validate // Add validate as the last middleware
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
    exports.validate
];
exports.storyValidation = [
    (0, express_validator_1.body)('title').isString().trim().notEmpty(),
    (0, express_validator_1.body)('content').isString().trim().notEmpty(),
    (0, express_validator_1.body)('difficulty').isInt({ min: 1, max: 5 }),
    (0, express_validator_1.body)('ageRange.min').isInt({ min: 4 }),
    (0, express_validator_1.body)('ageRange.max').isInt({ max: 12 }),
    exports.validate
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
 * Story-specific validation middleware
 * Implements additional story validation logic
 */
const validateStory = (req, res, next) => {
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
exports.validateStory = validateStory;
/**
 * Implements custom progress validation rules
 */
const validateProgress = (req, res, next) => {
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
exports.validateProgress = validateProgress;
/**
 * Validation rules for user registration
 */
exports.validateRegistration = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number'),
    (0, express_validator_1.body)('displayName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Display name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('role')
        .isIn(['student', 'parent'])
        .withMessage('Role must be either "student" or "parent"'),
    (0, express_validator_1.body)('parentEmail')
        .optional()
        .isEmail()
        .withMessage('Invalid parent email format')
        .normalizeEmail(),
];
/**
 * Validation rules for user login
 */
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
];
/**
 * Validation rules for user updates
 * Validates user profile update fields
 */
exports.validateUserUpdate = [
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    (0, express_validator_1.body)('displayName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Display name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('settings')
        .optional()
        .isObject()
        .withMessage('Settings must be an object'),
    (0, express_validator_1.body)('settings.readingLevel')
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage('Reading level must be between 1 and 12'),
    (0, express_validator_1.body)('settings.notifications')
        .optional()
        .isBoolean()
        .withMessage('Notifications must be a boolean'),
    exports.validate
];
/**
 * Validation rules for story listing/filtering
 */
exports.validateStoryFilters = [
    (0, express_validator_1.body)('difficulty').optional().isInt({ min: 1, max: 10 }),
    (0, express_validator_1.body)('ageRange').optional().isArray(),
    (0, express_validator_1.body)('limit').optional().isInt({ min: 1, max: 50 }),
    exports.validate
];
//# sourceMappingURL=validation.js.map