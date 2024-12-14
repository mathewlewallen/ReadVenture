// Import Firebase admin and types at the top
import { db } from './utils/admin';
import { UserProgress, ChildAnalytics } from './types.d';

/**
 * Tracks user reading progress for a specific story
 */
export const trackReadingProgress = functions.https.onCall(
  async (data: ReadingProgressData, context: CallableContext) => {
    if (!context.auth) {
      throw handleFirebaseError(new Error('Unauthorized'), ErrorType.AUTH);
    }

    const { storyId, progress } = data;
    const userId = context.auth.uid;

    try {
      // Update progress in Firestore
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
 * Gets progress data for a specific child
 */
export const getChildProgress = async (
  childId: string,
): Promise<ChildAnalytics> => {
  const progressDoc = await db.collection('userProgress').doc(childId).get();
  const userDoc = await db.collection('users').doc(childId).get();

  if (!progressDoc.exists || !userDoc.exists) {
    throw new Error('Child data not found');
  }

  const progress = progressDoc.data() as UserProgress;
  const userData = userDoc.data();

  return {
    childId,
    displayName: userData.displayName,
    totalWordsRead: progress.totalWordsRead || 0,
    averageAccuracy: progress.averageAccuracy || 0,
    storiesCompleted: progress.storiesCompleted || 0,
    lastActivity: progress.lastActivity,
    readingLevel: userData.readingLevel || 'Beginner',
  };
};

/**
 * Gets analytics for all children of a parent
 */
export const getChildrenAnalytics = functions.https.onCall(
  async (data, context: CallableContext) => {
    if (!context.auth) {
      throw handleFirebaseError(new Error('Unauthorized'), ErrorType.AUTH);
    }

    try {
      const childrenQuery = await db
        .collection('users')
        .where('parentEmail', '==', context.auth.token.email)
        .get();

      const childrenAnalytics = await Promise.all(
        childrenQuery.docs.map(async (child) => {
          return await getChildProgress(child.id);
        }),
      );

      return { children: childrenAnalytics };
    } catch (error) {
      throw handleFirebaseError(error, ErrorType.DATABASE);
    }
  },
);
