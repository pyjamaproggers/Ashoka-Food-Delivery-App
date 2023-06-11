import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AshokaLogo from './assets/ASHOKAWHITELOGO.png'
import RestaurantScreen from './screens/RestaurantScreen';
import Login from './screens/Login';

const Stack = createNativeStackNavigator();

export default function App() {
  return ( 
    <NavigationContainer> 
      <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Restaurant" component={RestaurantScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



