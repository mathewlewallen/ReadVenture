const adaptiveAlgorithm = require('../services/adaptiveAlgorithm');

exports.analyzeText = async (req, res) => {
  try {
    const { text, storyId } = req.body;

    // 1. Call the adaptiveAlgorithm service to analyze the text
    const analysisResult = await adaptiveAlgorithm.analyzeText(text, storyId); 

    // 2. Extract the adjusted text from the analysisResult
    const adjustedText = analysisResult.adjustedText;

    res.json({ adjustedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};