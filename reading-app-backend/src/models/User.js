const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  parentEmail: { type: String, required: true },
  parentalConsent: { type: Boolean, default: false }, // For COPPA compliance
  // ... other fields (settings, child's name, etc.) 
});

module.exports = mongoose.model('User', userSchema);