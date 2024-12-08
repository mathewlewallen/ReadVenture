/**
 * ReadVenture Firebase Cloud Functions
 * Main entry point for backend serverless functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AnalysisResult, ProgressData, StoryData } from './types';

// Initialize Firebase Admin
admin.initializeApp();

// Error types for better error handling
export enum ErrorType {
  AUTH = 'auth_error',
  VALIDATION = 'validation_error',
  DATABASE = 'database_error',
  ANALYSIS = 'analysis_error',
  PROGRESS = 'progress_error',
}

/**
 * Centralized error handler
 */
const handleError = (
  error: any,
  type: ErrorType,
): functions.https.HttpsError => {
  console.error(`[${type}]`, error);
  return new functions.https.HttpsError('internal', error.message, {
    type,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Validates user authentication
 */
const validateAuth = (context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Authentication required',
    );
  }
  return context.auth.uid;
};

/**
 * Analyzes reading progress and provides feedback
 */
export const analyzeReading = functions.https.onCall(async (data, context) => {
  try {
    const uid = validateAuth(context);

    if (!data.text?.trim() || !data.storyId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Text and story ID are required',
      );
    }

    const db = admin.firestore();
    const storyRef = db.collection('stories').doc(data.storyId);
    const storyDoc = await storyRef.get();

    if (!storyDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Story not found');
    }

    const analysis: AnalysisResult = {
      accuracy: calculateAccuracy(data.text, storyDoc.data()?.content),
      wordsRead: data.text.split(' ').length,
      timeSpent: data.duration || 0,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    await updateProgress(uid, data.storyId, analysis);

    return analysis;
  } catch (error) {
    throw handleError(error, ErrorType.ANALYSIS);
  }
});

/**
 * Updates user reading progress
 */
export const updateProgress = functions.https.onCall(async (data, context) => {
  try {
    const uid = validateAuth(context);

    if (!data.storyId || !data.progress) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Story ID and progress data required',
      );
    }

    const db = admin.firestore();
    const progressRef = db.collection('progress').doc();

    const progressData: ProgressData = {
      userId: uid,
      storyId: data.storyId,
      wordsRead: data.progress.wordsRead,
      accuracy: data.progress.accuracy,
      timeSpent: data.progress.timeSpent,
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await progressRef.set(progressData);

    return { success: true, progressId: progressRef.id };
  } catch (error) {
    throw handleError(error, ErrorType.PROGRESS);
  }
});

/**
 * Retrieves parent dashboard analytics
 */
export const getParentDashboard = functions.https.onCall(
  async (data, context) => {
    try {
      const uid = validateAuth(context);

      const db = admin.firestore();
      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists || !userDoc.data()?.isParent) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Parent access required',
        );
      }

      const childrenQuery = await db
        .collection('users')
        .where('parentId', '==', uid)
        .get();

      const childrenProgress = await Promise.all(
        childrenQuery.docs.map(async child => {
          const progressQuery = await db
            .collection('progress')
            .where('userId', '==', child.id)
            .orderBy('completedAt', 'desc')
            .limit(10)
            .get();

          return {
            childId: child.id,
            name: child.data().name,
            progress: progressQuery.docs.map(doc => doc.data()),
          };
        }),
      );

      return childrenProgress;
    } catch (error) {
      throw handleError(error, ErrorType.DATABASE);
    }
  },
);

/**
 * Calculates reading accuracy
 */
const calculateAccuracy = (userText: string, originalText: string): number => {
  const userWords = userText.toLowerCase().split(' ');
  const originalWords = originalText.toLowerCase().split(' ');
  let correctWords = 0;

  userWords.forEach((word, index) => {
    if (word === originalWords[index]) {
      correctWords++;
    }
  });

  return (correctWords / originalWords.length) * 100;
};

export const updateUserSettings = functions.https.onCall(
  async (data, context) => {
    try {
      const uid = validateAuth(context);

      const db = admin.firestore();
      const userRef = db.collection('users').doc(uid);

      await userRef.update({
        settings: data.settings,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      throw handleError(error, ErrorType.DATABASE);
    }
  },
);
