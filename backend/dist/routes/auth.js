"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const users_1 = require("../controllers/users");
const errorHandler_1 = require("../middleware/errorHandler");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// Authentication routes
router.post('/register', validation_1.validateRegistration, users_1.register);
router.post('/login', validation_1.validateLogin, users_1.login);
// Password reset routes
router.post('/forgot-password', async (_req, res) => {
    res.status(501).json({ message: 'Password reset functionality coming soon' });
});
// Error handling
router.use(errorHandler_1.errorHandler);
// Authentication endpoints
router.post('/reset-password', async (req, res) => {
    try {
        await (0, auth_1.resetPassword)({ req, res });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to reset password' });
    }
});
router.post('/verify-email', async (req, res) => {
    try {
        await (0, auth_1.verifyEmail)({ req, res });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to verify email' });
    }
});
router.post('/refresh-token', async (req, res) => {
    try {
        await (0, auth_1.refreshToken)({ req, res });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to refresh token' });
    }
});
router.post('/logout', async (_req, res) => {
    res.status(501).json({ message: 'Logout functionality coming soon' });
});
router.post('/validate-token', async (_req, res) => {
    res.status(501).json({ message: 'Token validation coming soon' });
});
router.post('/change-password', async (_req, res) => {
    res
        .status(501)
        .json({ message: 'Password change functionality coming soon' });
});
exports.default = router;
//# sourceMappingURL=auth.js.map