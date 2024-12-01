const express = require('express');
const router = express.Router();
const storyController = require('../controllers/stories');

// Get all stories
router.get('/', storyController.getAllStories);

// Get a specific story by ID
router.get('/:id', storyController.getStoryById);

module.exports = router;