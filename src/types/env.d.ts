// src/types/env.d.ts
declare module 'react-native-config' {
  interface Config {
    // Firebase Configuration
    FIREBASE_API_KEY: string;
    FIREBASE_AUTH_DOMAIN: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_STORAGE_BUCKET: string;
    FIREBASE_MESSAGING_SENDER_ID: string;
    FIREBASE_APP_ID: string;
    FIREBASE_MEASUREMENT_ID: string;

    // API Configuration
    API_URL?: string;
    API_TIMEOUT?: string;

    // App Configuration
    APP_ENV: 'development' | 'staging' | 'production';
    DEBUG_MODE?: 'true' | 'false';

    // MongoDB Configuration (for backend)
    MONGO_URI?: string;
    JWT_SECRET?: string;
  }

  const Config: Config;
  export default Config;
}

// Extend ProcessEnv to include our custom environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv extends Config {}
  }
}