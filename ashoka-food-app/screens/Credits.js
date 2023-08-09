import React, { useEffect, useLayoutEffect, useMemo, useState, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView, useColorScheme, StyleSheet, TouchableOpacity, Text, View, Image, TextInput, ScrollView, Linking } from 'react-native';
import { HStack, Skeleton, VStack, Checkbox, Button } from 'native-base';
import { ArrowLeftIcon, ArrowRightIcon } from 'react-native-heroicons/solid';
import Styles from '../components/Styles'
import Linkedin from '../assets/linkedin.png'
import Github from '../assets/github.png'
import Instagram from '../assets/instagram.png'
import AryanYadav from '../assets/AryanYadav.jpeg'
import ZahaanShap from '../assets/ZahaanShapoorjee.jpg'


export default function Credits() {

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

    const navigation = useNavigation()
    const colorScheme = useColorScheme()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, [])

    return (
        <SafeAreaView className='h-screen' style={[colorScheme == 'light' ? Styles.LightBG : Styles.DarkBG]}>

            <TouchableOpacity onPress={() => { navigation.goBack() }} className="p-2 bg-white rounded-full items-center shadow-sm" style={[colorScheme == 'light' ? styles.LightbackButton : styles.DarkbackButton]}>
                <ArrowLeftIcon size={20} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
            </TouchableOpacity>

            <Text className='text-center font-medium text-md pb-3 ' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                CREDITS
            </Text>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 75
                }}
                bounces={true}
            >

                <VStack className='w-screen items-center shadow-sm'>
                    <Text className='text-center font-medium text-md pt-3 pb-2' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                        To Outlets
                    </Text>
                    <View className='w-11/12 mt-2 p-3 rounded-lg' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                        <Text className='text-xs' allowFontScaling={false}
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            We thank all of the outlets for going along with idea so comfortably,
                            being patient with the dashboard and even giving us pointers as to what might and might not work from experience.
                        </Text>
                    </View>
                </VStack>

                <VStack className='w-screen items-center shadow-sm'>
                    <Text className='text-center font-medium text-md pt-6 pb-2' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                        To Aditi, Dhrthi, Riwa and Trisha
                    </Text>
                    <View className='w-11/12 mt-2 p-3 rounded-lg' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                        <Text className='text-xs' allowFontScaling={false}
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            We thank you for helping us with the database. Without you the menus would not exist. Thank you for the unpaid labour.
                        </Text>
                    </View>
                </VStack>

                <VStack className='w-screen items-center shadow-sm'>
                    <Text className='text-center font-medium text-md pt-6 pb-2' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                        To Riwa
                    </Text>
                    <View className='w-11/12 mt-2 p-3 rounded-lg' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                        <Text className='text-xs' allowFontScaling={false}
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            Thank you for going around campus more than 10 times to pitch the idea to the outlets, getting behind the outlets who were not responding,
                            clicking all of the restaurant pictures and just making all of this possible.
                        </Text>
                    </View>
                </VStack>

                <VStack className='w-screen items-center shadow-sm'>
                    <Text className='text-center font-medium text-md pt-6 pb-2' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                        For Icons
                    </Text>
                    <View className='w-11/12 mt-2 p-3 rounded-lg' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                        <Text className='text-xs' allowFontScaling={false}
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            We thank
                            <Text className='text-xs' allowFontScaling={false}
                                style={{ color: '#3366CC' }}
                                onPress={() => {
                                    Linking.openURL('https://icons8.com/')
                                }}
                            >
                                {' '}Icons8{' '}
                            </Text>
                            and
                            <Text className='text-xs' allowFontScaling={false}
                                style={{ color: '#3366CC' }}
                                onPress={() => {
                                    Linking.openURL('https://heroicons.com/')
                                }}
                            >
                                {' '}HeroIcons{' '}
                            </Text>
                            for offering free icons on their website that we were able to use across the app.
                        </Text>
                    </View>
                </VStack>

                <VStack className='w-screen items-center shadow-sm'>
                    <Text className='text-center font-medium text-md pt-6 pb-2' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                        For Avatars
                    </Text>
                    <View className='w-11/12 mt-2 p-3 rounded-lg' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                        <Text className='text-xs' allowFontScaling={false}
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            We thank
                            <Text className='text-xs' allowFontScaling={false}
                                style={{ color: '#3366CC' }}
                                onPress={() => {
                                    Linking.openURL('https://multiavatar.com/')
                                }}
                            >
                                {' '}Multiavatar{' '}
                            </Text>
                            for providing such a premium service offering 12 billion unique and stylish avatars.
                        </Text>
                    </View>
                </VStack>



                <Text className='text-center font-medium text-md pt-6 pb-2' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                    Developed By
                </Text>

                <HStack className='w-11/12 self-center items-center justify-evenly pt-3'>

                    <VStack className='w-5/12 justify-center self-center items-center'>
                        <Image
                            style={{ width: 120, height: 120, resizeMode: "cover", borderRadius: 60 }}
                            source={AryanYadav}
                        />
                        <Text className='text-center font-semibold text-xs pt-3' allowFontScaling={false}
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            Aryan Yadav
                        </Text>
                        <HStack className='justify-evenly w-11/12 pt-3'>
                            <TouchableOpacity
                                onPress={() => {
                                    Linking.openURL('https://www.linkedin.com/in/aryan-yadav-546a50232/')
                                }}>
                                <Image
                                    style={{ width: 35, height: 35 }}
                                    source={Linkedin}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    Linking.openURL('https://github.com/iamaryanyadavv')
                                }}>
                                <Image
                                    style={{ width: 35, height: 35 }}
                                    source={Github}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    Linking.openURL('https://www.instagram.com/iamaryanyadavv/')
                                }}>
                                <Image
                                    style={{ width: 35, height: 35 }}
                                    source={Instagram}
                                />
                            </TouchableOpacity>
                        </HStack>
                    </VStack>

                    <VStack className='w-5/12 justify-center self-center items-center'>
                        <Image
                            style={{ width: 120, height: 120, resizeMode: "cover", borderRadius: 60 }}
                            source={ZahaanShap}
                        />
                        <Text className='text-center font-semibold text-xs pt-3' allowFontScaling={false}
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            Zahaan Shapoorjee
                        </Text>
                        <HStack className='justify-evenly w-11/12 pt-3'>
                            <Image
                                onPress={() => {
                                    Linking.openURL('https://www.linkedin.com/in/zahaan-shapoorjee/')
                                }}
                                style={{ width: 35, height: 35 }}
                                source={Linkedin}
                            />
                            <Image
                                onPress={() => {
                                    Linking.openURL('https://github.com/zahaanshapoorjee')
                                }}
                                style={{ width: 35, height: 35 }}
                                source={Github}
                            />
                            <Image
                                onPress={() => {
                                    Linking.openURL('https://www.instagram.com/zahaanxspj/')
                                }}
                                style={{ width: 35, height: 35 }}
                                source={Instagram}
                            />
                        </HStack>
                    </VStack>

                </HStack>




            </ScrollView>
        </SafeAreaView>
    )
}