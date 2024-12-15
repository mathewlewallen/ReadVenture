import express, { Router, Request, Response, NextFunction } from 'express';

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

// Define controller handler types
type ControllerHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

router.get('/', authenticate, getAllStories as ControllerHandler);
router.get('/:id', authenticate, getStoryById as ControllerHandler);
router.post('/', authenticate, validateStoryInput, createStory as ControllerHandler);
router.put('/:id', authenticate, validateStoryInput, updateStory as ControllerHandler);
router.delete('/:id', authenticate, deleteStory as ControllerHandler);

export default router;
