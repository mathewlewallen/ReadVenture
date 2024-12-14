import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import React from 'react';

import HomeScreen from '../../../../src/screens/HomeScreen';

// Initialize the navigation stack
const Stack = createNativeStackNavigator();

// Define mock navigation props type
interface MockNavigationProps {
  navigate: jest.Mock;
}

/**
 * Helper function to render components with navigation context
 * @param Component React component to render
 * @returns RenderAPI object from @testing-library/react-native
 */
const renderWithNavigation = (Component: React.ComponentType<any>) => {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TestScreen" component={Component} />
      </Stack.Navigator>
    </NavigationContainer>,
  );
};

describe('HomeScreen', () => {
  let mockNavigation: MockNavigationProps;

  // Set up mock navigation before each test
  beforeEach(() => {
    mockNavigation = {
      navigate: jest.fn(),
    };
  });

  // Clean up after each test
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  // Test navigation button rendering
  it('renders all navigation buttons', () => {
    const { getByText } = renderWithNavigation(() => (
      <HomeScreen navigation={mockNavigation as any} />
    ));

    const expectedButtons = [
      'Story Library',
      'Progress',
      'Parent Dashboard',
      'Settings',
    ];

    expectedButtons.forEach((buttonText) => {
      expect(getByText(buttonText)).toBeTruthy();
    });
  });

  // Test navigation functionality for each screen
  const navigationTests = [
    { buttonText: 'Story Library', screenName: 'StoryLibrary' },
    { buttonText: 'Progress', screenName: 'Progress' },
    { buttonText: 'Parent Dashboard', screenName: 'ParentDashboard' },
    { buttonText: 'Settings', screenName: 'Settings' },
  ];

  navigationTests.forEach(({ buttonText, screenName }) => {
    it(`navigates to ${screenName} when ${buttonText} button is pressed`, () => {
      const { getByText } = renderWithNavigation(() => (
        <HomeScreen navigation={mockNavigation as any} />
      ));

      fireEvent.press(getByText(buttonText));
      expect(mockNavigation.navigate).toHaveBeenCalledWith(screenName);
    });
  });

  // Test app title rendering
  it('renders the app title in the header', () => {
    const { getByText } = renderWithNavigation(() => (
      <HomeScreen navigation={mockNavigation as any} />
    ));

    expect(getByText('ReadVenture')).toBeTruthy();
  });
});

// Environment Configuration Tests
describe('Environment Configuration', () => {
  // Define required environment variables
  const requiredKeys = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
    'FIREBASE_MEASUREMENT_ID',
  ] as const;

  const originalConfig = { ...Config };

  // Reset before each test
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    Object.assign(Config, originalConfig);
  });

  // Restore after each test
  afterEach(() => {
    Object.assign(Config, originalConfig);
  });

  // Test required environment variables
  describe('Required Environment Variables', () => {
    test.each(requiredKeys)('has %s configured', (key) => {
      expect(Config[key]).toBeDefined();
      expect(Config[key].length).toBeGreaterThan(0);
    });
  });

  // Test environment validation
  describe('validateEnvironment', () => {
    it('should validate all required environment variables', () => {
      expect(validateEnvironment()).toBeTruthy();
    });

    it('should fail validation when any required variable is missing', () => {
      requiredKeys.forEach((key) => {
        const tempConfig = { ...Config };
        delete tempConfig[key];
        Object.assign(Config, tempConfig);
        expect(() => validateEnvironment()).toThrow(
          `Missing required environment variable: ${key}`,
        );
        Object.assign(Config, originalConfig);
      });
    });
  });

  // Test optional environment variables
  describe('Optional Environment Variables', () => {
    const optionalKeys = [
      'DEBUG_MODE',
      'API_TIMEOUT',
      'CACHE_DURATION',
    ] as const;

    test.each(optionalKeys)('handles optional %s configuration', (key) => {
      const tempConfig = { ...Config };
      delete tempConfig[key];
      Object.assign(Config, tempConfig);
      expect(validateEnvironment()).toBeTruthy();
    });
  });
});
