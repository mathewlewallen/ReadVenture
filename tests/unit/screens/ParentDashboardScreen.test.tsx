import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ParentDashboardScreen from '../../../src/screens/ParentDashboardScreen';

const mockStore = configureStore([thunk]);

jest.mock('../src/firebaseConfig', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-uid',
      email: 'test@example.com',
      displayName: 'Test User',
    },
    onAuthStateChanged: jest.fn((callback) =>
      callback({
        uid: 'test-user-uid',
        email: 'test@example.com',
        displayName: 'Test User',
      })
    ),
  },
  db: {
    collection: jest.fn(() => ({
      where: jest.fn(() => ({
        getDocs: jest.fn(() =>
          Promise.resolve({
            forEach: jest.fn((callback) => {
              callback({
                id: 'child1',
                data: () => ({
                  username: 'Child 1',
                  progress: { wordsRead: 100, storiesCompleted: 5 },
                }),
              });
              callback({
                id: 'child2',
                data: () => ({
                  username: 'Child 2',
                  progress: { wordsRead: 50, storiesCompleted: 2 },
                }),
              });
            }),
          })
        ),
      })),
    })),
  },
}));

describe('ParentDashboardScreen', () => {
  it('fetches and displays user and children data', async () => {
    const store = mockStore({ auth: { user: { uid: 'test-user-uid' } } });
    const { findByText, getByText } = render(
      <Provider store={store}>
        <ParentDashboardScreen navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    await findByText('Username: Test User');
    await findByText('Email: test@example.com');

    await findByText('Child 1');
    await findByText('Words read: 100');
    await findByText('Stories completed: 5');

    await findByText('Child 2');
    await findByText('Words read: 50');
    await findByText('Stories completed: 2');
  });

  it('updates settings correctly', async () => {
    const store = mockStore({ auth: { user: { uid: 'test-user-uid' } } });
    const mockUpdateDoc = jest.fn(() => Promise.resolve());
    require('../src/firebaseConfig').db.collection.mockReturnValue({
      where: jest.fn(() => ({
        getDocs: jest.fn(() =>
          Promise.resolve({
            forEach: jest.fn(),
          })
        ),
      })),
      doc: jest.fn(() => ({
        updateDoc: mockUpdateDoc,
      })),
    });

    const { findByText } = render(
      <Provider store={store}>
        <ParentDashboardScreen navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    await findByText('Sound Effects');
    fireEvent(findByText('Sound Effects'), 'onValueChange', false); // Assuming a Switch component

    expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), {
      settings: {
        soundEffectsEnabled: false,
      },
    });
  });

  it('navigates to AddChildScreen when "Add Child" button is pressed', async () => {
    const store = mockStore({ auth: { user: { uid: 'test-user-uid' } } });
    const mockNavigate = jest.fn();

    const { findByText } = render(
      <Provider store={store}>
        <ParentDashboardScreen navigation={{ navigate: mockNavigate }} />
      </Provider>
    );

    const addChildButton = await findByText('Add Child');
    fireEvent.press(addChildButton);

    expect(mockNavigate).toHaveBeenCalledWith('AddChildScreen');
  });

  it('handles loading state correctly', () => {
    const store = mockStore({ auth: { user: { uid: 'test-user-uid' } } });
    jest.spyOn(React, 'useEffect').mockImplementation((f) => f()); // Mock useEffect to control loading state
    const { getByTestId } = render(
      <Provider store={store}>
        <ParentDashboardScreen navigation={{ navigate: jest.fn() }} />
      </Provider>
    );
    expect(getByTestId('loading-indicator')).toBeTruthy(); // Assuming you have a loading indicator with a test ID
  });

  it('handles error fetching children data correctly', async () => {
    const store = mockStore({ auth: { user: { uid: 'test-user-uid' } } });
    require('../src/firebaseConfig').db.collection.mockReturnValue({
      where: jest.fn(() => ({
        getDocs: jest.fn(() => Promise.reject(new Error('Firestore error'))),
      })),
    });
    const { findByText } = render(
      <Provider store={store}>
        <ParentDashboardScreen navigation={{ navigate: jest.fn() }} />
      </Provider>
    );
    await findByText('Error'); // Assuming you display an error message
  });
});
