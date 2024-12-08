/*
Generate a complete implementation for this file that:
1. Follows the project's React Native / TypeScript patterns
2. Uses proper imports and type definitions
3. Implements error handling and loading states
4. Includes JSDoc documentation
5. Follows project ESLint/Prettier rules
6. Integrates with existing app architecture
7. Includes proper testing considerations
8. Uses project's defined components and utilities
9. Handles proper memory management/cleanup
10. Follows accessibility guidelines

File requirements:
- Must integrate with Redux store
- Must use React hooks appropriately
- Must handle mobile-specific considerations
- Must maintain type safety
- Must have proper error boundaries
- Must follow project folder structure
- Must use existing shared components
- Must handle navigation properly
- Must scale well as app grows
- Must follow security best practices
*/
// src/firebaseConfig.ts
import { initializeApp, FirebaseOptions, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';
import Config from 'react-native-config';

interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  analytics: Analytics;
}

const validateFirebaseConfig = (
  config: Partial<FirebaseOptions>,
): config is FirebaseOptions => {
  const required: (keyof FirebaseOptions)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
    'measurementId',
  ];

  const missing = required.filter(key => !config[key]);
  if (missing.length > 0) {
    throw new Error(`Missing Firebase configuration: ${missing.join(', ')}`);
  }

  return true;
};

const initializeFirebase = (): FirebaseServices => {
  const firebaseConfig: Partial<FirebaseOptions> = {
    apiKey: Config.FIREBASE_API_KEY,
    authDomain: Config.FIREBASE_AUTH_DOMAIN,
    projectId: Config.FIREBASE_PROJECT_ID,
    storageBucket: Config.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
    appId: Config.FIREBASE_APP_ID,
    measurementId: Config.FIREBASE_MEASUREMENT_ID,
  };

  if (!validateFirebaseConfig(firebaseConfig)) {
    throw new Error('Invalid Firebase configuration');
  }

  try {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth(app);
    const db = getFirestore(app);

    return { app, auth, db, analytics };
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    throw error;
  }
};

const firebase = initializeFirebase();

export const { auth, db, analytics } = firebase;
export default firebase;
// src/services/firebase/analytics.service.ts
import { analytics } from './config';
import { logEvent } from 'firebase/analytics';

class AnalyticsService {
  private static instance: AnalyticsService;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  logStoryRead(storyId: string, userId: string): void {
    logEvent(analytics, 'story_read', {
      story_id: storyId,
      user_id: userId,
    });
  }

  logProgressUpdate(userId: string, progress: number): void {
    logEvent(analytics, 'progress_update', {
      user_id: userId,
      progress,
    });
  }
}

export const analyticsService = AnalyticsService.getInstance();

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your API URL
});

// Function to set the authorization token in the request headers
api.setToken = token => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-project-id.cloudfunctions.net', // Replace with your Firebase Cloud Functions URL
});

api.setToken = token => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

api.handleError = error => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Response error:', error.response.data);
    console.error('Status:', error.response.status);
    console.error('Headers:', error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error('Request error:', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error:', error.message);
  }
  console.error('Error config:', error.config);

  // You can add more specific error handling logic here, such as
  // displaying error messages to the user or retrying the request.
};

export default api;
