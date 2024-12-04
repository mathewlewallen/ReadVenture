import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import HomeScreen from '../screens/HomeScreen';
import StoryLibraryScreen from '../screens/StoryLibraryScreen';
import ReadingScreen from '../screens/ReadingScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ParentDashboardScreen from '../screens/ParentDashboardScreen';
import SettingsScreen from '../screens/SettingsScreen'; 

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash"> 
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }}/> 
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="StoryLibrary" component={StoryLibraryScreen} />
        <Stack.Screen name="Reading" component={ReadingScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;