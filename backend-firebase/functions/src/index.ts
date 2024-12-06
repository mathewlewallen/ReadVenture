import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { spawn } from 'child_process';

// Initialize Firebase Admin once
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

interface Story {
  id: string;
  [key: string]: any;
}

interface UserProgress {
  totalWordsRead: number;
  storiesCompleted: number;
  badgesEarned: string[];
}

interface UserData {
  username: string;
  email: string;
  role: 'child' | 'parent';
  parentEmail?: string;
  progress: UserProgress;
  settings?: Record<string, any>;
}

/**
 * Fetches all stories from Firestore
 * @throws {functions.https.HttpsError} On database errors
 */
export const getStories = functions.https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  try {
    const snapshot = await db.collection('stories').get();
    return snapshot.docs.map<Story>(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw new functions.https.HttpsError('internal', 'Error fetching stories');
  }
});

/**
 * Analyzes text using Python ML algorithm and updates user progress
 * @param data.text - Text to analyze
 * @param data.storyId - Story identifier
 * @param data.userId - User identifier
 */
export const analyzeText = functions.https
  .onCall(async (data: { text: string; storyId: string; userId: string }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
    }

    if (!data.text?.trim() || !data.storyId || !data.userId) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
    }

    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', ['../adaptive_algorithm/analyze.py', data.text, data.storyId]);
      let output = '';

      pythonProcess.stdout.on('data', chunk => output += chunk);

      pythonProcess.stderr.on('data', error => {
        console.error(`Python analysis error: ${error}`);
        reject(new functions.https.HttpsError('internal', 'Text analysis failed'));
      });

      pythonProcess.on('close', async code => {
        if (code !== 0) {
          reject(new functions.https.HttpsError('internal', `Analysis process failed: ${code}`));
          return;
        }

        try {
          const result = JSON.parse(output.trim());
          const userRef = db.collection('users').doc(data.userId);

          await db.runTransaction(async transaction => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
              throw new functions.https.HttpsError('not-found', 'User not found');
            }

            const userData = userDoc.data() as UserData;
            const wordCount = result.adjustedText.split(/\s+/).length;

            transaction.update(userRef, {
              'progress.totalWordsRead': (userData.progress?.totalWordsRead || 0) + wordCount
            });
          });

          resolve({ adjustedText: result.adjustedText });
        } catch (error) {
          console.error('Analysis processing error:', error);
          reject(new functions.https.HttpsError('internal', 'Failed to process analysis results'));
        }
      });
    });
  });

// Additional functions follow similar pattern...
// (updateSettings, getParentData, addChild implementations would be enhanced similarly)
