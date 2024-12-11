"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
/**
 * Mongoose schema for Story model
 */
const storySchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        index: true,
        trim: true,
        maxLength: 200,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    readingLevel: {
        type: Number,
        required: true,
        min: 1,
        max: 12,
    },
    ageRange: {
        type: [Number],
        required: true,
        validate: {
            validator: (v) => v.length === 2 && v[0] < v[1] && v[0] >= 0,
            message: 'Age range must be two numbers with min < max',
        },
    },
    genre: {
        type: String,
        required: true,
        enum: ['fiction', 'non-fiction', 'poetry', 'drama'], // Add valid genres
    },
    keywords: [
        {
            type: String,
            trim: true,
        },
    ],
    estimatedReadTime: {
        type: Number,
        required: true,
        min: 0,
    },
    difficulty: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    published: {
        type: Boolean,
        default: false,
    },
    coverImage: {
        type: String,
        trim: true,
    },
    author: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
// Add timestamp handling middleware
storySchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
// Create and export the model
exports.default = mongoose_1.default.model('Story', storySchema);
//# sourceMappingURL=Story.js.map