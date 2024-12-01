const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const auth = require('../middleware/auth');

// Get current user's details (protected route)
router.get('/me', auth.authenticate, userController.getMe);

module.exports = router;