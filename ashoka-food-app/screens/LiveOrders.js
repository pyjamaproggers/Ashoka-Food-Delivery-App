import { View, Text, TouchableOpacity, ScrollView, colorScheme, useColorScheme, TextInput, FlatList, Alert, Dimensions, Animated, Linking } from "react-native";
import React, { useMemo, useState, useLayoutEffect, useRef, useEffect } from "react";
import { SafeAreaView, StyleSheet, StatusBar, Image } from "react-native";
import { CloseIcon, HStack, IconButton, Slide, VStack, Skeleton, Alert as NativeBaseAlert, Button as NativeBaseButton, Progress } from 'native-base';
import { useNavigation, useRoute } from "@react-navigation/native";
import Styles from '../components/Styles.js'
import Test1 from '../assets/testoutlet1.jpg'
import Test2 from '../assets/testoutlet2.jpg'
import Test3 from '../assets/testoutlet3.jpg'
import Refresh from '../assets/refresh.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Phone from '../assets/phoneicon.png'
import { ArrowLeftIcon, StopCircleIcon } from 'react-native-heroicons/solid';

export default LiveOrders = () => {

    const colorScheme = useColorScheme()
    const navigation = useNavigation();
    const [actualUser, setActualUser] = useState()
    const scrollViewRef = useRef(null);
    const [scrollViewHeight, setScrollViewHeight] = useState(0);

    const phoneNumbers = {

    }

    const usersLiveOrders = [
        {
            name: 'Aryan Yadav',
            phone: '+918014213125',
            email: 'aryan.yadav_asp24@ashoka.edu.in',
            Restaurant: 'Roti Boti',
            orderAmount: '399.00',
            deliveryCharge: '0.00',
            orderItems: [
                {
                    name: 'Butter Chicken',
                    price: 200,
                    quantity: 1
                },
                {
                    name: 'Tandoori Chicken (half)',
                    price: 180,
                    quantity: 1
                },
            ],
            orderDate: '22:33PM on 31 July 2023',
            orderInstructions: 'Bhaiya mirchi thodi kam daalna...',
            orderStatus: 'preparing',
            orderType: 'Delivery',
            payment: 'Pay At Outlet',
            deliveryLocation: 'Sports Block',
            image: Test1,
            restaurantPhone: 'restaurantPhone'
        },
        {
            name: 'Aryan Yadav',
            phone: '+918014213125',
            email: 'aryan.yadav_asp24@ashoka.edu.in',
            Restaurant: 'Dhaba',
            orderAmount: '217.00',
            orderItems: [
                {
                    name: 'Dal Makhani',
                    price: 69,
                    quantity: 3
                },
            ],
            orderDate: '18:06PM on 31 July 2023',
            orderInstructions: 'Bhaiya thoda pyaar se banwana',
            orderStatus: 'accepted',
            orderType: 'Delivery',
            payment: 'Pay At Outlet',
            deliveryLocation: 'RH1',
            image: Test2,
            restaurantPhone: 'restaurantPhone'
        },
        {
            name: 'Aryan Yadav',
            phone: '+918014213125',
            email: 'aryan.yadav_asp24@ashoka.edu.in',
            Restaurant: 'The Hunger Cycle',
            orderAmount: '255.00',
            orderItems: [
                {
                    name: 'Cheesy Fries',
                    price: 120,
                    quantity: 2
                },
            ],
            orderDate: '03:30PM on 31 July 2023',
            orderInstructions: '',
            orderStatus: 'placed',
            orderType: 'Dine In',
            payment: 'Pay At Outlet',
            deliveryLocation: 'RH3',
            image: Test3,
            restaurantPhone: 'restaurantPhone'
        },
    ]

    const getUser = async () => {
        let user = await AsyncStorage.getItem("@user")
        user = JSON.parse(user)
        setActualUser(user)
    }
    const { width, height } = Dimensions.get('screen');
    const ITEM_WIDTH = width;
    const ITEM_HEIGHT = height;
    const ITEM_HEIGHT2 = (ITEM_HEIGHT * 0.5) + 700;

    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollY = useRef(new Animated.Value(0)).current;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            gestureEnabled: false,
        });
        if (scrollViewRef.current) {
            scrollViewRef.current.measure((x, y, width, height) => {
                console.log(height)
                setScrollViewHeight(height);
            });
        }
    }, []);

    useEffect(() => {
        getUser();

    }, [])

    return (
        <View style={[colorScheme == 'light' ? Styles.LightBG : Styles.DarkBG]}>
            <Animated.FlatList
                data={usersLiveOrders}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                renderToHardwareTextureAndroid
                snapToAlignment="start"
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX, y: scrollY } } }],
                    { useNativeDriver: true },
                )}

                renderItem={({ item, index }) => {

                    const inputRange = [
                        (index - 1) * width,
                        index * width,
                        (index + 1) * width,
                    ]

                    const translateX = scrollX.interpolate({
                        inputRange,
                        outputRange: [
                            -width * 0.9, 0, width * 0.9
                        ]
                    })

                    return (
                        <View
                            style={[colorScheme == 'light' ? Styles.LightBG : Styles.DarkBG]} >

                            {/* {scrollY > (ITEM_HEIGHT*0.6) && */}
                            <View className=' z-20 w-screen'
                                style={[colorScheme == 'light' ?
                                    {
                                        backgroundColor: '#f2f2f2',
                                        padding: 8,
                                    }
                                    :
                                    {
                                        backgroundColor: '#0c0c0f',
                                        padding: 8
                                    }
                                ]}
                            >
                                <SafeAreaView >
                                    <VStack className='self-center items-center w-11/12 '>

                                        <HStack className='items-center' space={1}>
                                            {usersLiveOrders.length > 1 &&
                                                <>
                                                    {usersLiveOrders.map((order, progressIndex) => (
                                                        <>
                                                            {order.orderStatus == 'placed' &&
                                                                <StopCircleIcon size={16} style={{ color: '#3b82f6' }} />
                                                            }
                                                            {order.orderStatus == 'accepted' &&
                                                                <StopCircleIcon size={16} style={{ color: '#22c55e' }} />
                                                            }
                                                            {order.orderStatus == 'preparing' &&
                                                                <StopCircleIcon size={16} style={{ color: '#eab308' }} />
                                                            }
                                                            {order.orderStatus == 'out for delivery' &&
                                                                <StopCircleIcon size={16} style={{ color: '#3b82f6' }} />
                                                            }
                                                            {order.orderStatus == 'ready' &&
                                                                <StopCircleIcon size={16} style={{ color: '#3b82f6' }} />
                                                            }
                                                            {order.orderStatus.slice(0, 8) == 'Declined' &&
                                                                <StopCircleIcon size={16} style={{ color: '#f43f5e' }} />
                                                            }
                                                        </>
                                                    ))}
                                                </>
                                            }
                                        </HStack>

                                        <HStack className='items-center -mb-4 justify-between w-11/12'>
                                            <TouchableOpacity onPress={() => { navigation.navigate('Home', { actualUser }) }} className=" p-2 rounded-full" style={[colorScheme == 'light' ? { backgroundColor: 'white', borderRadius: 20 } : { backgroundColor: '#262626', borderRadius: 20 }]}>
                                                <ArrowLeftIcon size={20} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
                                            </TouchableOpacity>

                                            <Text className='font-medium text-lg text-center'
                                                allowFontScaling={false}
                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                            >
                                                {item.Restaurant}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    Linking.openURL(`tel:${item.restaurantPhone}`)
                                                }}
                                            >
                                                <View className='m-1.5'>
                                                    <Image style={{ width: 24, height: 24 }} source={Phone} />
                                                </View>
                                            </TouchableOpacity>
                                        </HStack>


                                        {item.orderStatus == 'placed' &&
                                            <View className='justify-center w-screen top-6' >
                                                <NativeBaseAlert className='self-center rounded-xl'
                                                    style={{
                                                        backgroundColor: '#bfdbfe'
                                                    }}
                                                >
                                                    <Text allowFontScaling={false} className='font-medium text-xs text-center'>
                                                        Order placed! Waiting for outlet to accept.
                                                    </Text>
                                                </NativeBaseAlert>
                                            </View>
                                        }
                                        {item.orderStatus == 'accepted' &&
                                            <View className='justify-center w-screen top-6' >
                                                <NativeBaseAlert className='self-center rounded-xl' status='success'
                                                    style={{
                                                        backgroundColor: '#bbf7d0'
                                                    }}
                                                >
                                                    <Text allowFontScaling={false} className='font-medium text-xs text-center'>
                                                        Order accepted by the outlet!
                                                    </Text>
                                                </NativeBaseAlert>
                                            </View>
                                        }
                                        {item.orderStatus == 'preparing' &&
                                            <View className='justify-center w-screen top-6' >
                                                <NativeBaseAlert className='self-center rounded-xl'
                                                    style={{
                                                        backgroundColor: '#fef08a'
                                                    }}
                                                >
                                                    <Text allowFontScaling={false} className='font-medium text-xs text-center'>
                                                        Food is being prepared!
                                                    </Text>
                                                </NativeBaseAlert>
                                            </View>
                                        }
                                        {item.orderStatus == 'out for delivery' &&
                                            <View className='justify-center w-screen top-6' >
                                                <NativeBaseAlert className='self-center rounded-xl'
                                                    style={{
                                                        backgroundColor: '#bfdbfe'
                                                    }}
                                                >
                                                    <Text allowFontScaling={false} className='font-medium text-xs text-center'>
                                                        Your food is out for delivery!
                                                    </Text>
                                                </NativeBaseAlert>
                                            </View>
                                        }
                                        {item.orderStatus == 'ready' &&
                                            <View className='justify-center w-screen top-6' >
                                                <NativeBaseAlert className='self-center rounded-xl'
                                                    style={{
                                                        backgroundColor: '#bfdbfe'
                                                    }}
                                                >
                                                    <Text allowFontScaling={false} className='font-medium text-xs text-center'>
                                                        Your food is ready at the outlet!
                                                    </Text>
                                                </NativeBaseAlert>
                                            </View>
                                        }
                                        {item.orderStatus.slice(0, 8) == 'Declined' &&
                                            <View className='justify-center w-screen top-6' >
                                                <NativeBaseAlert className='self-center rounded-xl'
                                                    style={{
                                                        backgroundColor: '#fecaca',
                                                        maxWidth: '80%'
                                                    }}

                                                >
                                                    <Text allowFontScaling={false} className='font-medium text-xs text-center'>
                                                        Order {item.orderStatus}
                                                    </Text>
                                                </NativeBaseAlert>
                                            </View>
                                        }
                                    </VStack>
                                </SafeAreaView>
                            </View>
                            {/* } */}


                            <Animated.ScrollView
                                onScroll={Animated.event(
                                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                    { useNativeDriver: true },
                                )}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingBottom: 0
                                }}
                                scrollEventThrottle={16}
                                bounces={false}
                                decelerationRate={'normal'}
                                ref={scrollViewRef}
                            >
                                <View className='items-center shadow-sm'>
                                    <View style={{
                                        width: ITEM_WIDTH * 0.95,
                                        height: ITEM_HEIGHT * 0.4,
                                        overflow: 'hidden',
                                        alignItems: 'center',
                                        borderRadius: 15,
                                    }}
                                        className='shadow-sm'
                                    >
                                        <Animated.Image
                                            className='shadow-sm'
                                            source={item.image}
                                            style={{
                                                width: ITEM_WIDTH,
                                                height: ITEM_HEIGHT * 0.4,
                                                resizeMode: 'cover',
                                                opacity: 1,
                                                borderRadius: 15,
                                                transform: [
                                                    {
                                                        translateX
                                                    },
                                                    // {
                                                    //     scale: scrollY.interpolate({
                                                    //         inputRange: [-ITEM_HEIGHT + 1, 0, ITEM_HEIGHT, ITEM_HEIGHT + 1],
                                                    //         outputRange: [2, 1, 1, 1]
                                                    //     })
                                                    // },
                                                    // {
                                                    //     translateY: scrollY.interpolate({
                                                    //         inputRange: [-ITEM_HEIGHT2, 0, ITEM_HEIGHT2, ITEM_HEIGHT2 + 1],
                                                    //         outputRange: [-ITEM_HEIGHT2 * 1.0, 0, ITEM_HEIGHT2 * 1.0, ITEM_HEIGHT2 * 1.0]
                                                    //     }),
                                                    // },
                                                ]
                                            }}
                                        />
                                    </View>

                                </View>



                                <VStack className='w-screen items-center pb-12'
                                    style={[colorScheme == 'light' ? { backgroundColor: '#f2f2f2' } : { backgroundColor: 'rgba(0,0,0,0.8)' }]}
                                >
                                    <Text className='font-medium text-md pt-4 pb-4' allowFontScaling={false}
                                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                        ITEMS
                                    </Text>
                                    <VStack className='w-11/12 self-center py-1 rounded-lg shadow-sm'
                                        style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}
                                    >
                                        {item.orderItems.map((orderItem, index) => (
                                            <>
                                                <HStack className='items-center self-center py-1 w-11/12 justify-between'>
                                                    <Text className='font-medium text-base'
                                                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                        {orderItem.name}
                                                    </Text>
                                                    <Text className='font-medium text-base'
                                                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                        ₹{orderItem.price} x {orderItem.quantity}
                                                    </Text>
                                                </HStack>
                                            </>
                                        ))}

                                        <HStack className='items-center py-1 mt-1 w-11/12 self-center justify-between'
                                            style={[colorScheme == 'light' ?
                                                {
                                                    borderTopWidth: '1px',
                                                    borderColor: 'rgb(209, 213, 219)'
                                                }
                                                :
                                                {
                                                    borderTopWidth: '1px',
                                                    borderColor: 'rgb(107, 114, 128)'
                                                }
                                            ]}
                                        >
                                            <VStack>
                                                <Text className='font-medium text-base'
                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                    Grand Total
                                                </Text>
                                                <Text className='font-medium text-xs'
                                                    style={[colorScheme == 'light' ? { color: 'gray' } : { color: 'gray' }]}>
                                                    (including restaurant charges)
                                                </Text>
                                            </VStack>
                                            <Text className='font-medium text-base'
                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                ₹{item.orderAmount}
                                            </Text>
                                        </HStack>
                                    </VStack>

                                    {item.orderInstructions.length > 0 &&
                                        <>
                                            <Text className='font-medium text-md pt-4 pb-4' allowFontScaling={false}
                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                INSTRUCTIONS
                                            </Text>
                                            <VStack className='w-11/12 self-center py-1 rounded-lg'
                                                style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}
                                            >
                                                <Text className='font-medium px-3 py-1 text-base'
                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                    "{item.orderInstructions}"
                                                </Text>
                                            </VStack>
                                        </>
                                    }

                                    <VStack className='w-screen items-center'>
                                        <Text className='text-center font-medium text-md pt-4 pb-4' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                            DETAILS
                                        </Text>

                                        <VStack className='w-11/12 self-center py-1 rounded-lg shadow-sm'
                                            style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}
                                        >
                                            <HStack className='items-center self-center py-1 w-11/12 justify-between'>
                                                <Text className='font-medium text-base'
                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                    Placed At
                                                </Text>
                                                <Text className='font-medium text-base'
                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                    {item.orderDate.slice(0, 7)}
                                                </Text>
                                            </HStack>

                                            <HStack className='items-center self-center py-1 w-11/12 justify-between'>
                                                <Text className='font-medium text-base'
                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                    Order Type
                                                </Text>
                                                <Text className='font-medium text-base'
                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                    {item.orderType}
                                                </Text>
                                            </HStack>

                                            {item.orderType == 'Delivery' &&
                                                <>
                                                    <HStack className='items-center self-center py-1 w-11/12 justify-between'>
                                                        <Text className='font-medium text-base'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                            Delivery Location
                                                        </Text>
                                                        <Text className='font-medium text-base'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                            {item.deliveryLocation}
                                                        </Text>
                                                    </HStack>
                                                </>
                                            }
                                        </VStack>

                                    </VStack>

                                    <VStack className='w-screen items-center'>
                                        <Text className='text-center font-medium text-md pt-4 pb-2' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                            CONTACT
                                        </Text>

                                        {actualUser &&
                                            <View style={colorScheme == 'light' ? styles.LightnameEmailPhotoContainer : styles.DarknameEmailPhotoContainer} className='shadow-sm'>

                                                <View className='px-3'>
                                                    {actualUser.hasOwnProperty('picture') ? (
                                                        <Image style={styles.userPic} source={{ uri: actualUser.picture }} />
                                                    ) : (
                                                        <Image style={styles.userPic} source={userPic} />
                                                    )}
                                                </View>
                                                <View className='flex-col space-y-1 pl-0.5'>
                                                    <Text allowFontScaling={false} style={colorScheme == 'light' ? styles.LightnameText : styles.DarknameText}>
                                                        {actualUser.given_name} {actualUser.family_name}
                                                    </Text>

                                                    {/* user.phone */}
                                                    <View className='flex-row items-center space-x-1 '>
                                                        <Text allowFontScaling={false} style={colorScheme == 'light' ? styles.LightphoneText : styles.DarkphoneText}>{item.phone}</Text>
                                                    </View>
                                                    <Text className='font-medium text-xs w-10/12'
                                                        allowFontScaling={false} style={[colorScheme == 'light' ? { color: 'gray' } : { color: 'gray' }]}
                                                    >
                                                        The delivery bhaiya will call you on this number
                                                    </Text>
                                                </View>

                                            </View>
                                        }
                                    </VStack>

                                </VStack>

                            </Animated.ScrollView>
                        </View>
                    )
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        //   borderColor: 'gray',
        //   borderWidth: 1,
    },
    userPic: {
        width: 50,
        height: 50,
        borderRadius: 100,
    },
    LightnameEmailPhotoContainer: {
        width: '91.666667%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 10,
        backgroundColor: 'white',
        borderTopLeftRadius: '10',
        borderTopRightRadius: '10',
        borderBottomRightRadius: '10',
        borderBottomLeftRadius: '10'
    },
    DarknameEmailPhotoContainer: {
        width: '91.666667%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 10,
        backgroundColor: '#262626',
        borderTopLeftRadius: '10',
        borderTopRightRadius: '10',
        borderBottomRightRadius: '10',
        borderBottomLeftRadius: '10'
    },
    LightnameText: {
        fontWeight: 500,
        fontSize: 16,
        paddingBottom: 2,
        color: 'black'
    },
    DarknameText: {
        fontWeight: 500,
        fontSize: 16,
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
        fontSize: 14,
        color: 'black',
        fontWeight: 500
    },
    DarkphoneText: {
        fontSize: 14,
        color: 'white',
        fontWeight: 500
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
    },
    LightDropdownButtonCart: {
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: '#FFFFFF',
    },
    DarkDropdownButtonCart: {
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: '#262626',
    },
    LightDropdownMenu: {
        width: '100%',
        borderRadius: '6px',
        borderWidth: '1px',
        borderColor: 'rgb(229,231,235)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.05,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: '100%',
    },
    DarkDropdownMenu: {
        width: '100%',
        borderRadius: '6px',
        borderTopWidth: '1px',
        borderColor: 'rgb(0,0,0)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.05,
        backgroundColor: '#262626',
        position: 'absolute',
        bottom: '100%',
    },
    LightDropdownMenu2: {
        width: '100%',
        borderRadius: '6px',
        borderWidth: '1px',
        borderColor: 'rgb(229,231,235)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.1,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: '100%',
    },
    DarkDropdownMenu2: {
        width: '100%',
        borderRadius: '6px',
        borderTopWidth: '1px',
        borderColor: 'rgb(0,0,0)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.05,
        backgroundColor: '#262626',
        position: 'absolute',
        bottom: '100%',
    },
    LightDropdownItem: {
        borderBottomWidth: '1px',
        borderColor: 'rgb(229, 231, 235)',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    DarkDropdownItem: {
        borderBottomWidth: '1px',
        borderColor: 'rgb(75, 85, 99)',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    LightDropdownItemEnd: {
        borderBottomWidth: '1px',
        borderColor: '#ffffff',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    DarkDropdownItemEnd: {
        borderBottomWidth: '1px',
        borderColor: '#262626',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
});
