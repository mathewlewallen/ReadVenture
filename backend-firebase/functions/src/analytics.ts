import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/v1/https';
import { ErrorType, handleFirebaseError } from './utils/error';

interface ReadingProgressData {
  storyId: string;
  progress: {
    wordCount: number;
    accuracy: number;
    completionTime: number;
  };
}

interface ChildProgressData {
  childId: string;
  timeRange?: number;
}

/**
 * Tracks user reading progress for a specific story
 * @param data Contains storyId and progress metrics
 * @param context Firebase CallableContext containing auth info
 */
export const trackReadingProgress = functions.https.onCall(
  async (data: ReadingProgressData, context: CallableContext) => {
    if (!context.auth) {
      throw handleFirebaseError(new Error('Unauthorized'), ErrorType.AUTH);
    }

    const { storyId, progress } = data;
    try {
      // TODO: Implement progress tracking logic
      // Add your implementation here using the db instance
      return { success: true };
    } catch (error) {
      throw handleFirebaseError(error, ErrorType.DATABASE);
    }
  },
);

/**
 * Retrieves reading progress for a specific child
 * @param data Contains childId and optional timeRange
 * @param context Firebase CallableContext containing auth info
 */
export const getChildProgress = functions.https.onCall(
  async (data: ChildProgressData, context: CallableContext) => {
    if (!context.auth) {
      throw handleFirebaseError(new Error('Unauthorized'), ErrorType.AUTH);
    }

    const { childId } = data;
    try {
      // TODO: Implement parent dashboard analytics
      // Add your implementation here using the db instance
      return { progress: [] };
    } catch (error) {
      throw handleFirebaseError(error, ErrorType.DATABASE);
    }
  },
);

export const getChildrenAnalytics = functions.https.onCall(
  async (data, context) => {
    const uid = validateAuth(context);

    const childrenQuery = await db
      .collection('users')
      .where('parentEmail', '==', context.auth?.token.email)
      .get();

    return Promise.all(
      childrenQuery.docs.map(async child => {
        const progress = await getChildProgress(child.id);
        return {
          childId: child.id,
          displayName: child.data().displayName,
          progress,
        };
      }),
    );
  },
);
