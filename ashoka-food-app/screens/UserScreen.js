import React, { useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, StyleSheet, Touchable, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, ChartBarIcon, DocumentTextIcon, PowerIcon, PhoneIcon, ArrowRightIcon, ChevronRightIcon } from 'react-native-heroicons/solid';
import Verified from '../assets/verified.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styles from '../components/Styles';
import Orderhistory from '../assets/orderhistoryicon.png';
import Userspending from '../assets/userspendingicon.png';
import Phonechange from '../assets/phoneicon.png';
import Credits from '../assets/creditsicon.png';
import Logout from '../assets/logouticon.png'
import RightArrow from '../assets/chevronrighticon.png';
import { Button, HStack, Modal, PresenceTransition, VStack, Avatar } from 'native-base';

export default function UserScreen() {
    const { params: { actualUser } } = useRoute();
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    const colorScheme = useColorScheme();

    const colors = [
        'amber.400',
        'lightBlue.400',
        'secondary.400',
        'pink.400',
        'purple.400',
        'violet.400',
        'indigo.400',
        'teal.500',
    ]

    const [userColor, setUserColor] = useState(colors[Math.floor(Math.random() * colors.length)])

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            //   borderColor: 'gray',
            //   borderWidth: 1,
        },
        userPic: {
            width: 70,
            height: 70,
            borderRadius: 100,
        },
        LightnameEmailPhotoContainer: {
            width: '95%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            marginTop: 10,
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10
        },
        DarknameEmailPhotoContainer: {
            width: '95%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            marginTop: 10,
            backgroundColor: '#262626',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10
        },
        LightnameText: {
            fontWeight: 500,
            fontSize: 20,
            paddingBottom: 2,
            color: 'black'
        },
        DarknameText: {
            fontWeight: 500,
            fontSize: 20,
            paddingBottom: 2,
            color: 'white'
        },
        LightemailText: {
            fontSize: 12,
            color: 'black'
        },
        DarkemailText: {
            fontSize: 12,
            color: 'white'
        },
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
        LightphoneText: {
            fontSize: 12,
            color: 'black'
        },
        DarkphoneText: {
            fontSize: 12,
            color: 'white'
        },
        LightuserDetailsContainer: {
            width: '95%',
            justifyContent: 'center',
            paddingHorizontal: 10,
            marginTop: 10,
            backgroundColor: 'white',
            borderRadius: 10,
        },
        DarkuserDetailsContainer: {
            width: '95%',
            justifyContent: 'center',
            paddingHorizontal: 10,
            marginTop: 10,
            backgroundColor: '#262626',
            borderRadius: 10,
        },
        LightlogoutContainer: {
            justifyContent: 'center',
            paddingHorizontal: 10,
            backgroundColor: 'white',
            borderRadius: 10,
            bottom: 0,
            position: 'absolute',
        },
        DarklogoutContainer: {
            justifyContent: 'center',
            paddingHorizontal: 10,
            backgroundColor: '#262626',
            borderRadius: 10,
            bottom: 0,
            position: 'absolute',
        }
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const navigation = useNavigation();

    return (
        <SafeAreaView className="h-screen" style={[colorScheme == 'light' ? { backgroundColor: '#F2F2F2', flex: 1 } : { backgroundColor: '#0c0c0f', flex: 1 }]}>
            {/* Go back Button */}
            <TouchableOpacity onPress={() => { navigation.navigate('Home', { actualUser }) }} className="p-2 bg-white rounded-full items-center shadow-sm" style={[colorScheme == 'light' ? styles.LightbackButton : styles.DarkbackButton]}>
                <ArrowLeftIcon size={20} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
            </TouchableOpacity>

            <View style={styles.container} className=''>
                {/* First container of name, email, and photo */}
                <View style={colorScheme == 'light' ? styles.LightnameEmailPhotoContainer : styles.DarknameEmailPhotoContainer} className='shadow-sm'>

                    <View className='px-3'>
                        {userColor &&
                            <Avatar bg={userColor}
                                style={styles.userPic}
                            source={{
                                uri: `https://api.multiavatar.com/${actualUser.name}.png?apikey=Bvjs0QyHcCxZNe`
                            }}>
                                <Text className='' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                    {actualUser.given_name[0]}{actualUser.family_name[0]}
                                </Text>
                            </Avatar>
                        }
                    </View>

                    <View className='flex-col space-y-1 pl-0.5'>
                        <Text allowFontScaling={false} style={colorScheme == 'light' ? styles.LightnameText : styles.DarknameText}>
                            {actualUser.name}
                        </Text>

                        {/* user.phone */}
                        <View className='flex-row items-center space-x-1 '>
                            <Text allowFontScaling={false} style={colorScheme == 'light' ? styles.LightphoneText : styles.DarkphoneText}>{actualUser.phone}</Text>
                            <Image source={Verified} style={{ width: 16, height: 16 }} />
                        </View>

                        <View className='flex-row items-center space-x-1 '>
                            <Text allowFontScaling={false} style={colorScheme == 'light' ? styles.LightemailText : styles.DarkemailText}>@{actualUser.email.replace('@ashoka.edu.in', '')}</Text>
                            {actualUser.verified_email == true &&
                                <Image source={Verified} style={{ width: 16, height: 16 }} />
                            }
                        </View>
                    </View>

                </View>


                {/* Functionalities */}
                <View style={colorScheme == 'light' ? styles.LightuserDetailsContainer : styles.DarkuserDetailsContainer} className='shadow-sm'>


                    <View className="py-4" style={[colorScheme == 'light' ? Styles.LightUserDetailsBorder : Styles.DarkUserDetailsBorder]}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('OrderHistory', { actualUser })
                            }}
                        >
                            <View className="flex-row gap-2 items-center justify-between">
                                <HStack className="items-center flex-row" space={2}>
                                    <Image source={Orderhistory} style={{ width: 20, height: 20 }} />
                                    <Text style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>Order History</Text>
                                </HStack>
                                <ChevronRightIcon size={16} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View className="py-4" style={[colorScheme == 'light' ? Styles.LightUserDetailsBorder : Styles.DarkUserDetailsBorder]}>
                        <TouchableOpacity
                            onPress={() => {
                                // navigation.navigate('ManageSpendings', { actualUser })
                                Alert.alert('This feature will be available soon. We first need some order data to work with.')
                            }}>
                            <View className="flex-row gap-2 items-center justify-between">
                                <HStack className="items-center flex-row" space={2}>
                                    <Image source={Userspending} style={{ width: 20, height: 20 }} />
                                    <Text style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>Track Spendings</Text>
                                </HStack>
                                <ChevronRightIcon size={16} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View className="py-4" style={[colorScheme == 'light' ? Styles.LightUserDetailsBorder : Styles.DarkUserDetailsBorder]}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('PhoneAuth', { actualUser, from: 'UserScreen' })
                            }}
                        >
                            <View className="flex-row gap-2 items-center justify-between">
                                <HStack className="items-center flex-row" space={2}>
                                    <Image source={Phonechange} style={{ width: 20, height: 20 }} />
                                    <Text style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>Update Phone Number</Text>
                                </HStack>
                                <ChevronRightIcon size={16} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View className="py-4" style={[colorScheme == 'light' ? Styles.LightUserDetailsBorderLast : Styles.DarkUserDetailsBorderLast]}>
                        <TouchableOpacity onPress={() => {
                                navigation.navigate('Credits')
                            }}>
                            <View className="flex-row gap-2 items-center justify-between">
                                <HStack className="items-center flex-row" space={2}>
                                    <Image source={Credits} style={{ width: 20, height: 20 }} />
                                    <Text style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                        Credits
                                    </Text>
                                </HStack>
                                <ChevronRightIcon size={16} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>

                <View style={colorScheme == 'light' ? styles.LightuserDetailsContainer : styles.DarkuserDetailsContainer} className='shadow-sm'>

                    <View className="py-4" style={[colorScheme == 'light' ? Styles.LightUserDetailsBorderLast : Styles.DarkUserDetailsBorderlast]}>
                        <TouchableOpacity
                            onPress={() => setShowLogoutModal(true)}
                        >
                            <View className="flex-row gap-2 items-center justify-between">
                                <HStack className="items-center flex-row" space={2}>
                                    <Image source={Logout} style={{ width: 20, height: 20 }} />
                                    <Text className='text-red-600 font-semibold text-sm'>
                                        Log out
                                    </Text>
                                </HStack>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>

                <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
                    <Modal.Content
                        style={[colorScheme == 'light' ? { backgroundColor: '#fff' } : { backgroundColor: '#262626' }]}
                    >
                        <VStack className='w-full py-4'>
                            <VStack className='self-center'>
                                <Text className='font-semibold text-base self-center pb-2'
                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                >
                                    Why do you want to logout?
                                </Text>
                                <Text className='font-medium text-md self-center pb-2 px-4 text-center'
                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                >
                                    Is it something we did... or you just need a break or...?
                                </Text>
                                <Text className='font-medium text-md self-center pb-4 px-4 text-center'
                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                >
                                    We can work this out... just stay
                                </Text>
                            </VStack>
                            <HStack className='self-center' space={2}>
                                <Button.Group space={2}>
                                    <Button variant="ghost" size="sm" colorScheme="secondary" onPress={() => {
                                        setShowLogoutModal(false);
                                    }}
                                        style={{ textColor: '#3E5896' }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button size="sm" variant="subtle" colorScheme="secondary" onPress={() => navigation.navigate("Login", { logout: 1 })}>
                                        <Text className='text-red-600'>
                                            JUST LET ME OUT!
                                        </Text>
                                    </Button>
                                </Button.Group>
                            </HStack>
                        </VStack>
                    </Modal.Content>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

