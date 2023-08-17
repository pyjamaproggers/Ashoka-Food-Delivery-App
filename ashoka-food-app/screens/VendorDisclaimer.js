import React, { useEffect, useLayoutEffect, useMemo, useState, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView, useColorScheme, StyleSheet, TouchableOpacity, Text, View, Image, TextInput, ScrollView } from 'react-native';
import { HStack, Skeleton, VStack, Checkbox, Button } from 'native-base';
import { ArrowLeftIcon, ArrowRightIcon } from 'react-native-heroicons/solid';
import Styles from '../components/Styles'


export default function VenderDisclaimer() {

    const styles = StyleSheet.create({
        LightbackButton: {
            width: "10%",
            marginLeft: 20,
            backgroundColor: 'white'
        },
        DarkbackButton: {
            width: "10%",
            marginLeft: 20,
            backgroundColor: '#262626'
        },
        EnabledBTN: {
            backgroundColor: '#3E5896'
        },
        DisabledBTN: {
            // backgroundColor: 'rgba(62,88,150,0.5)'
            backgroundColor: '#3E5896',
            opacity: 0.4
        }
    });

    const [UserResponse, setUserResponse] = useState([]);
    const [BTNisInvalied, setBTNisInvalid] = useState(false)

    const navigation = useNavigation()
    const colorScheme = useColorScheme()

    const route = useRoute();
    const { selectedRestaurant, selectedPerson } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, [])

    return (
        <SafeAreaView className='h-screen' style={[colorScheme == 'light' ? Styles.LightBG : Styles.DarkBG]}>

            <TouchableOpacity onPress={() => { navigation.navigate('VendorLogin') }} className="p-2 bg-white rounded-full items-center shadow-lg" style={[colorScheme == 'light' ? styles.LightbackButton : styles.DarkbackButton]}>
                <ArrowLeftIcon size={20} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
            </TouchableOpacity>

            <Text className='text-center font-medium text-md pb-3 -mt-6' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                VENDOR DISCLAIMER
            </Text>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 25
                }}
            >

                <VStack className='w-screen items-center shadow-sm'>
                    <View className='w-11/12 mt-2 p-3 rounded-lg' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                        <Text className='text-sm' allowFontScaling={false}
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            Objective - This app is created simply to digitalize the food services on Ashoka University campus by offering live order tracking, dynamic menus,
                            dine-in feature, track spandings feature and more.{'\n'}
                            {'\n'}
                            Prices - Any of the food item costs on the app have not been decided by us but have been taken directly from the physical restaurant menus
                            available at each outlet. Same goes for any of the delivery or restaurant charges.
                            By checking the checkbox below you agree that you will not hold us responsible for any of the food and/or restaurant prices listed on the app unless listed otherwise.{'\n'}
                            {'\n'}
                            Tracking - We do not track you across any of the other apps. Once you close this app on your phone we will have no access to what you do.
                            By checking the checkbox below you convey that you understand we do not store any of your personal information other than your restaurant name and login type for authentication. {'\n'}
                            {'\n'}
                            Order Data - In order for your order data (status updates) to reach the student we have to store it in a database online. Each order object
                            stores student's name, email (UID), phone, and other order details like, restaurant name, items, order type, delivery location, payment method.
                            This is the same database that we use to show you the list of all your closed orders.
                            By checking the checkbox below you agree to letting us store your restaurants order data.
                        </Text>
                    </View>
                </VStack>

                <View className='w-11/12 self-center py-6'>
                    <Checkbox.Group onChange={(selected) => {
                        setUserResponse(selected)
                        setBTNisInvalid(false)
                    }} value={UserResponse} accessibilityLabel="Agree/Disagree">
                        <Checkbox value="Yes" isInvalid={BTNisInvalied} colorScheme='darkBlue'>
                            <Text className='text-sm w-11/12'
                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                            >
                                I agree to all of the above mentioned terms, conditions and factors.
                            </Text>
                        </Checkbox>
                    </Checkbox.Group>
                </View>

                {console.log(UserResponse[0])}

                <View className='w-8/12 self-center py-2'>

                    <TouchableOpacity className='w-10/12 justify-center text-center items-center self-center py-3 rounded-lg'
                        style={[UserResponse[0] === 'Yes' ? styles.EnabledBTN : styles.DisabledBTN]}
                        onPress={() => {
                            if (UserResponse[0] === undefined) {
                                setBTNisInvalid(true)
                            }
                            else {
                                
                                navigation.navigate('VendorDashboard', { selectedRestaurant, selectedPerson });
                            }
                        }}
                    >
                        <HStack className='items-center space-x-2'>
                            <Text className='font-semibold text-base text-white'>
                                View Orders
                            </Text>
                            <ArrowRightIcon size={20} color={'white'} />
                        </HStack>
                    </TouchableOpacity>

                </View>



            </ScrollView>
        </SafeAreaView>
    )
}