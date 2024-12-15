// Unit tests for StoryLibraryScreen component
import { NavigationContainer } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { render } from '@testing-library/react-native';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import StoryLibraryScreen from '@/screens/StoryLibraryScreen';

// Define navigation types
type RootStackParamList = {
  StoryLibrary: undefined;
  Reading: { storyId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Setup mock axios
const mockAxios = new MockAdapter(axios);
const Stack = createNativeStackNavigator<RootStackParamList>();

// Helper function to render component with navigation
const renderWithNavigation = (Component: React.ComponentType<any>) => {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="StoryLibrary" component={Component} />
      </Stack.Navigator>
    </NavigationContainer>,
  );
};

describe('StoryLibraryScreen', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('fetches and displays stories', async () => {
    mockAxios.onGet('/stories').reply(200, [
      { _id: 'story1', title: 'Story 1' },
      { _id: 'story2', title: 'Story 2' },
    ]);

    const { findByText } = renderWithNavigation(StoryLibraryScreen);
    await findByText('Story 1');
    await findByText('Story 2');
  });

  it('displays an error message if fetching stories fails', async () => {
    mockAxios.onGet('/stories').reply(500);
    const { findByText } = renderWithNavigation(StoryLibraryScreen);
    await findByText('Error');
  });

  it('displays a loading indicator while fetching stories', async () => {
    mockAxios.onGet('/stories').reply(200, []);
    const { getByTestId } = renderWithNavigation(StoryLibraryScreen);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
});
