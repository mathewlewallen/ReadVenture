const adaptiveAlgorithm = require('../services/adaptiveAlgorithm');

exports.analyzeText = async (req, res) => {
  try {
    const { text, storyId } = req.body; 
    // Call the adaptiveAlgorithm service (which interacts with the Python script)
    const analysisResult = await adaptiveAlgorithm.analyzeText(text, storyId); 

    // Extract the adjusted text from the analysis result
    const adjustedText = analysisResult.adjustedText; 

    // Send the adjusted text as the response
    res.json({ adjustedText }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};