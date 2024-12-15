"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
// Remove duplicate schema definition
const userSchema = new mongoose_1.Schema({
    // Authentication fields
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    displayName: { type: String, required: true },
    // Role and permissions
    role: { type: String, enum: ['student', 'parent'], required: true },
    parentEmail: { type: String }, // Optional for parent accounts
    parentalConsent: { type: Boolean, default: false }, // COPPA compliance
    // User preferences
    settings: {
        readingLevel: { type: Number, default: 1, min: 1, max: 12 },
        soundEffects: { type: Boolean, default: true },
        textSize: {
            type: String,
            enum: ['small', 'medium', 'large'],
            default: 'medium',
        },
        theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    },
    // User statistics
    progress: {
        totalWordsRead: { type: Number, default: 0, min: 0 },
        storiesCompleted: { type: Number, default: 0, min: 0 },
        averageAccuracy: { type: Number, default: 0, min: 0, max: 100 },
    },
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    emailVerified: { type: Boolean, default: false },
    refreshToken: String
});
/**
 * Pre-save middleware to hash password before saving
 * Only hashes the password if it has been modified
 */
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            this.password = await bcryptjs_1.default.hash(this.password, 10);
        }
        catch (error) {
            return next(error);
        }
    }
    next();
});
// Create and export the model
const UserModel = mongoose_2.default.model('User', userSchema);
exports.default = UserModel;
//# sourceMappingURL=User.js.map