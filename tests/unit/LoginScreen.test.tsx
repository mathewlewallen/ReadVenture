import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProps } from '../../../../src/navigation';
import LoginScreen from '../../../../src/screens/auth/LoginScreen';
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../../../../src/store/authSlice';

// Configure mock store with thunk middleware
const mockStore = configureStore([thunk]);

// Define navigation mock interface
interface MockNavigationProps {
  navigate: jest.Mock;
}

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn(),
}));

describe('LoginScreen', () => {
  let store: any;
  let mockNavigation: MockNavigationProps;

  // Reset state before each test
  beforeEach(() => {
    store = mockStore({
      auth: { user: null, token: null, loading: false, error: null },
    });
    mockNavigation = {
      navigate: jest.fn(),
    };
    AsyncStorage.clear.mockClear();
    AsyncStorage.setItem.mockClear();
  });

  // Test successful login flow
  it('handles login success correctly', async () => {
    const mockToken = 'test-token';
    const mockUser = {
      uid: 'test-user-uid',
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };

    require('firebase/auth').signInWithEmailAndPassword.mockResolvedValueOnce({
      user: mockUser,
    });

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <LoginScreen navigation={mockNavigation as any} />
      </Provider>,
    );

    // Simulate user input and login action
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));

    // Verify login flow and navigation
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(loginStart());
      expect(actions).toContainEqual(
        loginSuccess({ user: mockUser, token: mockToken }),
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('token', mockToken);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    });
  });

  // Test login failure handling
  it('handles login failure correctly', async () => {
    const mockError = new Error('Invalid credentials');
    require('firebase/auth').signInWithEmailAndPassword.mockRejectedValueOnce(
      mockError,
    );

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <LoginScreen navigation={mockNavigation as any} />
      </Provider>,
    );

    // Simulate failed login attempt
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
    fireEvent.press(getByText('Login'));

    // Verify error handling
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(loginStart());
      expect(actions).toContainEqual(
        loginFailure({ error: mockError.message }),
      );
    });
  });

  // Test form validation
  it('validates form fields before submission', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={mockNavigation as any} />
      </Provider>,
    );

    fireEvent.press(getByText('Login'));

    // Verify form validation prevents API call
    await waitFor(() => {
      expect(
        require('firebase/auth').signInWithEmailAndPassword,
      ).not.toHaveBeenCalled();
    });
  });

  // Test navigation to registration
  it('navigates to registration screen', () => {
    const { getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={mockNavigation as any} />
      </Provider>,
    );

    fireEvent.press(getByText("Don't have an account? Register"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Registration');
  });

  // Test password visibility toggle
  it('shows/hides password when visibility toggle is pressed', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Provider store={store}>
        <LoginScreen navigation={mockNavigation as any} />
      </Provider>,
    );

    const passwordInput = getByPlaceholderText('Password');
    const visibilityToggle = getByTestId('password-visibility-toggle');

    // Verify password visibility toggle functionality
    expect(passwordInput.props.secureTextEntry).toBe(true);
    fireEvent.press(visibilityToggle);
    expect(passwordInput.props.secureTextEntry).toBe(false);
  });
});
