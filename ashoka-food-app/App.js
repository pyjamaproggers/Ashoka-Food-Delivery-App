import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import VendorLogin from './screens/VendorLogin';
import AshokaLogo from './assets/ASHOKAWHITELOGO.png'
import RestaurantScreen from './screens/RestaurantScreen';
import Login from './screens/Login';
import { Provider } from 'react-redux';
import { store } from './store';
import UserScreen from './screens/UserScreen';
import PhoneAuthScreen from './screens/PhoneAuthScreen';
import { setupURLPolyfill } from "react-native-url-polyfill"
import CartScreen from './screens/CartScreen';
import { NativeBaseProvider } from 'native-base'
import VendorDashboard from './screens/VendorDashboard';
import LiveOrders from './screens/LiveOrders';
import OrderHistory from './screens/OrderHistory';
import EachOrder from './screens/EachOrder';
import ManageSpendings from './screens/ManageSpendings';
import StudentDisclaimer from './screens/StudentDisclaimer'
import VendorDisclaimer from './screens/VendorDisclaimer'
import Credits from './screens/Credits'

setupURLPolyfill()
const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NativeBaseProvider>
            <Provider store={store}>
                <NavigationContainer>
                    <Stack.Navigator>

                        {/* Student Auth */}
                        <Stack.Screen name="Login" component={Login} initialParams={{ logout: null }} />
                        <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
                        <Stack.Screen name="StudentDisclaimer" component={StudentDisclaimer} />
                        <Stack.Screen name="VendorDisclaimer" component={VendorDisclaimer}/>

                        {/* Vendor Auth */}
                        <Stack.Screen name="VendorLogin" component={VendorLogin} />
                        <Stack.Screen name="VendorDashboard" component={VendorDashboard} />

                        {/* Home/Restaurants */}
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Restaurant" component={RestaurantScreen} />
                        <Stack.Screen name="Cart" component={CartScreen} />
                        <Stack.Screen name="LiveOrders" component={LiveOrders} 
                            options={{  
                                gestureDirection: 'vertical'
                            }}
                        />

                        {/* User Functionalities */}
                        <Stack.Screen name="UserScreen" component={UserScreen} />
                        <Stack.Screen name="OrderHistory" component={OrderHistory} />
                        <Stack.Screen name="EachOrder" component={EachOrder} />
                        <Stack.Screen name="Credits" component={Credits} />
                        {/* <Stack.Screen name="ManageSpendings" component={ManageSpendings}  /> */}
                        
                    </Stack.Navigator>
                </NavigationContainer>
            </Provider>
        </NativeBaseProvider>
    );
}



