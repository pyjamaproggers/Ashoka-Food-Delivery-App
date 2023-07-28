import React, { useLayoutEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/outline'; // Import the go back arrow icon

function VendorLogin() {
    const navigation = useNavigation();
    const [selectedRestaurant, setSelectedRestaurant] = useState('');
    const [password, setPassword] = useState('');

    const colorScheme = useColorScheme()
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const handleLogin = () => {
       navigation.navigate('VendorDashboard', {selectedRestaurant} )
    };

    // List of restaurant options
    const restaurantOptions = [
        { label: "Chaat Stall", value: "Chaat Stall" },
        { label: "Chicago Pizza", value: "Chicago Pizza" },
        { label: "Rasananda", value: "Rasananda" },
        { label: "Subway", value: "Subway" },
        { label: "The Hunger Cycle", value: "The Hunger Cycle" },
        { label: "Roti Boti", value: "Roti Boti" },
        { label: "Dhaba", value: "Dhaba" },
        { label: "Dosai", value: "Dosai" },
        { label: "Chai Shai", value: "Chai Shai" },
        { label: "Fuelzone", value: "Fuelzone" },
        { label: "Amul", value: "Amul" },
        { label: "Nescafe", value: "Nescafe" },
    ];

    return (
        <SafeAreaView style={[colorScheme == 'light' ? styles.Lightcontainer : styles.Darkcontainer]}>
            {/* Go back button */}
            <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
                <ArrowLeftIcon width={24} height={24} color="#fff" />
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

                {/* Password input */}
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                    style={styles.input}
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
        top: 20,
        left: 20,
        zIndex: 1,
        padding: 10,
    },
    inputContainer: {
        width: "80%",
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
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
