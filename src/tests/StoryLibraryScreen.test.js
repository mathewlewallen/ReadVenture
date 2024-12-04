import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import StoryLibraryScreen from '../src/screens/StoryLibraryScreen';

const mockAxios = new MockAdapter(axios);

describe('StoryLibraryScreen', () => {
  it('fetches and displays stories', async () => {
    mockAxios.onGet('/stories').reply(200, [
      { _id: 'story1', title: 'Story 1' },
      { _id: 'story2', title: 'Story 2' },
    ]);
    const { findByText } = render(<StoryLibraryScreen />);
    await findByText('Story 1');
    await findByText('Story 2');
  });

  it('displays an error message if fetching stories fails', async () => {
    mockAxios.onGet('/stories').reply(500);
    const { findByText } = render(<StoryLibraryScreen />);
    await findByText('Error'); // Assuming you display an error message
  });

  it('displays a loading indicator while fetching stories', () => {
    mockAxios.onGet('/stories').reply(200, []); // Simulate a delay
    const { getByTestId } = render(<StoryLibraryScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy(); // Assuming you have a loading indicator with a test ID
  });
});