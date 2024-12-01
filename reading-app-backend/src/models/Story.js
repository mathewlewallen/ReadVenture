const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  text: { type: String, required: true },
  readingLevel: { type: Number, required: true }, // e.g., 1-5 scale
  genre: { type: String }, 
  coverImage: { type: String }, // URL to the cover image
});

module.exports = mongoose.model('Story', storySchema);