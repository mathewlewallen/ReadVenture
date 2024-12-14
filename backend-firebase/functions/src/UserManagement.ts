/**
 * Updates a user's reading progress
 *
 * @param userId - User's unique identifier
 * @param progress - Progress data to update
 * @returns Promise<void>
 */
export const updateProgress = async (
  userId: string,
  progress: Partial<UserProgress>,
): Promise<void> => {
  try {
    const progressRef = db.collection('userProgress').doc(userId);
    await progressRef.update({
      ...progress,
      timestamp: FirebaseFirestore.Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};

/**
 * Retrieves dashboard data for parent users
 *
 * @param parentId - Parent's unique identifier
 * @returns Promise<ChildAnalytics[]>
 */
export const getParentDashboard = async (
  parentId: string,
): Promise<ChildAnalytics[]> => {
  try {
    const childrenRef = await db
      .collection('users')
      .where('parentId', '==', parentId)
      .get();

    const childrenAnalytics: ChildAnalytics[] = [];

    for (const child of childrenRef.docs) {
      const progressRef = await db
        .collection('userProgress')
        .doc(child.id)
        .get();

      childrenAnalytics.push({
        childId: child.id,
        displayName: child.data().displayName,
        progress: progressRef.data() || {
          totalWordsRead: 0,
          storiesCompleted: 0,
          averageAccuracy: 0,
          lastActivity: FirebaseFirestore.Timestamp.now(),
        },
      });
    }

    return childrenAnalytics;
  } catch (error) {
    console.error('Error getting parent dashboard:', error);
    throw error;
  }
};

/**
 * Updates user settings
 *
 * @param userId - User's unique identifier
 * @param settings - Settings to update
 * @returns Promise<void>
 */
export const updateUserSettings = async (
  userId: string,
  settings: Partial<UserSettings>,
): Promise<void> => {
  try {
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      settings: {
        ...settings,
        updatedAt: FirebaseFirestore.Timestamp.now(),
      },
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};
