// src/utils/configTest.ts
import Config from 'react-native-config';

interface EnvConfig {
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  FIREBASE_MEASUREMENT_ID: string;
}

export const validateConfig = (): boolean => {
  const requiredKeys: (keyof EnvConfig)[] = [
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