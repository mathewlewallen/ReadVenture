const { spawn } = require('child_process');

const analyzeText = async (text) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['./analyze.py', text]); 

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data;
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      reject(new Error(`Python script error: ${data}`));
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}`));
      } else {
        try {
          const result = JSON.parse(output); 
          resolve(result);
        } catch (error) {
          reject(new Error(`Error parsing Python output: ${error}`));
        }
      }
    });
  });
};

module.exports = { analyzeText };