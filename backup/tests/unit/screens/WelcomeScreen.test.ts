// ReadVenture/tests/unit/screens/WelcomeScreen.test.ts
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import WelcomeScreen from '../src/screens/WelcomeScreen';

type RootStackParamList = {
  TestScreen: undefined;
  Login: undefined;
  Registration: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const renderWithNavigation = (Component: React.ComponentType<any>) => {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TestScreen" component={Component} />
      </Stack.Navigator>
    </NavigationContainer>,
  );
};

describe('WelcomeScreen', () => {
  it('navigates to Login screen when "Login" button is pressed', () => {
    const navigate = jest.fn();
    const mockNavigation = {
      navigate,
    } as unknown as NavigationProp;
    
    const {getByText} = renderWithNavigation(() => <WelcomeScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('Login'));
    expect(navigate).toHaveBeenCalledWith('Login');
  });

  it('navigates to Registration screen when "Register" button is pressed', () => {
    const navigate = jest.fn();
    const mockNavigation = {
      navigate,
    } as unknown as NavigationProp;
    
    const {getByText} = renderWithNavigation(() => <WelcomeScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('Register'));
    expect(navigate).toHaveBeenCalledWith('Registration');
  });
});