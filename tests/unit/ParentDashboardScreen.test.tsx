import { render, fireEvent } from '@testing-library/react-native'; // Added missing fireEvent import
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ParentDashboardScreen from '../../../../src/screens/ParentDashboardScreen'; // Fixed import path

// Configure mock store with thunk middleware
const mockStore = configureStore([thunk]);

// Mock Firebase configuration
jest.mock('../../../../src/firebaseConfig', () => ({
  // Fixed mock path
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
      }),
    ),
  },
  db: {
    collection: jest.fn(() => ({
      where: jest.fn(() => ({
        getDocs: jest.fn(() =>
          Promise.resolve({
            forEach: jest.fn((callback) => {
              // Mock child data
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
          }),
        ),
      })),
    })),
  },
}));

describe('ParentDashboardScreen', () => {
  // Test case for fetching and displaying data
  it('fetches and displays user and children data', async () => {
    const store = mockStore({ auth: { user: { uid: 'test-user-uid' } } });
    const { findByText } = render(
      <Provider store={store}>
        <ParentDashboardScreen navigation={{ navigate: jest.fn() }} />
      </Provider>,
    );

    // Verify user information is displayed
    await findByText('Username: Test User');
    await findByText('Email: test@example.com');

    // Verify first child's information
    await findByText('Child 1');
    await findByText('Words read: 100');
    await findByText('Stories completed: 5');

    // Verify second child's information
    await findByText('Child 2');
    await findByText('Words read: 50');
    await findByText('Stories completed: 2');
  });

  // Test case for settings update
  it('updates settings correctly', async () => {
    const store = mockStore({ auth: { user: { uid: 'test-user-uid' } } });
    const mockUpdateDoc = jest.fn(() => Promise.resolve());

    // Mock Firestore document update
    jest
      .requireMock('../../../../src/firebaseConfig')
      .db.collection.mockReturnValue({
        where: jest.fn(() => ({
          getDocs: jest.fn(() =>
            Promise.resolve({
              forEach: jest.fn(),
            }),
          ),
        })),
        doc: jest.fn(() => ({
          update: mockUpdateDoc, // Changed updateDoc to update to match Firestore API
        })),
      });

    const { findByText } = render(
      <Provider store={store}>
        <ParentDashboardScreen navigation={{ navigate: jest.fn() }} />
      </Provider>,
    );

    const soundEffectsToggle = await findByText('Sound Effects');
    fireEvent(soundEffectsToggle, 'onValueChange', false);

    // Verify settings update
    expect(mockUpdateDoc).toHaveBeenCalledWith({
      settings: {
        soundEffectsEnabled: false,
      },
    });
  });

  // Test case for navigation
  it('navigates to AddChildScreen when "Add Child" button is pressed', async () => {
    const store = mockStore({ auth: { user: { uid: 'test-user-uid' } } });
    const mockNavigate = jest.fn();

    const { findByText } = render(
      <Provider store={store}>
        <ParentDashboardScreen navigation={{ navigate: mockNavigate }} />
      </Provider>,
    );

    const addChildButton = await findByText('Add Child');
    fireEvent.press(addChildButton);

    expect(mockNavigate).toHaveBeenCalledWith('AddChildScreen');
  });

  // Test case for loading state
  it('handles loading state correctly', () => {
    const store = mockStore({ auth: { user: { uid: 'test-user-uid' } } });
    const { getByTestId } = render(
      <Provider store={store}>
        <ParentDashboardScreen navigation={{ navigate: jest.fn() }} />
      </Provider>,
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  // Test case for error handling
  it('handles error fetching children data correctly', async () => {
    const store = mockStore({ auth: { user: { uid: 'test-user-uid' } } });

    // Mock Firestore error
    jest
      .requireMock('../../../../src/firebaseConfig')
      .db.collection.mockReturnValue({
        where: jest.fn(() => ({
          getDocs: jest.fn(() => Promise.reject(new Error('Firestore error'))),
        })),
      });

    const { findByText } = render(
      <Provider store={store}>
        <ParentDashboardScreen navigation={{ navigate: jest.fn() }} />
      </Provider>,
    );

    await findByText('Error');
  });
});
