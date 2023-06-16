import React, { useLayoutEffect, useState, useRef } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { firebaseConfig } from '../firebaseConfig';
import firebase from 'firebase/compat/app';
import PhoneInput from 'react-native-phone-number-input';
import OTPTextInput from 'react-native-otp-textinput'

const PhoneAuthScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [phoneNumberFormatted, setPhoneNumberFormatted] = useState('')
    const [validity, setValidity] = useState(false);
    const [code, setCode] = useState('')
    const [verificationID, setVerificationID] = useState(null)
    const recaptchaVerifier = useRef(null)
    const phoneInput = useRef(null);

    const navigation = useNavigation();

    const {
        params: { user },
    } = useRoute();

    const sendVerification = (validity) => {
        if(validity===true){
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            phoneProvider.verifyPhoneNumber(phoneNumberFormatted, recaptchaVerifier.current).then(setVerificationID)
            setPhoneNumber('')
        }
        else if(validity===false){
            alert('Please input a correct phone number')
        }
    }

    const confirmCode = (code) => {
        const credential = new firebase.auth.PhoneAuthProvider.credential(
            verificationID,
            code
        )
        firebase.auth().signInWithCredential(credential)
            .then(() => {
                setCode('');
            })
            .catch((error) => {
                console.log(error)
                alert(error)
            })
        Alert.alert(
            'Login Successful. Welcome to AshokaEats.'
        )
        navigation.navigate('Home', {user})
    }


    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            gestureEnabled: false,
        });
        console.log(user)
    }, []);

    return (
        <SafeAreaView>
            
            <View>
                <FirebaseRecaptchaVerifierModal 
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                />
                <Text>Hi, {user.given_name}</Text>
                <Text>Enter your phone number</Text>
                <PhoneInput
                    ref={phoneInput}
                    defaultValue={phoneNumber}
                    defaultCode="IN"
                    onChangeText={(text) => {
                        setPhoneNumber(text);
                        console.log(text);
                        console.log(phoneNumber);
                    }}
                    onChangeFormattedText={(text) => {
                        setPhoneNumberFormatted(text);
                    }}
                    autoFocus
                />
                <TouchableOpacity
                onPress={()=>{
                    // const checkValid = phoneInput.current?.isValidNumber(phoneNumber);
                    // setValidity(checkValid ? checkValid : false);
                    console.log('button number' + phoneNumber);
                    const test=true
                    sendVerification(test)
                }}
                >
                    <Text>
                        Verify & Send OTP
                    </Text>
                </TouchableOpacity>
                {validity==true &&
                    <View>
                        <OTPTextInput autoFocus inputCount={6} handleTextChange={(code)=>{
                            if(code.length==6){
                                confirmCode(code)
                            }
                        }}/>
                    </View>
                }
            </View>
        </SafeAreaView>
    )
}

export default PhoneAuthScreen;