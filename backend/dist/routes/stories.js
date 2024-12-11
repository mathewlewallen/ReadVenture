"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stories_1 = require("../controllers/stories");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// Get all stories
router.get('/', auth_1.authenticate, stories_1.getAllStories);
// Get a specific story by ID
router.get('/:id', auth_1.authenticate, stories_1.getStoryById);
// Create a new story
router.post('/', auth_1.authenticate, validation_1.validateStoryInput, stories_1.createStory);
// Update a story
router.put('/:id', auth_1.authenticate, validation_1.validateStoryInput, stories_1.updateStory);
// Delete a story
router.delete('/:id', auth_1.authenticate, stories_1.deleteStory);
exports.default = router;
//# sourceMappingURL=stories.js.map