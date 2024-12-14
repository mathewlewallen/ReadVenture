import { spawn } from 'child_process';
import { Request, Response } from 'express';

export const analyzeText = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { text, storyId } = req.body;

    // Spawn a Python process
    const pythonProcess = spawn('python', [
      'adaptive_algorithm/analyze.py',
      text,
      storyId,
    ]);

    let adjustedText = '';
    pythonProcess.stdout.on('data', (data) => {
      adjustedText += data; // Collect the output from Python
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python: ${data}`);
      return res.status(500).json({ message: 'Error analyzing text' });
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        return res.status(500).json({ message: 'Error analyzing text' });
      }

      try {
        // Parse the JSON output from Python
        const result = JSON.parse(adjustedText);
        res.json({ adjustedText: result.adjustedText });
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return res.status(500).json({ message: 'Error analyzing text' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
