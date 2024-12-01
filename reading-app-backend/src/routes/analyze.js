const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyze.js');

router.post('/', analyzeController.analyzeText);

module.exports = router;