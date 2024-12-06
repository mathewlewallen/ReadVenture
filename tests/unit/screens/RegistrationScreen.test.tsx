// /ReadVenture/tests/unit/screens/RegistrationScreen.test.ts
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RegistrationScreen from '../../../src/screens/RegistrationScreen';
import { loginStart, loginSuccess, loginFailure } from '../../../src/store/authSlice';

type RootStackParamList = {
  Registration: undefined;
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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
    const navigate = jest.fn();
    const mockCreateUser = jest.fn(() =>
      Promise.resolve({
        user: { uid: 'test-user-uid', getIdToken: () => Promise.resolve('test-token') },
      })
    );
    require('firebase/auth').createUserWithEmailAndPassword.mockImplementation(mockCreateUser);

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <RegistrationScreen navigation={{ navigate } as NavigationProp} />
      </Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(loginStart());
      expect(actions).toContainEqual(
        loginSuccess({
          user: { uid: 'test-user-uid' },
          token: 'test-token',
        })
      );
      expect(navigate).toHaveBeenCalledWith('Home');
    });
  });

  it('handles registration failure correctly', async () => {
    const store = mockStore({ auth: { user: null, token: null } });
    const mockCreateUser = jest.fn(() => Promise.reject(new Error('Registration failed')));
    require('firebase/auth').createUserWithEmailAndPassword.mockImplementation(mockCreateUser);

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <RegistrationScreen navigation={{ navigate: jest.fn() } as NavigationProp} />
      </Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(loginStart());
      expect(actions).toContainEqual(loginFailure('Registration failed'));
    });
  });

  it('validates form inputs before submission', () => {
    const store = mockStore({ auth: { user: null, token: null } });
    const { getByText } = render(
      <Provider store={store}>
        <RegistrationScreen navigation={{ navigate: jest.fn() } as NavigationProp} />
      </Provider>
    );

    fireEvent.press(getByText('Register'));
    expect(getByText('Email is required')).toBeTruthy();
    expect(getByText('Password is required')).toBeTruthy();
  });
});
