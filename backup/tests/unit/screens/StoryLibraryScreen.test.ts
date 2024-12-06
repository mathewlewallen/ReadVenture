// /ReadVenture/tests/unit/screens/StoryLibraryScreen.test.ts
import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import StoryLibraryScreen from '../../../src/screens/StoryLibraryScreen';

type RootStackParamList = {
  StoryLibrary: undefined;
  Reading: { storyId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const mockAxios = new MockAdapter(axios);
const Stack = createNativeStackNavigator<RootStackParamList>();

const renderWithNavigation = (Component: React.ComponentType<any>) => {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="StoryLibrary" component={Component} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe('StoryLibraryScreen', () => {
  beforeEach(() => {
    mockAxios.reset();
  });