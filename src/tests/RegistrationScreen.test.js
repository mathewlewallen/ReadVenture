import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RegistrationScreen from '../src/screens/RegistrationScreen';
import { loginStart, loginSuccess, loginFailure } from '../src/store/authSlice';

const mockStore = configureStore([thunk]);

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

describe('RegistrationScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('handles registration success correctly', async () => {
    const store = mockStore({ auth: { user: null, token: null } });
    const mockCreateUser = jest.fn(() => Promise.resolve({
      user: { uid: 'test-user-uid', getIdToken: () => Promise.resolve('test-token') },
    }));
    require('firebase/auth').createUserWithEmailAndPassword.mockImplementation(mockCreateUser);

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <RegistrationScreen navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.changeText(getByPlaceholderText("Parent's Email"), 'parent@example.com');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password');
      expect(store.getActions()).toContainEqual(loginStart());
      expect(store.getActions()).toContainEqual(loginSuccess({
        user: { uid: 'test-user-uid', getIdToken: expect.any(Function) },
        token: 'test-token',
      }));
    });
  });

  it('handles registration failure correctly', async () => {
    const store = mockStore({ auth: { user: null, token: null } });
    const mockCreateUser = jest.fn(() => Promise.reject(new Error('Registration failed')));
    require('firebase/auth').createUserWithEmailAndPassword.mockImplementation(mockCreateUser);

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <RegistrationScreen navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.changeText(getByPlaceholderText("Parent's Email"), 'parent@example.com');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password');
      expect(store.getActions()).toContainEqual(loginStart());
      expect(store.getActions()).toContainEqual(loginFailure({ error: 'Registration failed' }));
    });
  });
});