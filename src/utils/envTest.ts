/**
 * Environment and configuration testing utility
 * src/utils/envTest.ts
 */
import Config from 'react-native-config';

/**
 * Tests and logs various configuration values in development environment
 * Only logs in development mode to prevent sensitive data exposure in production
 */
export const testConfig = (): void => {
  // Only execute in development environment
  if (__DEV__) {
    try {
      // Log basic environment settings
      console.log('[ENV] Environment:', Config.APP_ENV);
      console.log('[ENV] API URL:', Config.API_URL);

      // Log Firebase configuration (sensitive - development only)
      console.log('[ENV] Firebase Config:', {
        apiKey: Config.FIREBASE_API_KEY,
        projectId: Config.FIREBASE_PROJECT_ID,
      });
    } catch (error) {
      console.warn('[ENV] Error reading configuration:', error);
    }
  }
};
