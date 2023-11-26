import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import UserProfile from './components/userProfile'
import Login from './components/Login';
import MainPage from './components/MainPage';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        {/* Add more screens as needed */}
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="MainPage" component={MainPage} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0', // Grey background color

  },
});