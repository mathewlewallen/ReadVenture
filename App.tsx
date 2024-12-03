import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from './src/store';
import StoryLibraryScreen from './src/screens/StoryLibraryScreen';
import ReadingScreen from './src/screens/ReadingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import ParentDashboardScreen from './src/screens/ParentDashboardScreen';
import WelcomeScreen from './src/screens/WelcomeScreen'; // Import WelcomeScreen
import HomeScreen from './src/screens/HomeScreen';   // Import HomeScreen
import ProgressScreen from './src/screens/ProgressScreen'; // Import ProgressScreen
import SettingsScreen from './src/screens/SettingsScreen'; // Import SettingsScreen

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">  {/* Set Welcome as the initial screen */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} /> 
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="StoryLibrary" component={StoryLibraryScreen} />
          <Stack.Screen name="Reading" component={ReadingScreen} />
          <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
          <Stack.Screen name="Progress" component={ProgressScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;