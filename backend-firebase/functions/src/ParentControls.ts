import { db } from './config';
import type { ReadingSession, ParentData } from '../types';

/**
 * Retrieves child activity data for a specific time period
 *
 * @param parentId - Parent's unique identifier
 * @param timeRange - Time range for activity data (in days)
 * @returns Promise with child activity data
 */
export const getChildActivity = async (
  parentId: string,
  timeRange: number = 7,
): Promise<ReadingSession[]> => {
  try {
    const children = await db
      .collection('users')
      .where('parentId', '==', parentId)
      .get();

    const activities: ReadingSession[] = [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);

    for (const child of children.docs) {
      const sessions = await db
        .collection('readingSessions')
        .where('userId', '==', child.id)
        .where('startTime', '>=', cutoffDate)
        .get();

      activities.push(
        ...sessions.docs.map((doc) => doc.data() as ReadingSession),
      );
    }

    return activities;
  } catch (error) {
    console.error('Error fetching child activity:', error);
    throw error;
  }
};

/**
 * Sets reading time limits and restrictions for children
 *
 * @param parentId - Parent's unique identifier
 * @param settings - Reading limit settings
 */
export const setReadingLimits = async (
  parentId: string,
  settings: ParentData['parentalControls'],
): Promise<void> => {
  try {
    await db.collection('users').doc(parentId).update({
      parentalControls: settings,
    });
  } catch (error) {
    console.error('Error setting reading limits:', error);
    throw error;
  }
};

/**
 * Generates progress reports for children
 *
 * @param parentId - Parent's unique identifier
 * @param timeRange - Time range for report data (in days)
 */
export const getProgressReports = async (
  parentId: string,
  timeRange: number = 30,
) => {
  try {
    const children = await db
      .collection('users')
      .where('parentId', '==', parentId)
      .get();

    const reports = await Promise.all(
      children.docs.map(async (child) => {
        const progress = await db
          .collection('userProgress')
          .doc(child.id)
          .get();

        return {
          childId: child.id,
          childName: child.data().name,
          progress: progress.data(),
        };
      }),
    );

    return reports;
  } catch (error) {
    console.error('Error generating progress reports:', error);
    throw error;
  }
};
