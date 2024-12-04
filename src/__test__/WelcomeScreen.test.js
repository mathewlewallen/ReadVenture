import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../src/screens/WelcomeScreen';

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

describe('WelcomeScreen', () => {
  it('navigates to Login screen when "Login" button is pressed', () => {
    const navigate = jest.fn();
    const { getByText } = renderWithNavigation(<WelcomeScreen navigation={{ navigate }} />);
    fireEvent.press(getByText('Login'));
    expect(navigate).toHaveBeenCalledWith('Login');
  });

  it('navigates to Registration screen when "Register" button is pressed', () => {
    const navigate = jest.fn();
    const { getByText } = renderWithNavigation(<WelcomeScreen navigation={{ navigate }} />);
    fireEvent.press(getByText('Register'));
    expect(navigate).toHaveBeenCalledWith('Registration');
  });
});