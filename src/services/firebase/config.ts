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

const validateFirebaseConfig = (config: Partial<FirebaseOptions>): config is FirebaseOptions => {
  const required: (keyof FirebaseOptions)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
    'measurementId',
  ];

  const missing = required.filter((key) => !config[key]);
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
