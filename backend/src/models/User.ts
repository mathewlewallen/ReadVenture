import bcrypt from 'bcryptjs';
import { CallbackError, Schema } from 'mongoose';
import mongoose from 'mongoose';

/**
 * Interface representing a User document in MongoDB
 * Extends the base Document type with user-specific fields
 */
export interface User extends Document {
  email: string;
  username: string;
  password: string;
  displayName: string;
  role: 'student' | 'parent';
  parentEmail?: string;
  parentalConsent: boolean;
  settings: {
    readingLevel: number;
    soundEffects: boolean;
    textSize: 'small' | 'medium' | 'large';
    theme: 'light' | 'dark';
  };
  progress: {
    totalWordsRead: number;
    storiesCompleted: number;
    averageAccuracy: number;
  };
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
}

// Remove duplicate schema definition
const userSchema = new Schema({
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
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error: unknown) {
      return next(error as CallbackError);
    }
  }
  next();
});

// Create and export the model
const UserModel = mongoose.model<User>('User', userSchema);
export default UserModel;
