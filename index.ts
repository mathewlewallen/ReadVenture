/**
 * Entry point for the ReadVenture mobile application
 * Initializes both React Native app and backend server components
 */

import { AppRegistry } from 'react-native';
import { AppConfig } from 'react-native-config';
import App from './src/App';
import { name as appName } from './app.json';
import { initializeServer } from './server';
import { initializeErrorBoundary } from './src/utils/errorBoundary';

// Initialize global error handling
initializeErrorBoundary();

// Register the main app component
AppRegistry.registerComponent(appName, () => App);

// Start server in development mode only
if (__DEV__) {
  try {
    initializeServer().catch(error => {
      console.error('Failed to initialize development server:', error);
    });
  } catch (error) {
    console.error('Development server setup failed:', error);
  }
}

// Export app name for external references
export { appName };
