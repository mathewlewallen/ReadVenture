import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

const renderWithNavigation = (component) => {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TestScreen" component={component} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe('HomeScreen', () => {
  it('navigates to StoryLibrary when button is pressed', () => {
    const navigate = jest.fn();
    const { getByText } = renderWithNavigation(<HomeScreen navigation={{ navigate }} />);
    fireEvent.press(getByText('Story Library'));
    expect(navigate).toHaveBeenCalledWith('StoryLibrary');
  });

  it('navigates to Progress when button is pressed', () => {
    const navigate = jest.fn();
    const { getByText } = renderWithNavigation(<HomeScreen navigation={{ navigate }} />);
    fireEvent.press(getByText('Progress'));
    expect(navigate).toHaveBeenCalledWith('Progress');
  });

  it('navigates to ParentDashboard when button is pressed', () => {
    const navigate = jest.fn();
    const { getByText } = renderWithNavigation(<HomeScreen navigation={{ navigate }} />);
    fireEvent.press(getByText('Parent Dashboard'));
    expect(navigate).toHaveBeenCalledWith('ParentDashboard');
  });

  it('navigates to Settings when button is pressed', () => {
    const navigate = jest.fn();
    const { getByText } = renderWithNavigation(<HomeScreen navigation={{ navigate }} />);
    fireEvent.press(getByText('Settings'));
    expect(navigate).toHaveBeenCalledWith('Settings');
  });
});