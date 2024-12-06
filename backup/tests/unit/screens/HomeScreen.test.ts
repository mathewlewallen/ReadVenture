import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationProps } from '../../../src/navigation';
import HomeScreen from '../../../src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

interface MockNavigationProps {
  navigate: jest.Mock;
}

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

  beforeEach(() => {
    mockNavigation = {
      navigate: jest.fn(),
    };
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('renders all navigation buttons', () => {
    const { getByText } = renderWithNavigation(() => (
      <HomeScreen navigation={mockNavigation as any} />
    ));

    expect(getByText('Story Library')).toBeTruthy();
    expect(getByText('Progress')).toBeTruthy();
    expect(getByText('Parent Dashboard')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });

  it('navigates to StoryLibrary when button is pressed', () => {
    const { getByText } = renderWithNavigation(() => (
      <HomeScreen navigation={mockNavigation as any} />
    ));
    
    fireEvent.press(getByText('Story Library'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('StoryLibrary');
  });

  it('navigates to Progress when button is pressed', () => {
    const { getByText } = renderWithNavigation(() => (
      <HomeScreen navigation={mockNavigation as any} />
    ));
    
    fireEvent.press(getByText('Progress'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Progress');
  });

  it('navigates to ParentDashboard when button is pressed', () => {
    const { getByText } = renderWithNavigation(() => (
      <HomeScreen navigation={mockNavigation as any} />
    ));
    
    fireEvent.press(getByText('Parent Dashboard'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ParentDashboard');
  });

  it('navigates to Settings when button is pressed', () => {
    const { getByText } = renderWithNavigation(() => (
      <HomeScreen navigation={mockNavigation as any} />
    ));
    
    fireEvent.press(getByText('Settings'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Settings');
  });

  it('renders the app title in the header', () => {
    const { getByText } = renderWithNavigation(() => (
      <HomeScreen navigation={mockNavigation as any} />
    ));
    
    expect(getByText('ReadVenture')).toBeTruthy();
  });
});