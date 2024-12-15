const { spawn } = require('child_process');

interface AnalysisResult {
  /** Grade level (1-12) */
  readingLevel: number;
  /** Complexity metrics */
  complexity: TextComplexity;
  /** Detailed text metrics */
  metrics: TextMetrics;
  /** 0-1 score of analysis confidence */
  confidence: number;
  /** Analysis timestamp */
  timestamp: string;
}

interface TextComplexity {
  avgSentenceLength: number;
  numComplexSentences: number;
  numRareWords: number;
  avgSyllablesPerWord: number;
  sentiment: string;
}

interface TextMetrics {
  wordCount: number;
  sentenceCount: number;
  uniqueWords: number;
  readabilityScore: number;
}

const analyzeText = async (text: string): Promise<AnalysisResult> => {
  return new Promise<AnalysisResult>((resolve, reject) => {
    const pythonProcess = spawn('python', ['./analyze.py', text]);

    let output: string = '';
    pythonProcess.stdout.on('data', (data: Buffer) => {
      output += data;
    });

    pythonProcess.stderr.on('data', (data: Buffer) => {
      console.error(`stderr: ${data}`);
      reject(new Error(`Python script error: ${data}`));
    });

    pythonProcess.on('close', (code: number) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}`));
      } else {
        try {
          const result: AnalysisResult = JSON.parse(output);
          resolve(result);
        } catch (error) {
          reject(new Error(`Error parsing Python output: ${error}`));
        }
      }
    });
  });
};

module.exports = { analyzeText };
