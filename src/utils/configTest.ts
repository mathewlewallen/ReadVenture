// src/utils/configTest.ts
import Config from 'react-native-config';

// Validates that all required Firebase configuration keys are present in the environment
export const validateConfig = () => {
  const requiredKeys = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
    'FIREBASE_MEASUREMENT_ID'
  ];

  const missingKeys = requiredKeys.filter(key => !Config[key]);

  if (missingKeys.length > 0) {
    console.error('Missing required env variables:', missingKeys);
    return false;
  }
  return true;
};
