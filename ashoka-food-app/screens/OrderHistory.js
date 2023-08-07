import React, { useEffect, useLayoutEffect, useMemo, useState, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView, useColorScheme, StyleSheet, TouchableOpacity, Text, View, Image, TextInput, ScrollView } from 'react-native';
import { HStack, Skeleton, VStack } from 'native-base';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import Styles from '../components/Styles';
import Search from '../assets/searchicon.png';
import { IP } from '@dotenv'
import Test1 from '../assets/testoutlet1.jpg'
import Test2 from '../assets/testoutlet2.jpg'
import Test3 from '../assets/testoutlet3.jpg'
import Grey from '../assets/greysquare.jpeg'
import Chevronup from '../assets/chevronupicon.png';
import Clock from '../assets/clockicon.png'
import RestaurantIcon from '../assets/shopmapicon.png'
import DeliveryIcon from '../assets/deliverybhaiya.png';
import Chef from '../assets/chef.png';
import Siren from '../assets/siren.png';
import Tick from '../assets/verified.png';
import FoodReady from '../assets/foodready.png';
import Cross from '../assets/cross.png';
import Placed from '../assets/cloud.png';

export default function OrderHistory() {

    const navigation = useNavigation();
    const colorScheme = useColorScheme();

    const [userOrders, setUserOrders] = useState([]);
    const [searched, setSearched] = useState('')
    const [searchedUserOrders, setSearchedUserOrders] = useState([])

    const [Fetching, setFetching] = useState(true)
    const [loadingImage, setLoadingImage] = useState()

    const {
        params: { actualUser },
    } = useRoute();

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

    const fetchOrders = async () => {
        setFetching(true);
        try {
            const response = await fetch(`${IP}/api/orders/users/${actualUser.email}`);
            const data = await response.json();
            data.forEach((order, index) => {
                switch (order.Restaurant) {
                    case 'Roti Boti':
                        order['image'] = RotiBoti.image;
                        order['restaurantPhone'] = RotiBoti.phoneNumber;
                        break;
                    case 'Dhaba':
                        order['image'] = Dhaba.image;
                        order['restaurantPhone'] = Dhaba.phoneNumber;
                        break;
                    case 'The Hunger Cycle':
                        order['image'] = THC.image;
                        order['restaurantPhone'] = THC.phoneNumber;
                        break;
                    case 'Chaat Stall':
                        order['image'] = FoodVillage.image;
                        order['restaurantPhone'] = FoodVillage.phoneNumber;
                        break;
                    case 'Chicago Pizza':
                        order['image'] = ChicagoPizza.image;
                        order['restaurantPhone'] = ChicagoPizza.phoneNumber;
                        break;
                    case 'Subway':
                        order['image'] = Subway.image;
                        order['restaurantPhone'] = Subway.phoneNumber;
                        break;
                    case 'Rasananda':
                        order['image'] = Rasananda.image;
                        order['restaurantPhone'] = Rasananda.phoneNumber;
                        break;
                    default:
                        order['image'] = Grey; // Default image if restaurant not found
                        order['restaurantPhone'] = ''; // Default phone number if restaurant not found
                        break;
                }
            });
            const tempUserOrders = data.reverse();
            setUserOrders(tempUserOrders);
            setFetching(false);
        } catch (error) {
            console.error("Error while fetching orders on order history page", error);
        }
    };

    const segregateSearchedOrders = useCallback((searched, orders) => {
        if (!searched || !orders || orders.length === 0) {
            // If searched is empty or orders are not available, reset the searchedUserOrders state to an empty array
            setSearchedUserOrders([]);
            return;
        }
        const tempSearchedUserOrders = [];
        let searchedLC = searched.toLowerCase()
        orders.forEach((order) => {
            if (
                order.Restaurant.includes(searchedLC) ||
                order.orderStatus.includes(searchedLC) ||
                order.orderDate.includes(searchedLC) ||
                order.orderItems.some((item) => item.name.includes(searchedLC))
            ) {
                tempSearchedUserOrders.push(order);
            }
        });
        setSearchedUserOrders(tempSearchedUserOrders);
    }, []);

    useEffect(() => {
        window.setTimeout(() => {

            fetchOrders();
        }, 500)
    }, []);

    const searchedMemo = useMemo(() => {
        if (searched && userOrders.length > 0) {
            return segregateSearchedOrders(searched, userOrders);
        }
        return [];
    }, [searched, userOrders, segregateSearchedOrders]);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    return (
        <SafeAreaView style={[colorScheme == 'light' ? { backgroundColor: '#F2F2F2', flex: 1 } : { backgroundColor: '#0c0c0f', flex: 1 }]}>

            <HStack className='items-center h-9 w-full justify-center'>
                <TouchableOpacity onPress={() => { navigation.navigate('UserScreen', { actualUser }) }} className="p-2 rounded-full items-center shadow-lg" style={[colorScheme == 'light' ? styles.LightbackButton : styles.DarkbackButton]}>
                    <ArrowLeftIcon size={20} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
                </TouchableOpacity>

                <Text className='self-center font-semibold text-base '
                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                >
                    {actualUser.given_name}'s Order History
                </Text>
            </HStack>

            <View className="flex-row item-center space-x-2 pb-2 pt-2 w-11/12 self-center ">
                <View className="flex-row space-x-2 flex-1 p-3 shadow-sm" style={[colorScheme == 'light' ? Styles.LightSearchBar : Styles.DarkSearchBar]} >
                    <Image
                        style={{ width: 16, height: 16, resizeMode: "contain" }}
                        source={Search}
                    />
                    {colorScheme == 'light' &&
                        <TextInput placeholder="Filter using dishes or outlets" keyboardType="default" className='w-full'
                            style={{ color: '#000' }}
                            onChangeText={(text) => {
                                setSearched(text)
                                // if(!text){
                                //     segregateSearchedOrders('')
                                // }
                                // if (text) {
                                //     segregateSearchedOrders(text)
                                // }
                            }}
                            autoComplete='off'
                            autoCorrect={false}
                            enterKeyHint='done'
                            readOnly={Fetching}
                        />
                    }
                    {colorScheme != 'light' &&
                        <TextInput placeholder="Filter using dishes or outlets" keyboardType="default" className='w-full'
                            style={{ color: '#fff' }}
                            onChangeText={(text) => {
                                setSearched(text)
                                // if (text) {
                                //     segregateSearchedOrders(text)
                                // }
                                // if(!text){
                                //     segregateSearchedOrders('')
                                // }
                            }}
                            autoComplete='off'
                            autoCorrect={true}
                            enterKeyHint='done'
                            readOnly={Fetching}
                        />
                    }
                </View>
            </View>

            <ScrollView
            showsVerticalScrollIndicator={false}
            >

                <VStack className='w-11/12 space-y-2 self-center '>

                    {userOrders && !Fetching && searched.length == 0 &&
                        <>
                            {userOrders.map((order, index) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('EachOrder', {
                                            name: order.name,
                                            phone: order.phone,
                                            email: order.email,
                                            Restaurant: order.Restaurant,
                                            orderAmount: order.orderAmount,
                                            orderItems: order.orderItems,
                                            orderDate: order.orderDate,
                                            orderInstructions: order.orderInstructions,
                                            orderStatus: order.orderStatus,
                                            orderType: order.orderType,
                                            payment: order.payment,
                                            deliveryLocation: order.deliveryLocation,
                                            restaurantPhone: order.restaurantPhone,
                                            image: order.image,
                                            actualUser: actualUser
                                        })
                                    }}
                                >

                                    <HStack className='items-center w-full rounded-lg my-1.5'
                                        style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}
                                    >
                                        <Image source={order.image} style={{ width: '22.5%', height: '100%', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, resizeMode: 'cover' }} />
                                        <VStack className='py-1 w-10/12'>

                                            <HStack className='items-center justify-between w-10/12'>

                                                <VStack>
                                                    <HStack className='py-1  space-x-2 px-2 items-center'>
                                                        <Image
                                                            style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                            source={RestaurantIcon}
                                                        />
                                                        <Text className='font-medium text-md'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                            {order.Restaurant}
                                                        </Text>
                                                    </HStack>
                                                    <HStack className='py-1 space-x-2 px-2 items-center'>
                                                        <Image
                                                            style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                            source={Clock}
                                                        />
                                                        <Text className='font-medium text-md'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                            {order.orderDate}
                                                        </Text>
                                                    </HStack>
                                                    <HStack className='py-1  space-x-2 px-2 items-center'>
                                                        {order.orderStatus == 'placed' &&
                                                            <HStack className='items-center space-x-2'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={Placed}
                                                                />
                                                                <Text className='font-medium text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                    Placed
                                                                </Text>

                                                            </HStack>
                                                        }
                                                        {order.orderStatus == 'accepted' &&
                                                            <HStack className='items-center space-x-2'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={Siren}
                                                                />
                                                                <Text className='font-medium text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                    Accepted
                                                                </Text>
                                                            </HStack>
                                                        }
                                                        {order.orderStatus == 'preparing' &&
                                                            <HStack className='items-center space-x-2'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={Chef}
                                                                />
                                                                <Text className='font-medium text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                    Preparing
                                                                </Text>
                                                            </HStack>
                                                        }
                                                        {order.orderStatus == 'out for delivery' &&
                                                            <HStack className='items-center space-x-2'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={DeliveryIcon}
                                                                />
                                                                <Text className='font-medium text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                    Out For Delivery
                                                                </Text>
                                                            </HStack>
                                                        }
                                                        {order.orderStatus == 'ready' &&
                                                            <HStack className='items-center space-x-2'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={FoodReady}
                                                                />
                                                                <Text className='font-medium text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                    Ready At Outlet
                                                                </Text>
                                                            </HStack>
                                                        }
                                                        {order.orderStatus == 'completed' &&
                                                            <HStack className='items-center space-x-2'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={Tick}
                                                                />
                                                                <Text className='font-medium text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                    Completed
                                                                </Text>
                                                            </HStack>
                                                        }
                                                        {order.orderStatus.includes('Declined') &&
                                                            <HStack className='items-center space-x-2'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={Cross}
                                                                />
                                                                <Text className='font-medium text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                    Declined
                                                                </Text>
                                                            </HStack>
                                                        }
                                                    </HStack>
                                                </VStack>


                                                <View style={{ transform: [{ rotate: '90deg' }] }}>
                                                    <Image
                                                        style={{ width: 12, height: 12, resizeMode: "contain" }}
                                                        source={Chevronup}
                                                    />
                                                </View>

                                            </HStack>



                                        </VStack>
                                    </HStack>

                                </TouchableOpacity>
                            ))}
                        </>
                    }

                    {searchedUserOrders && !Fetching && searched.length > 0 &&
                        <>
                            {searchedUserOrders.map((order, index) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('EachOrder', {
                                            name: order.name,
                                            phone: order.phone,
                                            email: order.email,
                                            Restaurant: order.Restaurant,
                                            orderAmount: order.orderAmount,
                                            orderItems: order.orderItems,
                                            orderDate: order.orderDate,
                                            orderInstructions: order.orderInstructions,
                                            orderStatus: order.orderStatus,
                                            orderType: order.orderType,
                                            payment: order.payment,
                                            deliveryLocation: order.deliveryLocation,
                                            restaurantPhone: order.restaurantPhone,
                                            image: order.image,
                                            actualUser: actualUser
                                        })
                                    }}
                                >

                                    <HStack className='items-center w-full rounded-lg my-1.5'
                                        style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}
                                    >
                                        <Image source={order.image} style={{ width: '22.5%', height: '100%', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, resizeMode: 'cover' }} />
                                        <VStack className='py-1 w-10/12'>

                                            <HStack className='items-center justify-between w-10/12'>

                                                <VStack>
                                                    <HStack className='py-1 space-x-2 px-2 items-center'>
                                                        <Image
                                                            style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                            source={RestaurantIcon}
                                                            onLoadStart={() => updateImageLoader(true)}
                                                            onLoadEnd={() => updateImageLoader(false)}
                                                        />
                                                        <Text className='font-medium text-md'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                            {order.Restaurant}
                                                        </Text>
                                                    </HStack>
                                                    <HStack className='py-1 space-x-2 px-2 items-center'>
                                                        <Image
                                                            style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                            source={Clock}
                                                        />
                                                        <Text className='font-medium text-md'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                            {order.orderDate}
                                                        </Text>
                                                    </HStack>
                                                    <HStack className='py-1 space-x-2 px-2 items-center'>
                                                        {order.orderStatus == 'placed' &&
                                                            <HStack className='items-center space-x-2'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={Placed}
                                                                />
                                                                <Text className='font-medium text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                    Placed
                                                                </Text>

                                                            </HStack>
                                                        }
                                                        {order.orderStatus == 'accepted' &&
                                                            <HStack className='items-center space-x-2'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={Siren}
                                                                />
                                                                <Text className='font-medium text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                    Accepted
                                                                </Text>
                                                            </HStack>
                                                        }
                                                        {order.orderStatus == 'preparing' &&
                                                            <HStack className='items-center space-x-2'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={Chef}
                                                                />
                                                                <Text className='font-medium text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                    Preparing
                                                                </Text>
                                                            </HStack>
                                                        }
                                                        {order.orderStatus == 'out for delivery' &&
                                                            <HStack className='items-center space-x-2'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={DeliveryIcon}
                                                                />
                                                                <Text className='font-medium text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                    Out For Delivery
                                                                </Text>
                                                            </HStack>
                                                        }
                                                        {order.orderStatus == 'ready' &&
                                                            <HStack className='items-center space-x-2'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={FoodReady}
                                                                />
                                                                <Text className='font-medium text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                    Ready At Outlet
                                                                </Text>
                                                            </HStack>
                                                        }
                                                        {order.orderStatus == 'completed' &&
                                                            <HStack className='items-center space-x-2'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={Tick}
                                                                />
                                                                <Text className='font-medium text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                    Completed
                                                                </Text>
                                                            </HStack>
                                                        }
                                                        {order.orderStatus.includes('Declined') &&
                                                            <HStack className='items-center space-x-2'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={Cross}
                                                                />
                                                                <Text className='font-medium text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                                    Declined
                                                                </Text>
                                                            </HStack>
                                                        }
                                                    </HStack>
                                                </VStack>


                                                <View style={{ transform: [{ rotate: '90deg' }] }}>
                                                    <Image
                                                        style={{ width: 12, height: 12, resizeMode: "contain" }}
                                                        source={Chevronup}
                                                    />
                                                </View>

                                            </HStack>



                                        </VStack>
                                    </HStack>

                                </TouchableOpacity>
                            ))}
                        </>
                    }

                    {Fetching &&
                        <View className='mb-3 flex-row w-full pt-1 items-center'>
                            <Skeleton h='20' w='20' rounded='lg' className='mr-3'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#0c0c0f'}
                            />
                            <VStack flex="3" space="2" className=''>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                            </VStack>
                        </View>
                    }

                    {Fetching &&
                        <View className='mb-3 flex-row w-full pt-1 items-center'>
                            <Skeleton h='20' w='20' rounded='lg' className='mr-3'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#0c0c0f'}
                            />
                            <VStack flex="3" space="2" className=''>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                            </VStack>
                        </View>
                    }

                    {Fetching &&
                        <View className='mb-3 flex-row w-full pt-1 items-center'>
                            <Skeleton h='20' w='20' rounded='lg' className='mr-3'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#0c0c0f'}
                            />
                            <VStack flex="3" space="2" className=''>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                            </VStack>
                        </View>
                    }

                    {Fetching &&
                        <View className='mb-3 flex-row w-full pt-1 items-center'>
                            <Skeleton h='20' w='20' rounded='lg' className='mr-3'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#0c0c0f'}
                            />
                            <VStack flex="3" space="2" className=''>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                            </VStack>
                        </View>
                    }

                    {Fetching &&
                        <View className='mb-3 flex-row w-full pt-1 items-center'>
                            <Skeleton h='20' w='20' rounded='lg' className='mr-3'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#0c0c0f'}
                            />
                            <VStack flex="3" space="2" className=''>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                            </VStack>
                        </View>
                    }

                    {Fetching &&
                        <View className='mb-3 flex-row w-full pt-1 items-center'>
                            <Skeleton h='20' w='20' rounded='lg' className='mr-3'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#0c0c0f'}
                            />
                            <VStack flex="3" space="2" className=''>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                                <HStack space="2" alignItems="center">
                                    <Skeleton size="4" rounded="full"
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton h='2' rounded='full' w='70%'
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                            </VStack>
                        </View>
                    }





                </VStack>

            </ScrollView>



        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    LightbackButton: {
        backgroundColor: 'white',
        width: 36,
        position: 'absolute',
        top: 0,
        left: 15
    },
    DarkbackButton: {
        position: 'absolute',
        top: 0,
        left: 15,
        backgroundColor: '#262626',
        width: 36
    },
});