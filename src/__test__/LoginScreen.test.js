import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../src/screens/LoginScreen';
import { loginStart, loginSuccess, loginFailure } from '../src/store/authSlice';

const mockStore = configureStore([thunk]);

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

describe('LoginScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('handles login success correctly', async () => {
    const store = mockStore({ auth: { user: null, token: null } });
    const mockSignIn = jest.fn(() => Promise.resolve({
      user: { uid: 'test-user-uid', getIdToken: () => Promise.resolve('test-token') },
    }));
    require('firebase/auth').signInWithEmailAndPassword.mockImplementation(mockSignIn);

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <LoginScreen navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password');
      expect(store.getActions()).toContainEqual(loginStart());
      expect(store.getActions()).toContainEqual(loginSuccess({
        user: { uid: 'test-user-uid', getIdToken: expect.any(Function) },
        token: 'test-token',
      }));
    });
  });

  it('handles login failure correctly', async () => {
    const store = mockStore({ auth: { user: null, token: null } });
    const mockSignIn = jest.fn(() => Promise.reject(new Error('Login failed')));
    require('firebase/auth').signInWithEmailAndPassword.mockImplementation(mockSignIn);

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <LoginScreen navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password');
      expect(store.getActions()).toContainEqual(loginStart());
      expect(store.getActions()).toContainEqual(loginFailure({ error: 'Login failed' }));
    });
  });

  it('navigates to Registration screen when "Register" button is pressed', () => {
    const navigate = jest.fn();
    const { getByText } = render(
      <Provider store={mockStore({ auth: { user: null, token: null } })}>
        <LoginScreen navigation={{ navigate }} />
      </Provider>
    );
    fireEvent.press(getByText('Register'));
    expect(navigate).toHaveBeenCalledWith('Registration');
  });
});