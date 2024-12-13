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
 * Mongoose schema for tracking reading progress
 */
const progressSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    storyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Story',
        required: true,
    },
    wordsRead: {
        type: Number,
        default: 0,
        min: 0,
    },
    accuracy: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    timeSpent: {
        type: Number,
        default: 0,
        min: 0,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    lastReadAt: {
        type: Date,
        default: Date.now,
    },
    readingSpeed: {
        type: Number,
        min: 0,
        default: 0,
    },
    comprehensionScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
});
// Create compound index for unique user-story combinations
progressSchema.index({ userId: 1, storyId: 1 }, { unique: true });
// Export the Progress model
exports.default = mongoose_1.default.model('Progress', progressSchema);
//# sourceMappingURL=Progress.js.map