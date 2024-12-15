import { Request, Response, NextFunction } from 'express';
import Story from '../models/Story';

export type ControllerHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Get all stories with optional filtering
 */
export const getAllStories = async (req: Request, res: Response) => {
  try {
    const query = Story.find();

    // Apply filters if provided
    if (req.query.difficulty) {
      query.where('difficulty').lte(Number(req.query.difficulty));
    }

    if (req.query.ageRange) {
      const [min, max] = (req.query.ageRange as string).split(',').map(Number);
      query.where('ageRange.min').gte(min).where('ageRange.max').lte(max);
    }

    const stories = await query.exec();
    res.json({ success: true, data: stories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stories' });
  }
};

/**
 * Get a specific story by ID
 */
export const getStoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      res.status(404).json({ message: 'Story not found' });
      return;
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * Create a new story
 */
export const createStory = async (req: Request, res: Response) => {
  try {
    const story = new Story({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await story.save();
    res.status(201).json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create story' });
  }
};

/**
 * Update an existing story
 */
export const updateStory = async (req: Request, res: Response) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!story) {
      return res.status(404).json({ success: false, error: 'Story not found' });
    }
    res.json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update story' });
  }
};

/**
 * Delete a story
 */
export const deleteStory = async (req: Request, res: Response) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, error: 'Story not found' });
    }
    res.json({ success: true, message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete story' });
  }
};
