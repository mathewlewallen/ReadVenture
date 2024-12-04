// src/utils/envTest.js
import Config from 'react-native-config';

export const testConfig = () => {
  console.log('Firebase Config:', {
    apiKey: Config.FIREBASE_API_KEY,
    projectId: Config.FIREBASE_PROJECT_ID
  });
};