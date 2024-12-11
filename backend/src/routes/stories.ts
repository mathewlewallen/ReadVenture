import express, { Router } from 'express';

import {
  getAllStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
} from '../controllers/stories';
import { authenticate } from '../middleware/auth';
import { validateStoryInput } from '../middleware/validation';

const router: Router = express.Router();

// Get all stories
router.get('/', authenticate, getAllStories);

// Get a specific story by ID
router.get('/:id', authenticate, getStoryById);

// Create a new story
router.post('/', authenticate, validateStoryInput, createStory);

// Update a story
router.put('/:id', authenticate, validateStoryInput, updateStory);

// Delete a story
router.delete('/:id', authenticate, deleteStory);

export default router;
