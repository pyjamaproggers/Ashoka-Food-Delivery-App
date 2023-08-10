import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
    useColorScheme,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from "../firebaseConfig";
import firebase from "firebase/compat/app";
import PhoneInput from "react-native-phone-number-input";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import Styles from "../components/Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PhoneAuthScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneNumberFormatted, setPhoneNumberFormatted] = useState("");
    const [validity, setValidity] = useState(false);
    const [code, setCode] = useState("");
    const [verificationID, setVerificationID] = useState(null);
    const recaptchaVerifier = useRef(null);
    const phoneInput = useRef(null);
    const [showLoader, setShowLoader] = useState(false);

    const navigation = useNavigation();
    const colorScheme = useColorScheme();

    const {
        params: { actualUser, from },
    } = useRoute();

    const styles = StyleSheet.create({
        backButton: {
            width: "10%",
            marginLeft: 20,
            backgroundColor: "white",
        },
        OTPButton: {
            backgroundColor: "#3E5896", // Ashoka University primary color
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
            width: "50%",
            marginBottom: 12,
        },
        OTPButtonText: {
            color: "#fff",
            fontSize: 16,
            textAlign: "center",
        },
        borderStyleBase: {
            width: 30,
            height: 45,
        },

        borderStyleHighLighted: {
            borderColor: "#3E5896",
        },

        LightunderlineStyleBase: {
            width: 30,
            height: 45,
            borderWidth: 0,
            borderBottomWidth: 3,
            color: "black",
        },
        DarkunderlineStyleBase: {
            width: 30,
            height: 45,
            borderWidth: 0,
            borderBottomWidth: 3,
            color: "white",
        },

        underlineStyleHighLighted: {
            borderColor: "#3E5896",
        },
    });

    const sendVerification = (validity) => {
        if (validity === true) {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            phoneProvider
                .verifyPhoneNumber(phoneNumberFormatted, recaptchaVerifier.current)
                .then(setVerificationID);
            actualUser["phone"] = phoneNumberFormatted;
            setShowLoader(false)
        } else if (validity === false) {
            Alert.alert(
                "This phone number seems to be incorrect! Please check again, thank you."
            );
            setShowLoader(false)
        }
    };

    const confirmCode = async (code) => {
        setShowLoader(true)
        const credential = new firebase.auth.PhoneAuthProvider.credential(
            verificationID,
            code
        );
        const response = await firebase.auth().signInWithCredential(credential)
        if (response.user) {
            if (from == "Login") {
                actualUser["phone"] = phoneNumberFormatted;
                AsyncStorage.setItem("@user", JSON.stringify(actualUser));
                navigation.navigate("StudentDisclaimer", { actualUser });
                setCode("");
                setShowLoader(false)
                return
            }
            else {
                navigation.navigate("UserScreen", { actualUser });
                setCode("");
                Alert.alert("Phone Number Updated");
                setShowLoader(false)
                return
            }
        }
        else if (!response.user) {
            if (response.code == 'auth/invalid-verification-code') {
                Alert.alert("Incorrect OTP! Please check again, thank you.");
                setShowLoader(false)
                return
            }
            else {
                Alert.alert(
                    'There seems to be an error. If it persists, please try again later, sorry for the inconvenience.'
                )
                setShowLoader(false)
                return
            }
        }


        // .then((e) => {
        //     if (from == "Login") {
        //         actualUser["phone"] = phoneNumberFormatted;
        //         AsyncStorage.setItem("@user", JSON.stringify(actualUser));
        //         navigation.navigate("StudentDisclaimer", { actualUser });
        //         setCode("");
        //         setShowLoader(false)
        //         return
        //     } else {
        //         navigation.navigate("UserScreen", { actualUser });
        //         setCode("");
        //         Alert.alert("Phone Number Updated");
        //         setShowLoader(false)
        //         return
        //     }
        // })
        // .catch((error) => {
        //     if(error.code=='auth/invalid-verification-code'){
        //         Alert.alert("Incorrect OTP! Please check again, thank you.");
        //         setShowLoader(false)
        //         return
        //     }
        //     else{
        //         Alert.alert(
        //             'There seems to be an error. If it persists, please try again later, sorry for the inconvenience.'
        //         )
        //         setShowLoader(false)
        //         return
        //     }
        // });
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    useEffect(() => {

    }, [showLoader])

    return (
        <SafeAreaView
            className="h-screen"
            style={[
                colorScheme == "light"
                    ? { backgroundColor: "#F2F2F2" }
                    : { backgroundColor: "#0c0c0f" },
            ]}
        >
            <View className="justify-center">
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                />

                {/* Go back Button */}
                <TouchableOpacity
                    onPress={navigation.goBack}
                    className="p-2 mt-2 left-5 bg-gray-100 rounded-full items-center"
                    style={[
                        colorScheme == "light"
                            ? Styles.LightBackButton
                            : Styles.DarkBackButton,
                    ]}
                >
                    <ArrowLeftIcon
                        size={20}
                        style={[
                            colorScheme == "light" ? { color: "black" } : { color: "white" },
                        ]}
                    />
                </TouchableOpacity>

                <Text
                    className="text-center text-lg font-normal"
                    style={[
                        colorScheme == "light"
                            ? Styles.LightTextPrimary
                            : Styles.DarkTextPrimary,
                    ]}
                >
                    Hi, {actualUser.given_name}
                </Text>
                <Text
                    className="text-center text-lg font-normal"
                    style={[
                        colorScheme == "light"
                            ? Styles.LightTextPrimary
                            : Styles.DarkTextPrimary,
                    ]}
                >
                    Enter your phone number
                </Text>
                <View className="py-5 self-center">
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
                        withDarkTheme={true}
                        containerStyle={[
                            colorScheme == "light"
                                ? { backgroundColor: "#fff", borderRadius: 7.5 }
                                : { backgroundColor: "#262626", borderRadius: 7.5 },
                        ]}
                        textContainerStyle={[
                            colorScheme == "light"
                                ? { backgroundColor: "#fff", borderRadius: 7.5 }
                                : { backgroundColor: "#262626", borderRadius: 7.5 },
                        ]}
                        codeTextStyle={[
                            colorScheme == "light"
                                ? Styles.LightTextPrimary
                                : Styles.DarkTextPrimary,
                        ]}
                        textInputStyle={[
                            colorScheme == "light"
                                ? Styles.LightTextPrimary
                                : Styles.DarkTextPrimary,
                        ]}
                    />
                </View>
                {!showLoader && (
                    <TouchableOpacity
                        onPress={() => {
                            const checkValid = phoneInput.current?.isValidNumber(phoneNumber);
                            setValidity(checkValid ? checkValid : false);
                            sendVerification(checkValid);
                        }}
                        style={styles.OTPButton}
                        className="self-center"
                    >
                        <Text className="self-center " style={styles.OTPButtonText}>
                            Verify & Send OTP
                        </Text>
                    </TouchableOpacity>
                )}
                {showLoader &&
                    <ActivityIndicator size="small" />
                }
                {validity === true && (
                    <View className="self-center">
                        <OTPInputView
                            style={{ width: "60%", height: 200 }}
                            pinCount={6}
                            autoFocusOnLoad
                            codeInputFieldStyle={[
                                colorScheme == "light"
                                    ? styles.LightunderlineStyleBase
                                    : styles.DarkunderlineStyleBase,
                            ]}
                            codeInputHighlightStyle={styles.underlineStyleHighLighted}
                            onCodeFilled={(code) => {
                                confirmCode(code);
                            }}
                        />

                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default PhoneAuthScreen;
