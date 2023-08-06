import { View, Text, TouchableOpacity, ScrollView, colorScheme, useColorScheme, TextInput, FlatList, Alert, Dimensions, Animated, Linking } from "react-native";
import React, { useMemo, useState, useLayoutEffect, useRef, useEffect } from "react";
import { SafeAreaView, StyleSheet, StatusBar, Image } from "react-native";
import { CloseIcon, HStack, IconButton, Slide, VStack, Skeleton, Alert as NativeBaseAlert, Button as NativeBaseButton, Progress, useToast } from 'native-base';
import { useNavigation, useRoute } from "@react-navigation/native";
import Styles from '../components/Styles.js'
import Test1 from '../assets/testoutlet1.jpg'
import Test2 from '../assets/testoutlet2.jpg'
import Test3 from '../assets/testoutlet3.jpg'
import Refresh from '../assets/refresh.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Phone from '../assets/phoneicon.png'
import { ArrowLeftIcon, StopCircleIcon } from 'react-native-heroicons/solid';
import Grey from '../assets/greysquare.jpeg'
import Dish from '../assets/dish.png';
import PenIcon from '../assets/pen.png';
import { PlusIcon, MinusIcon } from 'react-native-heroicons/solid';
import Subtotal from '../assets/subtotal.png';
import Total from '../assets/total.png'
import FinalTotal from '../assets/finaltotal.png'
import Government from '../assets/government.png';
import DeliveryBhaiya from '../assets/deliverybhaiya.png';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Chevronup from '../assets/chevronupicon.png';
import ChevronDown from '../assets/chevrondownicon.png';
import FoodDelivery from '../assets/fooddelivery.png';
import DineIn from '../assets/dinein.png';
import RH from '../assets/rh.png'
import AC04 from '../assets/ac04.png'
import SportsBlock from '../assets/sportsblock.png'
import Mess from '../assets/mess.png'
import UPI from '../assets/upi.png'
import COD from '../assets/cod.png'
import BrokenHeart from '../assets/brokenheart.png'
import PayAtRestaurant from '../assets/payatrestaurant.png'
import Clock from '../assets/clockicon.png'
import { IP } from '@dotenv'
import io from 'socket.io-client';

export default function LiveOrders() {

    const colorScheme = useColorScheme()
    const navigation = useNavigation();
    const {
        params: { actualUser },
    } = useRoute();
    const scrollViewRef = useRef(null);
    const [loadingImage, setLoadingImage] = useState(true)
    const [latestOrder, setLatestOrder] = useState(null)
    const [usersLiveOrders, setUsersLiveOrders] = useState([])
    const [socket, setSocket] = useState(null)
    const [Fetching, setFetching] = useState(true)
    const toast = useToast();

    const RotiBoti = {
        phoneNumber: '+919896950018',
        image: Test1
    }

    const Dhaba = {
        phoneNumber: '+918059410499',
        image: Test2
    }

    const THC = {
        phoneNumber: '+918199991183',
        image: Test3
    }

    const ChicagoPizza = {
        phoneNumber: '+919873102693',
        image: Grey
    }

    const Rasananda = {
        phoneNumber: '',
        image: Grey
    }

    const FoodVillage = {
        phoneNumber: '+918053202242',
        image: Grey
    }

    const Subway = {
        phoneNumber: '+918199989788',
        image: Grey
    }

    const updateImageLoader = (value) => {
        setLoadingImage(value)
    }

    const connectToSocket = () => {
        const socket = io(`http://${IP}:8800`, {});

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        socket.on('orderStatusChange', async (order) => {
            console.log('Order Status Changed:', order);
            if (actualUser && actualUser.email && order?.email === actualUser.email) {
                toast.show({
                    description: "Order status updated!",
                    placement: 'bottom',
                    backgroundColor: 'green.100',
                    _description: { color: 'black' },
                })
                setLatestOrder(order);
            }
        });

        socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        setSocket(socket);
    };

    const getUserOrders = async () => {
        setFetching(true)
        try {
            if (!actualUser) {
                console.error('Actual user is undefined');
                return;
            }
            const response = await fetch(`http://${IP}:8800/api/orders/users/${actualUser.email}`);
            const data = await response.json();
            let liveOrders = [];
            let flag = 1
            data.map((order, index) => {
                if (!(order.orderStatus == 'completed' || order.orderStatus.includes('Declined'))) {
                    liveOrders.push(order)
                    flag = 0
                }
            })
            if (flag == 1) {
                navigation.navigate('Home', { actualUser })
            }
            setUsersLiveOrders(liveOrders)
            setFetching(false)
        } catch (error) {
            console.error('Error fetching orders:', error);
            // setRefreshing(false)
            setFetching(false)
        }
    }

    const { width, height } = Dimensions.get('screen');
    const ITEM_WIDTH = width;
    const ITEM_HEIGHT = height;

    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollY = useRef(new Animated.Value(0)).current;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            gestureEnabled: false,
        });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await getUserOrders();
            connectToSocket();
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (latestOrder) {

            const fetchData = async () => {
                await getUserOrders();
            };
            fetchData();
        }
    }, [latestOrder]);

    return (
        <>
            {!Fetching &&
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
                                    -width * 1, 0, width * 1
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
                                                                    {index == progressIndex &&
                                                                        <>
                                                                            {order.orderStatus == 'placed' &&
                                                                                <StopCircleIcon size={20} style={{ color: '#3b82f6' }} />
                                                                            }
                                                                            {order.orderStatus == 'accepted' &&
                                                                                <StopCircleIcon size={20} style={{ color: '#22c55e' }} />
                                                                            }
                                                                            {order.orderStatus == 'preparing' &&
                                                                                <StopCircleIcon size={20} style={{ color: '#eab308' }} />
                                                                            }
                                                                            {order.orderStatus == 'out for delivery' &&
                                                                                <StopCircleIcon size={20} style={{ color: '#3b82f6' }} />
                                                                            }
                                                                            {order.orderStatus == 'ready' &&
                                                                                <StopCircleIcon size={20} style={{ color: '#3b82f6' }} />
                                                                            }
                                                                            {order.orderStatus.slice(0, 8) == 'Declined' &&
                                                                                <StopCircleIcon size={20} style={{ color: '#f43f5e' }} />
                                                                            }
                                                                        </>
                                                                    }


                                                                    {index != progressIndex &&
                                                                        <>
                                                                            {order.orderStatus == 'placed' &&
                                                                                <StopCircleIcon size={12} style={{ color: '#3b82f6' }} />
                                                                            }
                                                                            {order.orderStatus == 'accepted' &&
                                                                                <StopCircleIcon size={12} style={{ color: '#22c55e' }} />
                                                                            }
                                                                            {order.orderStatus == 'preparing' &&
                                                                                <StopCircleIcon size={12} style={{ color: '#eab308' }} />
                                                                            }
                                                                            {order.orderStatus == 'out for delivery' &&
                                                                                <StopCircleIcon size={12} style={{ color: '#3b82f6' }} />
                                                                            }
                                                                            {order.orderStatus == 'ready' &&
                                                                                <StopCircleIcon size={12} style={{ color: '#3b82f6' }} />
                                                                            }
                                                                            {order.orderStatus.slice(0, 8) == 'Declined' &&
                                                                                <StopCircleIcon size={12} style={{ color: '#f43f5e' }} />
                                                                            }
                                                                        </>
                                                                    }


                                                                </>
                                                            ))}
                                                        </>
                                                    }
                                                </HStack>

                                                <HStack className='items-center -mb-4 justify-between w-full'>
                                                    <TouchableOpacity onPress={() => { navigation.navigate('Home', { actualUser }) }} className=" p-2 rounded-full" style={[colorScheme == 'light' ? { backgroundColor: 'white', borderRadius: 20 } : { backgroundColor: '#262626', borderRadius: 20 }]}>
                                                        <ArrowLeftIcon size={20} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
                                                    </TouchableOpacity>

                                                    <Text className='font-medium text-lg text-center'
                                                        allowFontScaling={false}
                                                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                    >
                                                        {item.Restaurant}
                                                    </Text>
                                                    {item.Restaurant == 'Roti Boti' &&
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                Linking.openURL(`tel:${RotiBoti.phoneNumber}`)
                                                            }}
                                                        >
                                                            <View className='m-1.5'>
                                                                <Image style={{ width: 24, height: 24 }} source={Phone} />
                                                            </View>
                                                        </TouchableOpacity>
                                                    }
                                                    {item.Restaurant == 'Dhaba' &&
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                Linking.openURL(`tel:${Dhaba.phoneNumber}`)
                                                            }}
                                                        >
                                                            <View className='m-1.5'>
                                                                <Image style={{ width: 24, height: 24 }} source={Phone} />
                                                            </View>
                                                        </TouchableOpacity>
                                                    }
                                                    {item.Restaurant == 'Chaat Stall' &&
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                Linking.openURL(`tel:${FoodVillage.phoneNumber}`)
                                                            }}
                                                        >
                                                            <View className='m-1.5'>
                                                                <Image style={{ width: 24, height: 24 }} source={Phone} />
                                                            </View>
                                                        </TouchableOpacity>
                                                    }
                                                    {item.Restaurant == 'The Hunger Cycle' &&
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                Linking.openURL(`tel:${THC.phoneNumber}`)
                                                            }}
                                                        >
                                                            <View className='m-1.5'>
                                                                <Image style={{ width: 24, height: 24 }} source={Phone} />
                                                            </View>
                                                        </TouchableOpacity>
                                                    }
                                                    {item.Restaurant == 'Subway' &&
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                Linking.openURL(`tel:${Subway.phoneNumber}`)
                                                            }}
                                                        >
                                                            <View className='m-1.5'>
                                                                <Image style={{ width: 24, height: 24 }} source={Phone} />
                                                            </View>
                                                        </TouchableOpacity>
                                                    }
                                                    {item.Restaurant == 'Chicago Pizza' &&
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                Linking.openURL(`tel:${ChicagoPizza.phoneNumber}`)
                                                            }}
                                                        >
                                                            <View className='m-1.5'>
                                                                <Image style={{ width: 24, height: 24 }} source={Phone} />
                                                            </View>
                                                        </TouchableOpacity>
                                                    }
                                                    {item.Restaurant == 'Rasananda' &&
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                Linking.openURL(`tel:${Rasananda.phoneNumber}`)
                                                            }}
                                                        >
                                                            <View className='m-1.5'>
                                                                <Image style={{ width: 24, height: 24 }} source={Phone} />
                                                            </View>
                                                        </TouchableOpacity>
                                                    }
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
                                        bounces={true}
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
                                                {loadingImage &&
                                                    <Skeleton rounded='lg'
                                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                                        endColor={colorScheme == 'light' ? 'gray.300' : '#0c0c0f'}
                                                        style={{
                                                            width: ITEM_WIDTH,
                                                            height: ITEM_HEIGHT * 0.4
                                                        }}
                                                    />
                                                }
                                                {item.Restaurant == 'Roti Boti' &&
                                                    <Animated.Image
                                                        className='shadow-sm'
                                                        source={RotiBoti.image}
                                                        onLoadStart={() => updateImageLoader(true)}
                                                        onLoadEnd={() => updateImageLoader(false)}
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
                                                }
                                                {item.Restaurant == 'Dhaba' &&
                                                    <Animated.Image
                                                        className='shadow-sm'
                                                        source={Dhaba.image}
                                                        onLoadStart={() => updateImageLoader(true)}
                                                        onLoadEnd={() => updateImageLoader(false)}
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
                                                }
                                                {item.Restaurant == 'Chaat Stall' &&
                                                    <Animated.Image
                                                        className='shadow-sm'
                                                        source={FoodVillage.image}
                                                        onLoadStart={() => updateImageLoader(true)}
                                                        onLoadEnd={() => updateImageLoader(false)}
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
                                                }
                                                {item.Restaurant == 'Chicago Pizza' &&
                                                    <Animated.Image
                                                        className='shadow-sm'
                                                        source={ChicagoPizza.image}
                                                        onLoadStart={() => updateImageLoader(true)}
                                                        onLoadEnd={() => updateImageLoader(false)}
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
                                                }
                                                {item.Restaurant == 'Subway' &&
                                                    <Animated.Image
                                                        className='shadow-sm'
                                                        source={Subway.image}
                                                        onLoadStart={() => updateImageLoader(true)}
                                                        onLoadEnd={() => updateImageLoader(false)}
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
                                                }
                                                {item.Restaurant == 'The Hunger Cycle' &&
                                                    <Animated.Image
                                                        className='shadow-sm'
                                                        source={THC.image}
                                                        onLoadStart={() => updateImageLoader(true)}
                                                        onLoadEnd={() => updateImageLoader(false)}
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
                                                }
                                                {item.Restaurant == 'Rasananda' &&
                                                    <Animated.Image
                                                        className='shadow-sm'
                                                        source={Rasananda.image}
                                                        onLoadStart={() => updateImageLoader(true)}
                                                        onLoadEnd={() => updateImageLoader(false)}
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
                                                }
                                            </View>

                                        </View>

                                        <VStack className='w-screen items-center pb-12'
                                            style={[colorScheme == 'light' ? Styles.LightBG : Styles.DarkBG]}
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

                                                        <HStack className='items-start self-center py-1 w-11/12 justify-between'>
                                                            <HStack className='items-start space-x-2'>
                                                                <Image
                                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                    source={Dish}
                                                                />

                                                                <VStack className='py-1 w-8/12'>
                                                                <Text className='font-medium text-md pb-1'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                    {orderItem.name}
                                                                </Text>
                                                                    {orderItem.customizations && Object.keys(orderItem.customizations).length>0 && Object.keys(orderItem.customizations).map(key => (
                                                                        <VStack>
                                                                            {orderItem.customizations[key].length > 0 &&
                                                                                <>
                                                                                    <Text className='text-xs font-medium pt-0.5 text-gray-400'
                                                                                    // style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                                    >
                                                                                        {key}
                                                                                    </Text>
                                                                                    <Text className='text-xs font-medium pb-0.5'
                                                                                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                                    >
                                                                                        {orderItem.customizations[key].replace(orderItem.name, '').trim()}
                                                                                    </Text>
                                                                                </>
                                                                            }

                                                                        </VStack>
                                                                    ))}
                                                                </VStack>

                                                            </HStack>
                                                            <Text className='font-medium text-md pt-1'
                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                ₹{orderItem.price} x {orderItem.quantity}
                                                            </Text>
                                                        </HStack>
                                                    </>
                                                ))}

                                                <HStack className='items-start py-1 mt-1 w-11/12 self-center justify-between'
                                                    style={[colorScheme == 'light' ?
                                                        {
                                                            borderTopWidth: 1,
                                                            borderColor: 'rgb(209, 213, 219)'
                                                        }
                                                        :
                                                        {
                                                            borderTopWidth: 1,
                                                            borderColor: 'rgb(107, 114, 128)'
                                                        }
                                                    ]}
                                                >
                                                    <VStack>
                                                        <HStack className='items-center space-x-2'>
                                                            <Image
                                                                style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                source={Total}
                                                            />
                                                            <Text className='font-medium text-md'
                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                Grand Total
                                                            </Text>
                                                        </HStack>
                                                        <Text className='font-medium text-xs'
                                                            style={[colorScheme == 'light' ? { color: 'gray' } : { color: 'gray' }]}>
                                                            (including restaurant charges)
                                                        </Text>
                                                    </VStack>
                                                    <Text className='font-medium text-md'
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
                                                    <VStack className='w-11/12 self-center py-2 rounded-lg'
                                                        style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}
                                                    >
                                                        <HStack className='items-center space-x-2 w-11/12 self-center'>
                                                            <Image
                                                                style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                source={PenIcon}
                                                            />
                                                            <Text className='font-medium text-md'
                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                "{item.orderInstructions}"
                                                            </Text>
                                                        </HStack>
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
                                                        <HStack className='items-center space-x-2'>
                                                            <Image
                                                                style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                source={Clock}
                                                            />
                                                            <Text className='font-medium text-md'
                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                Placed At
                                                            </Text>
                                                        </HStack>
                                                        <Text className='font-medium text-md'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                            {item.orderDate.slice(0, 7)}
                                                        </Text>
                                                    </HStack>

                                                    <HStack className='items-center self-center py-1 w-11/12 justify-between'>
                                                        <HStack className='items-center space-x-2'>
                                                            {item.orderType == 'Delivery' &&
                                                                <Image
                                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                    source={FoodDelivery}
                                                                />
                                                            }
                                                            {item.orderType == 'Dine In' &&
                                                                <Image
                                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                    source={DineIn}
                                                                />
                                                            }
                                                            <Text className='font-medium text-md'
                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                Order Type
                                                            </Text>
                                                        </HStack>
                                                        <Text className='font-medium text-md'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                            {item.orderType}
                                                        </Text>
                                                    </HStack>

                                                    {item.orderType == 'Delivery' &&
                                                        <>
                                                            <HStack className='items-center self-center py-1 w-11/12 justify-between'>
                                                                <HStack className='items-center space-x-2'>
                                                                    {(item.deliveryLocation == 'RH1' || item.deliveryLocation == 'RH2' || item.deliveryLocation == 'RH3' || item.deliveryLocation == 'RH4' || item.deliveryLocation == 'RH5') &&
                                                                        <Image
                                                                            style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                            source={RH}
                                                                        />
                                                                    }
                                                                    {item.deliveryLocation == 'Library AC04' &&
                                                                        <Image
                                                                            style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                            source={AC04}
                                                                        />
                                                                    }
                                                                    {item.deliveryLocation == 'Mess' &&
                                                                        <Image
                                                                            style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                            source={Mess}
                                                                        />
                                                                    }
                                                                    {item.deliveryLocation == 'Sports Block' &&
                                                                        <Image
                                                                            style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                            source={SportsBlock}
                                                                        />
                                                                    }
                                                                    <Text className='font-medium text-md'
                                                                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                        Location
                                                                    </Text>
                                                                </HStack>
                                                                <Text className='font-medium text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                    {item.deliveryLocation}
                                                                </Text>
                                                            </HStack>
                                                        </>
                                                    }

                                                    <HStack className='items-center self-center py-1 w-11/12 justify-between'>
                                                        <HStack className='items-center space-x-2'>
                                                            {item.payment == 'Pay At Outlet' &&
                                                                <Image
                                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                    source={UPI}
                                                                />
                                                            }
                                                            {item.payment == 'Pay On Delivery' &&
                                                                <Image
                                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                    source={COD}
                                                                />
                                                            }
                                                            <Text className='font-medium text-md'
                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                Payment
                                                            </Text>
                                                        </HStack>
                                                        <Text className='font-medium text-md'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                            {item.payment}
                                                        </Text>
                                                    </HStack>
                                                </VStack>

                                            </VStack>

                                            <VStack className='w-screen items-center'>
                                                <Text className='text-center font-medium text-md pt-4 pb-2' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                    CONTACT
                                                </Text>

                                                {actualUser &&
                                                    <View style={colorScheme == 'light' ? styles.LightnameEmailPhotoContainer : styles.DarknameEmailPhotoContainer} className='shadow-sm'>

                                                        <View className='px-3'>
                                                            <Image style={styles.userPic} source={{ uri: `https://api.multiavatar.com/${actualUser.name}.png?apikey=Bvjs0QyHcCxZNe` }} />
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

            }

            {Fetching &&
                <View className='h-screen' style={[colorScheme == 'light' ? Styles.LightBG : Styles.DarkBG]}>
                    <SafeAreaView>
                        <VStack className='w-11/12 self-center justify-center' >
                            <Skeleton h='3' rounded='full' className='w-3/12 self-center '
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='8' rounded='md' className='w-7/12 self-center top-4 z-10'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h={ITEM_HEIGHT * 0.4} rounded='md' className='w-full self-center'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='3' rounded='full' className='w-3/12 self-center my-3'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='70' rounded='md' className='w-11/12 self-center'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='3' rounded='full' className='w-3/12 self-center my-3'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='30' rounded='md' className='w-11/12 self-center'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='3' rounded='full' className='w-3/12 self-center my-3'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='90' rounded='md' className='w-11/12 self-center'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='3' rounded='full' className='w-3/12 self-center my-3'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='70' rounded='md' className='w-11/12 self-center'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </VStack>

                    </SafeAreaView>
                </View>
            }

        </>
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
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    DarknameEmailPhotoContainer: {
        width: '91.666667%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 10,
        backgroundColor: '#262626',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
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
        borderWidth: 1,
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
        borderTopWidth: 1,
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
        borderWidth: 1,
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
        borderTopWidth: 1,
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
        borderBottomWidth: 1,
        borderColor: 'rgb(229, 231, 235)',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    DarkDropdownItem: {
        borderBottomWidth: 1,
        borderColor: 'rgb(75, 85, 99)',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    LightDropdownItemEnd: {
        borderBottomWidth: 1,
        borderColor: '#ffffff',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    DarkDropdownItemEnd: {
        borderBottomWidth: 1,
        borderColor: '#262626',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
});
