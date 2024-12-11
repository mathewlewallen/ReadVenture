"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Story_1 = __importDefault(require("../../../moved files/reading-app-backend/e/src/models/Story"));
// Function to get all stories
exports.getAllStories = async (req, res) => {
    try {
        const stories = await Story_1.default.find();
        res.json(stories);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Function to get a specific story by ID
exports.getStoryById = async (req, res) => {
    try {
        const story = await Story_1.default.findById(req.params.id);
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }
        res.json(story);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
//# sourceMappingURL=stories.js.map