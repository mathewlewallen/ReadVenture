const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyze'); 

// POST request to /analyze to handle text analysis
router.post('/', analyzeController.analyzeText); 

module.exports = router;