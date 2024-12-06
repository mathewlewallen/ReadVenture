// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';

// Store
import store from './store';

// Config
import { validateEnv } from './config/env/envValidation';

// Screens
import LoginScreen from './scree./screens/main/StoryLibraryScreen
import RegistrationScreen from './screens/auth/RegistrationScreen';
import HomeScreen from './screens/main/HomeScreen';
import ParentDashboardScreen from './screens/main/ParentDashboardScreen';
import ProgressScreen from './screens/ProgressScreen';
import ReadingScreen from './screens/ReadingScreen';
import SettingsScreen from './screens/SettingsScreen';
import StoryLibraryScreen from './screens/StoryLibraryScreen';
import WelcomeScreen from './screens/main/WelcomeScreen';

// Types
type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Registration: undefined;
  Home: undefined;
  StoryLibrary: undefined;
  Reading: { storyId: string };
  ParentDashboard: undefined;
  Progress: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isValidEnv, setIsValidEnv] = useState(false);

  useEffect(() => {
    const validateEnvironment = async () => {
      try {
        await validateEnv();
        setIsValidEnv(true);
      } catch (error) {
        console.error('Environment validation failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    validateEnvironment();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isValidEnv) {
    return (
      <View style={styles.container}>
        <Text>Environment configuration error</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="StoryLibrary" component={StoryLibraryScreen} />
          <Stack.Screen name="Reading" component={ReadingScreen} />
          <Stack.Screen
            name="ParentDashboard"
            component={ParentDashboardScreen}
          />
          <Stack.Screen name="Progress" component={ProgressScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default App;
