import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AshokaLogo from './assets/ASHOKAWHITELOGO.png'
import RestaurantScreen from './screens/RestaurantScreen';
import Login from './screens/Login';
import { Provider } from 'react-redux';
import { store } from './store';
import UserScreen from './screens/UserScreen';
import PhoneAuthScreen from './screens/PhoneAuthScreen';
import { setupURLPolyfill } from "react-native-url-polyfill"
import CartScreen from './screens/CartScreen';
import {NativeBaseProvider} from 'native-base'

setupURLPolyfill()
const Stack = createNativeStackNavigator();

export default function App() {
    return (
		<NativeBaseProvider>
			<NavigationContainer>
				<Provider store={store}>
					<Stack.Navigator>
						<Stack.Screen name="Login" component={Login} initialParams={{ logout: null }} />
						<Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
						<Stack.Screen name="Home" component={HomeScreen} />
						<Stack.Screen name="Restaurant" component={RestaurantScreen} />
						<Stack.Screen name="UserScreen" component={UserScreen} />
						<Stack.Screen name="Cart" component={CartScreen} />
					</Stack.Navigator>
				</Provider>
			</NavigationContainer>
		</NativeBaseProvider>
    );
}



