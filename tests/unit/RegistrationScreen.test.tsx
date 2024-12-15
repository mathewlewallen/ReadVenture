// Unit tests for RegistrationScreen component
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import RegistrationScreen from '@/screens/RegistrationScreen';
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '@/store/slices/authSlice';

const mockStore = configureStore([]);

// Type definitions for navigation
type RootStackParamList = {
  Registration: undefined;
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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
        <RegistrationScreen
          navigation={
            {
              navigate,
              dispatch: jest.fn(),
              reset: jest.fn(),
              setParams: jest.fn(),
              addListener: jest.fn(),
              removeListener: jest.fn(),
              canGoBack: jest.fn(),
              getId: jest.fn(),
              getParent: jest.fn(),
              getState: jest.fn(),
              goBack: jest.fn(),
              isFocused: jest.fn(),
              setOptions: jest.fn(),
            } as unknown as NavigationProp
          }
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

    // Verify expected behavior
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(loginStart());
      expect(actions).toContainEqual(
        loginSuccess({
          user: {
            id: 'test-user-uid',
            email: 'test@example.com',
            parentEmail: 'parent@example.com',
            role: 'student',
            settings: {
              readingLevel: 1,
              soundEffectsEnabled: true,
              textSize: 'medium',
              theme: 'light',
            },
          },
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
          navigation={
            {
              navigate: jest.fn(),
              dispatch: jest.fn(),
              reset: jest.fn(),
              setParams: jest.fn(),
              addListener: jest.fn(),
              removeListener: jest.fn(),
              canGoBack: jest.fn(),
              getId: jest.fn(),
              getParent: jest.fn(),
              getState: jest.fn(),
              goBack: jest.fn(),
              isFocused: jest.fn(),
              setOptions: jest.fn(),
            } as unknown as NavigationProp
          }
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
      expect(actions).toContainEqual(
        loginFailure({ error: 'Registration failed' }),
      );
    });
  });

  // Test form validation
  it('validates form inputs before submission', () => {
    // Setup and render
    const store = mockStore({ auth: { user: null, token: null } });
    const { getByText } = render(
      <Provider store={store}>
        <RegistrationScreen
          navigation={
            {
              navigate: jest.fn(),
              dispatch: jest.fn(),
              reset: jest.fn(),
              setParams: jest.fn(),
              addListener: jest.fn(),
              removeListener: jest.fn(),
              canGoBack: jest.fn(),
              getId: jest.fn(),
              getParent: jest.fn(),
              getState: jest.fn(),
              goBack: jest.fn(),
              isFocused: jest.fn(),
              setOptions: jest.fn(),
            } as unknown as NavigationProp
          }
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
