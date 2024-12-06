// src/navigation/Navigation.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegistrationScreen from '../screens/auth/RegistrationScreen';
import HomeScreen from '../screens/HomeScreen';
import StoryLibraryScreen from '../screens/StoryLibraryScreen';
import ReadingScreen from '../screens/reading/ReadingScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ParentDashboardScreen from '../screens/ParentDashboardScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

// Types
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Registration: undefined;
  Home: undefined;
  StoryLibrary: undefined;
  Reading: { storyId: string };
  Progress: undefined;
  ParentDashboard: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: '#ffffff',
  },
  headerTintColor: '#000000',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={defaultScreenOptions}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ title: 'Register' }}
        />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen
          name="StoryLibrary"
          component={StoryLibraryScreen}
          options={{ title: 'Library' }}
        />
        <Stack.Screen name="Reading" component={ReadingScreen} options={{ title: 'Reading' }} />
        <Stack.Screen name="Progress" component={ProgressScreen} options={{ title: 'Progress' }} />
        <Stack.Screen
          name="ParentDashboard"
          component={ParentDashboardScreen}
          options={{ title: 'Parent Dashboard' }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
