// src/navigation/index.ts
import { ParamListBase, RouteProp } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Registration: undefined;
  Home: undefined;
  StoryLibrary: undefined;
  Reading: {
    storyId: string;
    title?: string;
  };
  Progress: undefined;
  Settings: undefined;
  ParentDashboard: {
    childId?: string;
  };
};

export type NavigationProps<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};

// Type guards
export const isReadingScreen = (
  route: RouteProp<ParamListBase, string>
): route is RouteProp<RootStackParamList, 'Reading'> => {
  return route.name === 'Reading';
};

export const isParentDashboard = (
  route: RouteProp<ParamListBase, string>
): route is RouteProp<RootStackParamList, 'ParentDashboard'> => {
  return route.name === 'ParentDashboard';
};

// Create stack navigator
export const Stack = createNativeStackNavigator<RootStackParamList>();

// Navigation utilities
export const getRouteParam = <T extends keyof RootStackParamList>(
  route: RouteProp<RootStackParamList, T>,
  param: keyof RootStackParamList[T]
): RootStackParamList[T][keyof RootStackParamList[T]] | undefined => {
  return route.params?.[param];
};

// Exports
export { default as AppNavigator } from './AppNavigator';
export { default as Navigation } from './Navigation';
export * from './types';
