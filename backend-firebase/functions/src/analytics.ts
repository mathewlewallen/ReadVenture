// Import required Firebase and custom types
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { db } from './firebase'; // Ensure this path is correct
import {
  UserProgress,
  ChildAnalytics,
  ReadingProgressData,
  ErrorType
} from './types';
import { handleFirebaseError } from './utils/errorHandling'; // Ensure this path is correct

/**
 * Tracks user reading progress for a specific story
 * @param data ReadingProgressData containing storyId and progress metrics
 * @param context Firebase callable context containing auth info
 * @returns Object indicating success status
 * @throws FirebaseError if unauthorized or database operation fails
 */
export const trackReadingProgress = functions.https.onCall(
  async (data: ReadingProgressData, context: functions.https.CallableContext) => {
    // Verify user authentication
    if (!context.auth?.uid) {
      throw handleFirebaseError(new Error('Unauthorized access'), ErrorType.AUTH);
    }

    const { storyId, progress } = data;
    const userId = context.auth.uid;

    try {
      // Update user progress document with new reading data
      await db
        .collection('userProgress')
        .doc(userId)
        .set(
          {
            [`stories.${storyId}`]: {
              wordCount: progress.wordCount,
              accuracy: progress.accuracy,
              completionTime: progress.completionTime,
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
            },
            lastActivity: admin.firestore.FieldValue.serverTimestamp(),
            totalWordsRead: admin.firestore.FieldValue.increment(
              progress.wordCount,
            ),
          },
          { merge: true },
        );

      return { success: true };
    } catch (error) {
      throw handleFirebaseError(error, ErrorType.DATABASE);
    }
  },
);

/**
 * Retrieves progress analytics for a specific child
 * @param childId Unique identifier for the child user
 * @returns Promise containing child's analytics data
 * @throws Error if child data cannot be found
 */
export const getChildProgress = async (
  childId: string,
): Promise<ChildAnalytics> => {
  try {
    const [progressDoc, userDoc] = await Promise.all([
      db.collection('userProgress').doc(childId).get(),
      db.collection('users').doc(childId).get()
    ]);

    if (!progressDoc.exists || !userDoc.exists) {
      throw new Error(`Child data not found for ID: ${childId}`);
    }

    const progress = progressDoc.data() as UserProgress;
    const userData = userDoc.data() as { displayName: string; readingLevel: string };

    return {
      childId,
      displayName: userData.displayName,
      totalWordsRead: progress.totalWordsRead || 0,
      averageAccuracy: progress.averageAccuracy || 0,
      storiesCompleted: progress.storiesCompleted || 0,
      lastActivity: progress.lastActivity,
      readingLevel: userData.readingLevel || 'Beginner',
    };
  } catch (error) {
    throw handleFirebaseError(error, ErrorType.DATABASE);
  }
};

/**
 * Retrieves analytics for all children associated with a parent
 * @param data Empty object (required by Firebase callable functions)
 * @param context Firebase callable context containing auth info
 * @returns Object containing array of children's analytics
 * @throws FirebaseError if unauthorized or database operation fails
 */
export const getChildrenAnalytics = functions.https.onCall(
  async (data: unknown, context: functions.https.CallableContext) => {
    // Verify user authentication and email
    if (!context.auth?.token.email) {
      throw handleFirebaseError(new Error('Unauthorized access'), ErrorType.AUTH);
    }

    try {
      // Query for all children associated with the parent's email
      const childrenQuery = await db
        .collection('users')
        .where('parentEmail', '==', context.auth.token.email)
        .get();

      // Get analytics for each child in parallel
      const childrenAnalytics = await Promise.all(
        childrenQuery.docs.map((child) => getChildProgress(child.id))
      );

      return { children: childrenAnalytics };
    } catch (error) {
      throw handleFirebaseError(error, ErrorType.DATABASE);
    }
  },
);
