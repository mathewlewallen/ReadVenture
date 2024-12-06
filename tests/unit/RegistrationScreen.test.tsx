// Unit tests for RegistrationScreen component
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RegistrationScreen from '../../../../src/screens/RegistrationScreen';
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../../../../src/store/authSlice';

// Type definitions for navigation
type RootStackParamList = {
  Registration: undefined;
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Configure mock store with thunk middleware
const mockStore = configureStore([thunk]);

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

describe('RegistrationScreen', () => {
  // Clear AsyncStorage before each test
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  // Test successful registration flow
  it('handles registration success correctly', async () => {
    // Setup test environment
    const store = mockStore({ auth: { user: null, token: null } });
    const navigate = jest.fn();
    const mockCreateUser = jest.fn(() =>
      Promise.resolve({
        user: {
          uid: 'test-user-uid',
          getIdToken: () => Promise.resolve('test-token'),
        },
      }),
    );
    require('firebase/auth').createUserWithEmailAndPassword.mockImplementation(
      mockCreateUser,
    );

    // Render component with mock store and navigation
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <RegistrationScreen navigation={{ navigate } as NavigationProp} />
      </Provider>,
    );

    // Simulate user input
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.changeText(
      getByPlaceholderText("Parent's Email"),
      'parent@example.com',
    );
    fireEvent.press(getByText('Register'));

    // Verify expected behavior
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(loginStart());
      expect(actions).toContainEqual(
        loginSuccess({
          user: { uid: 'test-user-uid' },
          token: 'test-token',
        }),
      );
      expect(navigate).toHaveBeenCalledWith('Home');
    });
  });

  // Test registration failure flow
  it('handles registration failure correctly', async () => {
    // Setup test environment
    const store = mockStore({ auth: { user: null, token: null } });
    const mockCreateUser = jest.fn(() =>
      Promise.reject(new Error('Registration failed')),
    );
    require('firebase/auth').createUserWithEmailAndPassword.mockImplementation(
      mockCreateUser,
    );

    // Render component
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <RegistrationScreen
          navigation={{ navigate: jest.fn() } as NavigationProp}
        />
      </Provider>,
    );

    // Simulate user input
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.changeText(
      getByPlaceholderText("Parent's Email"),
      'parent@example.com',
    );
    fireEvent.press(getByText('Register'));

    // Verify error handling
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(loginStart());
      expect(actions).toContainEqual(loginFailure('Registration failed'));
    });
  });

  // Test form validation
  it('validates form inputs before submission', () => {
    // Setup and render
    const store = mockStore({ auth: { user: null, token: null } });
    const { getByText } = render(
      <Provider store={store}>
        <RegistrationScreen
          navigation={{ navigate: jest.fn() } as NavigationProp}
        />
      </Provider>,
    );

    // Try to submit empty form
    fireEvent.press(getByText('Register'));

    // Verify validation messages
    expect(getByText('Email is required')).toBeTruthy();
    expect(getByText('Password is required')).toBeTruthy();
  });
});
