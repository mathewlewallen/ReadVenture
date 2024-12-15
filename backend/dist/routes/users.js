"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// Protected routes
router.get('/me', auth_1.authenticate, users_1.getMe);
router.put('/me', auth_1.authenticate, validation_1.validateUserUpdate, users_1.updateUser);
router.delete('/me', auth_1.authenticate, users_1.deleteUser);
// Admin routes
router.get('/', auth_1.authenticate, users_1.getAllUsers);
router.get('/:id', auth_1.authenticate, users_1.getUserById);
// Password management
router.post('/change-password', auth_1.authenticate, async (_req, res, next) => {
    try {
        res.status(501).json({ message: 'Password change functionality coming soon' });
    }
    catch (error) {
        next(error);
    }
});
router.put('/profile', auth_1.authenticate, async (_req, res, next) => {
    try {
        res.status(501).json({ message: 'Profile update functionality coming soon' });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map