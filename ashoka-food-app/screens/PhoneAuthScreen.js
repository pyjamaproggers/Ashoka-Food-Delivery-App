import React, { useLayoutEffect, useState, useRef } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList, Alert, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { firebaseConfig } from '../firebaseConfig';
import firebase from 'firebase/compat/app';
import PhoneInput from 'react-native-phone-number-input';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Styles from '../components/Styles';

const PhoneAuthScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [phoneNumberFormatted, setPhoneNumberFormatted] = useState('')
    const [validity, setValidity] = useState(false);
    const [code, setCode] = useState('')
    const [verificationID, setVerificationID] = useState(null)
    const recaptchaVerifier = useRef(null)
    const phoneInput = useRef(null);

    const navigation = useNavigation();
    const colorScheme=useColorScheme();

    const {
        params: { actualUser },
    } = useRoute();

    const styles = StyleSheet.create({
        backButton: {
            width: "10%",
            marginLeft: 20,
            backgroundColor: 'white'
        },
        OTPButton: {
            backgroundColor: "#3E5896", // Ashoka University primary color
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            marginBottom: 12
        },
        OTPButtonText: {
            color: "#fff",
            fontSize: 16,
            textAlign: "center",
        },
        borderStyleBase: {
            width: 30,
            height: 45
        },

        borderStyleHighLighted: {
            borderColor: "#3E5896",
        },

        LightunderlineStyleBase: {
            width: 30,
            height: 45,
            borderWidth: 0,
            borderBottomWidth: 1,
            color: 'black'
        },
        DarkunderlineStyleBase: {
            width: 30,
            height: 45,
            borderWidth: 0,
            borderBottomWidth: 1,
            color: 'white'
        },

        underlineStyleHighLighted: {
            borderColor: "#3E5896",
        },
    })

    const sendVerification = (validity) => {
        if (validity === true) {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            phoneProvider.verifyPhoneNumber(phoneNumberFormatted, recaptchaVerifier.current).then(setVerificationID)
            console.log(actualUser)
            actualUser['phone'] = phoneNumberFormatted
            setPhoneNumber('')
        }
        else if (validity === false) {
            alert('This phone number seems to be incorrect! Please check again, thank you.')
        }
    }

    const confirmCode = (code) => {
        const credential = new firebase.auth.PhoneAuthProvider.credential(
            verificationID,
            code
        )
        firebase.auth().signInWithCredential(credential)
            .then(() => {
                navigation.navigate('Login', {phone:phoneNumberFormatted})
                setCode('');
                Alert.alert(
                    'Welcome to AshokaEats'
                )
            })
            .catch((error) => {
                console.log(error)
                Alert.alert('Incorrect OTP! Please check again, thank you.')
            })

    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    return (
        <SafeAreaView className='h-screen' style={[colorScheme=='light'? {backgroundColor: '#F2F2F2'} : {backgroundColor: '#0c0c0f'}]}>

            <View className='justify-center'>
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                />

                {/* Go back Button */}
                <TouchableOpacity onPress={navigation.goBack} className="p-2 bg-gray-100 rounded-full items-center" style={styles.backButton}>
                    <ArrowLeftIcon size={20} color="black" />
                </TouchableOpacity>

                <Text className='text-center text-lg font-normal' style={[colorScheme=='light'? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>Hi, {actualUser.given_name}</Text>
                <Text className='text-center text-lg font-normal' style={[colorScheme=='light'? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>Enter your phone number</Text>
                <View className='py-5 self-center'>
                    <PhoneInput
                        ref={phoneInput}
                        defaultValue={phoneNumber}
                        defaultCode="IN"
                        onChangeText={(text) => {
                            setPhoneNumber(text);
                        }}
                        onChangeFormattedText={(text) => {
                            setPhoneNumberFormatted(text);
                        }}
                        
                    />
                </View>

                <TouchableOpacity
                    onPress={() => {
                        const checkValid = phoneInput.current?.isValidNumber(phoneNumber);
                        setValidity(checkValid ? checkValid : false);
                        sendVerification(checkValid)
                    }}
                    style={styles.OTPButton}
                    className='self-center'
                >
                    <Text className='self-center ' style={styles.OTPButtonText}>
                        Verify & Send OTP
                    </Text>
                </TouchableOpacity>
                {validity === true &&
                    <View className='self-center'>
                        <OTPInputView
                            style={{ width: '60%', height: 200 }}
                            pinCount={6}
                            autoFocusOnLoad
                            codeInputFieldStyle={[colorScheme=='light'?styles.LightunderlineStyleBase:styles.DarkunderlineStyleBase]}
                            codeInputHighlightStyle={styles.underlineStyleHighLighted}
                            onCodeFilled={(code => {
                                    confirmCode(code)
                            })}
                        />
                    </View>
                }
            </View>
        </SafeAreaView>
    )
}

export default PhoneAuthScreen;