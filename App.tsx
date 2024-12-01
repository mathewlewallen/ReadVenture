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

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="StoryLibrary" component={StoryLibraryScreen} />
          <Stack.Screen name="Reading" component={ReadingScreen} />
          <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;