import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface representing a user's reading progress document
 * @interface IProgress
 * @extends Document
 */
export interface IProgress extends Document {
  userId: string; // Reference to user
  storyId: string; // Reference to story
  sessionData: {
    wordsRead: number;
    accuracy: number;
    timeSpent: number;
  };
  completedAt: Date; // Date when story was completed
  wordsRead: number; // Total words read in story
  accuracy: number; // Reading accuracy percentage
  timeSpent: number; // Time spent reading in seconds
  completed: boolean; // Whether story is completed
  lastReadAt: Date; // Last reading session timestamp
  readingSpeed: number; // Words per minute
  comprehensionScore: number; // Story comprehension score
}

/**
 * Mongoose schema for tracking reading progress
 */
const progressSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  storyId: {
    type: Schema.Types.ObjectId,
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
export default mongoose.model<IProgress>('Progress', progressSchema);
