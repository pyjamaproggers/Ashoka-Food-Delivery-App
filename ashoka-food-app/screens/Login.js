import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, useColorScheme, Alert as ReactNativeAlert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useNavigation, useRoute } from '@react-navigation/native';
import { IOS, WEB, EXPO, ANDROID } from '@dotenv'
import AshokaLogo from '../assets/ashokauniversity.png';
import { ArrowRightIcon } from 'react-native-heroicons/outline';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styles from '../components/Styles';
import { HStack, VStack } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

WebBrowser.maybeCompleteAuthSession();

function Login() {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [loggedOut, setLoggedOut] = useState(0);
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: IOS,
        webClientId: WEB,
        expoClientId: EXPO,
        androidClientId: ANDROID
    });

    const colorScheme = useColorScheme();

    const {
        params: { logout: logoutParam, phone: phone },
    } = useRoute();
    console.log(phone)
    console.log("LOGOUT = " + logoutParam)
    if (logoutParam === 1 && loggedOut === 0) {
        console.log("LOGOUT TIME");
        (async () => {
            try {
                await AsyncStorage.removeItem("@user");
                setUser(null);
                setLoggedOut(1);
                navigation.navigate("Login", { logout: 0 });
            } catch (error) {
                console.log("Logout error:", error);
            }
        })();
    }

    if (phone) {
        console.log(phone + " received at top level!");

        const updateUserPhone = async () => {
            let actualUser = await AsyncStorage.getItem("@user");
            actualUser = JSON.parse(actualUser); // Parse the JSON string into an object
            actualUser.phone = phone;
            console.log(actualUser);
            AsyncStorage.setItem("@user", JSON.stringify(actualUser));
            console.log("Phone number added now: " + JSON.stringify(actualUser));
            navigation.navigate('StudentDisclaimer', { actualUser });
        };

        updateUserPhone(); // Call the async function to update user phone number
    }

    async function handleSigninWithGoogle() {
        const userCheck = await AsyncStorage.getItem("@user");
        const disclaimerCheck = await AsyncStorage.getItem("@studentdisclaimer")
        console.log(disclaimerCheck)
        if (!userCheck) {
            console.log("No User...")
            if (response?.type === "success") {
                await getUserInfo(response.authentication.accessToken);
            }

        }
        else {
            const actualUser = JSON.parse(userCheck);
            console.log("There is user... and it is= " + typeof (actualUser))
            setUser(actualUser);
            setLoggedOut(0);
            if (actualUser.phone) {
                console.log("There is user and PHONE")
                if(disclaimerCheck)
                {
                    navigation.navigate('Home', { actualUser })
                }
                else
                {
                    navigation.navigate('StudentDisclaimer', { actualUser })
                }
                
            }
            else if (!actualUser.phone && phone) {
                console.log(phone + " received!");
                console.log("Before adding phone" + typeof (actualUser))
                actualUser['phone'] = phone;
                console.log("AFTER adding phone" + typeof (actualUser))
                AsyncStorage.setItem("@user", JSON.stringify(actualUser))
                console.log("Phone number added noww: " + actualUser)
                navigation.navigate('StudentDisclaimer', { actualUser })
            }
            else if (!actualUser.phone && !phone) {
                console.log("Time to get Phone")
                navigation.navigate('PhoneAuth', { actualUser, from: 'Login' })
            }

        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const getUserInfo = async (token) => {
        if (!token) return;
        
        try {
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            const actualUser = await response.json();
            
            const authorisedEmails = [
                'aryan.yadav_asp24@ashoka.edu.in',
                'zahaan.shapoorjee_ug24@ashoka.edu.in'
            ];
            
            if (authorisedEmails.includes(actualUser.email)) {
                setUser(actualUser);
                setLoggedOut(0);
                const storageUser = JSON.stringify(actualUser);
                AsyncStorage.setItem("@user", storageUser);
                console.log("User set to " + actualUser.email);
                navigation.navigate('PhoneAuth', { actualUser, from: 'Login' });
            } else {
                ReactNativeAlert.alert("Sorry! You are not authorized for Beta Testing!");
            }
        } catch (err) {
            console.log(err);
        }
    };
    

    useEffect(() => {
        handleSigninWithGoogle();
    }, [response])

    return (
        <View
            style={[colorScheme == 'light' ? styles.Lightcontainer : styles.Darkcontainer]}
        >
            <VStack className='w-full h-screen content-center justify-center'>
                <Image source={AshokaLogo} className='self-center' style={{resizeMode:"contain", width: '80%', }}/>
                <HStack space={5} className='w-screen justify-center '>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("VendorLogin")}>
                        <Text style={styles.buttonText}>Vendor Sign In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
                        <Text style={styles.buttonText}>Student Sign In</Text>
                    </TouchableOpacity>
                </HStack>

            </VStack>
        </View>
    );
}

const styles = StyleSheet.create({
    Lightcontainer: {
        backgroundColor: "#F2F2F2",
        alignItems: "center",
    },
    Darkcontainer: {
        backgroundColor: '#0c0c0f',
        alignItems: "center",
    },
    image: {
        width: "100%",
        resizeMode: "contain",
    },
    button: {
        backgroundColor: "#3E5896", // Ashoka University primary color
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        top: -20
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
});

export default Login;