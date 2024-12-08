import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface representing a Story document
 * @interface IStory
 * @extends Document
 */
export interface IStory extends Document {
  title: string;
  content: string;
  difficulty: number;
  ageRange: {
    min: number;
    max: number;
  };
  metadata: {
    wordCount: number;
    readingTime: number;
  };
  readingLevel: number;
  genre: string;
  keywords: string[];
  estimatedReadTime: number;
  published: boolean;
  coverImage?: string;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for Story model
 */
const storySchema = new Schema({
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
      validator: (v: number[]) => v.length === 2 && v[0] < v[1] && v[0] >= 0,
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
export default mongoose.model<IStory>('Story', storySchema);
