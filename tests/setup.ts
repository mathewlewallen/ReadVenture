/**
 * Global test setup configuration file
 * Configures testing library extensions and MSW server for API mocking
 */
import '@testing-library/jest-native/extend-expect';
import { server } from './mocks/server';

// Optional: Only import jest-dom if testing web components
// import '@testing-library/jest-dom';

/**
 * Test environment configuration
 * Sets timeout and other global test settings
 */
jest.setTimeout(10000); // 10s timeout for async operations

// Configure console handling
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
  if (args[0]?.includes('Testing Library')) {
    return; // Suppress Testing Library warnings
  }
  originalError.call(console, ...args);
};

console.warn = (...args) => {
  if (args[0]?.includes('act')) {
    return; // Suppress React act() warnings
  }
  originalWarn.call(console, ...args);
};

// MSW Server Setup
beforeAll(async () => {
  try {
    await server.listen({ onUnhandledRequest: 'error' });
  } catch (error) {
    console.error('Failed to start MSW server:', error);
    throw error;
  }
});

afterEach(async () => {
  try {
    server.resetHandlers();
    // Clear any runtime test data
    jest.clearAllMocks();
    jest.clearAllTimers();
  } catch (error) {
    console.error('Error in test cleanup:', error);
  }
});

afterAll(async () => {
  try {
    await server.close();
    // Restore console handlers
    console.error = originalError;
    console.warn = originalWarn;
  } catch (error) {
    console.error('Failed to close MSW server:', error);
    throw error;
  }
});

// Export server for direct access in tests if needed
export { server };
