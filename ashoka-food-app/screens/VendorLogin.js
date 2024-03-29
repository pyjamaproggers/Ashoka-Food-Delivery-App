import React, { useLayoutEffect, useState, useEffect} from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, useColorScheme, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/outline'; // Import the go back arrow icon
import {IP} from "@dotenv"
import AsyncStorage from '@react-native-async-storage/async-storage';

function VendorLogin() {
    const navigation = useNavigation();
    const [selectedRestaurant, setSelectedRestaurant] = useState('');
    const [selectedPerson, setSelectedPerson] = useState('');
    const [password, setPassword] = useState('');

    const colorScheme = useColorScheme()
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const handleLogin = async () => {
        if (!selectedRestaurant || !selectedPerson || !password) {
            Alert.alert("Please fill in all input fields!")
            return;
        }
        try {
            const verified = await verifyPassword();
            if (verified) {
                AsyncStorage.setItem("@vendor", JSON.stringify({selectedRestaurant, selectedPerson}));
                navigation.navigate('VendorDisclaimer', {
                    selectedRestaurant,
                    selectedPerson,
                });
            } else {
                Alert.alert('Incorrect password');
            }
        } catch (error) {
            console.log('Error verifying password:', error);
        }
    };
    

    async function verifyPassword() {
        try {
            const response = await fetch(`${IP}/api/auth/${selectedRestaurant}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data.verified)
                return data.verified;
            } else {
                console.log('Password verification failed');
                return false;
            }
        } catch (error) {
            console.log('Error verifying password:', error);
            return false;
        }
    }
    
    

    // List of restaurant options
    const restaurantOptions = [
        { label: "The Food Village", value: "The Food Village" },
        { label: "Chicago Pizza", value: "Chicago Pizza" },
        { label: "Rasananda", value: "Rasananda" },
        { label: "Subway", value: "Subway" },
        { label: "The Hunger Cycle", value: "The Hunger Cycle" },
        { label: "Roti Boti", value: "Roti Boti" },
        { label: "Shuddh Desi Dhaba", value: "Shuddh Desi Dhaba" },
        { label: "Dosai", value: "Dosai" },
        { label: "Chai Shai", value: "Chai Shai" },
        { label: "Fuelzone", value: "Fuelzone" },
        { label: "Amul", value: "Amul" },
        { label: "Nescafe", value: "Nescafe" },
    ];

    const personOptions = [
        { label: "Manager", value: "Manager" },
        { label: "Delivery Bhaiya", value: "Delivery Bhaiya" },
    ];

    useEffect(() => {
        const fetchVendorData = async () => {
            try {
                const user = await AsyncStorage.getItem('@vendor');
                console.log(user)
                if (user) {
                    const parsedUser = JSON.parse(user);
                    navigation.navigate('VendorDashboard', parsedUser);
                }
            } catch (error) {
                console.log('Error fetching vendor data:', error);
            }
        };
    
        fetchVendorData();
    }, []);
    
    return (
        <SafeAreaView style={[colorScheme == 'light' ? styles.Lightcontainer : styles.Darkcontainer]}>
            {/* Go back button */}
            <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
                <ArrowLeftIcon width={24} height={24} style={[colorScheme=='light'? {color: '#000'}: {color: '#fff'}]} />
            </TouchableOpacity>
            <View style={styles.inputContainer}>
                {/* Dropdown for selecting restaurant */}
                <View style={styles.selectRestaurantBox}>
                    <RNPickerSelect
                        placeholder={{
                            label: "Select Restaurant",
                            value: null,
                        }}
                        onValueChange={(itemValue) => setSelectedRestaurant(itemValue)}
                        items={restaurantOptions}
                        style={pickerSelectStyles}
                    />
                </View>

                <View style={styles.selectRestaurantBox}>
                    <RNPickerSelect
                        placeholder={{
                            label: "Who are you?",
                            value: null,
                        }}
                        onValueChange={(itemValue) => setSelectedPerson(itemValue)}
                        items={personOptions}
                        style={pickerSelectStyles}
                    />
                </View>

                {/* Password input */}
                <TextInput
                    placeholder="Password"
                    placeholderTextColor='gray'
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                    style={styles.inputLight}
                />

                {/* Login button */}
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    Lightcontainer: {
        flex: 1,
        backgroundColor: "#F2F2F2",
        justifyContent: "center",
        alignItems: "center",
    },
    Darkcontainer: {
        flex: 1,
        backgroundColor: '#0c0c0f',
        justifyContent: "center",
        alignItems: "center",
    },
    goBackButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1,
        padding: 10,
    },
    inputContainer: {
        width: "80%",
        justifyContent: "center",
        alignItems: "center",
    },
    inputLight: {
        height: 40,
        width: "100%",
        backgroundColor: '#ffffff',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    inputDark: {
        height: 40,
        width: "100%",
        backgroundColor: '#262626',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#3E5896", // Ashoka University primary color
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: "100%",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
    selectRestaurantBox: {
        backgroundColor: "#fff",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 20,
        paddingHorizontal: 10,
        width: "100%",
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 8,
    },
});

export default VendorLogin;
