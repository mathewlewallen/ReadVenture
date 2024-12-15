"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authenticate = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
/**
 * Middleware to authenticate requests using JWT tokens
 * @param req - Express request object with auth header
 * @param res - Express response object
 * @param next - Express next function
 */
const authenticate = async (req, res, next) => {
    try {
        // Extract authorization header
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            res.status(401).json({ message: 'No authorization header found' });
            return;
        }
        // Clean and validate token
        const token = authHeader.replace('Bearer ', '').trim();
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }
        // Verify JWT secret exists
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }
        // Verify and decode token
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (error) {
        // Handle specific JWT errors
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({ message: 'Token expired' });
            return;
        }
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.authenticate = authenticate;
/**
 * Middleware to check if authenticated user is an admin
 * @param req - Express request object with user data
 * @param res - Express response object
 * @param next - Express next function
 */
const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        // Convert string ID to ObjectId
        const userId = new mongodb_1.ObjectId(req.user.userId);
        // Update the query with proper typing
        const user = await db.collection('users').findOne({ _id: userId });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (user.role !== 'admin') {
            res.status(403).json({ message: 'Insufficient permissions' });
            return;
        }
        next();
    }
    catch (error) {
        // Add more specific error handling
        if (error instanceof Error && error.name === 'BSONTypeError') {
            res.status(400).json({ message: 'Invalid user ID format' });
            return;
        }
        console.error('Admin check error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.isAdmin = isAdmin;
// Router configuration
const router = (0, express_1.Router)();
/**
 * Auth routes configuration
 */
router.post('/reset-password', async (req, res) => {
    try {
        await resetPassword(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Password reset failed' });
    }
});
router.post('/verify-email', async (req, res) => {
    try {
        await verifyEmail(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Email verification failed' });
    }
});
router.post('/refresh-token', exports.authenticate, async (req, res) => {
    try {
        await refreshToken(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Token refresh failed' });
    }
});
exports.default = router;
function resetPassword(_req, _res) {
    throw new Error('Function not implemented.');
}
function verifyEmail(_req, _res) {
    throw new Error('Function not implemented.');
}
function refreshToken(_req, _res) {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=auth.js.map