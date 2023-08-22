import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList, useColorScheme, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AshokaLogo from '../assets/AshokaLogo.png';
import userPic from '../assets/userAvatar.png'
import Warning from '../assets/warning.png'
import Decreasing from '../assets/decrease.png'
import { ChevronDownIcon, MagnifyingGlassIcon, ChevronUpIcon } from 'react-native-heroicons/outline';
import Restaurants from './Restaurants';
import Styles from '../components/Styles';
import ChevronUp from '../assets/chevronupicon.png'
import ChevronDown from '../assets/chevrondownicon.png'
import Search from '../assets/searchicon.png'
import { Alert, CloseIcon, HStack, IconButton, Slide, VStack, Skeleton, Avatar } from 'native-base';
import { useNetInfo } from "@react-native-community/netinfo";
import axios from 'axios';
import Tracking from '../assets/tracking.png'
import { IP } from '@dotenv'

const HomeScreen = () => {
    const navigation = useNavigation();
    const netInfo = useNetInfo()
    const [DeliveryLocation, setDeliveryLocation] = useState('RH1')
    const [isOpen, setIsOpen] = useState(false)
    const [Searched, setSearched] = useState('')
    const [Joke, setJoke] = useState('')
    const [GetJoke, setGetJoke] = useState(false)
    const [LoadingJoke, setLoadingJoke] = useState(false)
    const [showDropDown, setShowDropDown] = useState(false)
    const [userHasLiveOrders, setUserHasLiveOrders] = useState(false)
    const [userImage, setUserImage] = useState()


    const colorScheme = useColorScheme();

    const Locations = [
        { location: 'RH1' },
        { location: 'RH2' },
        { location: 'RH3' },
        { location: 'RH4' },
        { location: 'RH5' },
        { location: 'Library AC04' },
        { location: 'Sports Block' },
        { location: 'Mess' },
    ]
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

    const LoadJoke = (data) => {
        console.log('Reloading')
    }

    const options = {
        method: 'GET',
        url: 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist&type=single',
        // url: 'https://official-joke-api.appspot.com/random_joke',
        contentType: 'application/json',
    };

    const fetchJokes = async () => {
        try {
            const response = await axios.request(options)
                .then(response => {
                    if (response.status == 200) {
                        if (response.data.joke.length <= 150) {
                            setJoke(response.data.joke)
                            setLoadingJoke(false)
                            setShowDropDown(false)
                        }
                        else {
                            fetchJokes()
                        }
                    }
                    else {
                        setShowDropDown(true)
                        setLoadingJoke(false)
                    }
                })
        } catch (error) {
            console.error(error);
            setJoke('')
            setShowDropDown(true)
            setLoadingJoke(false)
        }
    }

    const fetchUserAvatar = async () => {
        try {
            const encodedName = encodeURIComponent(actualUser.name);
            const url = `https://api.multiavatar.com/${encodedName}.png?apikey=Bvjs0QyHcCxZNe`;
    
            const response = await fetch(url);
            
            if (response.ok) {
                const imageBlob = await response.blob(); // Get the image data as a Blob
                setUserImage(URL.createObjectURL(imageBlob)); // Create a URL for the Blob and set it as the user image
            } else {
                console.log('Failed to fetch avatar:', response.status);
            }
        } catch (error) {
            console.log('Error in fetching avatar:', error);
        }
    };
    
    

    const {
        params: { actualUser },
    } = useRoute();


    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            gestureEnabled: false,
        });
    }, []);

    const MINUTE_MS = 3600000; //every day

    useEffect(() => {
        setLoadingJoke(true)
        fetchJokes()
        fetchUserAvatar()
        const interval = setInterval(() => {
            setLoadingJoke(true)
            fetchJokes()
        }, MINUTE_MS);

        return () => clearInterval(interval);
    }, [])

    const getUserOrders = async () => {
        try {
            if (!actualUser) {
                console.error('Actual user is undefined');
                return;
            }
            const response = await fetch(`${IP}/api/orders/users/${actualUser.email}`);
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
                setUserHasLiveOrders(false)
            }
            else {
                setUserHasLiveOrders(true)
            }
        } catch (error) {
            console.error('Error fetching orders on homescreen:', error);
            // setRefreshing(false)
            setFetching(false)
        }
    }

    useEffect(() => {
        const checkLiveOrders = async () => {
            await getUserOrders();
        };
        checkLiveOrders();
        const onFocus = navigation.addListener('focus', () => {
            checkLiveOrders();
        });
        return onFocus;
    }, []);


    return (
        <View className="" style={[colorScheme == 'light' ? { backgroundColor: '#F2F2F2' } : { backgroundColor: '#0c0c0f' }]}>

            {/* {userHasLiveOrders &&

                <View className='absolute w-screen bottom-32 z-50 shadow-sm'>
                    <SafeAreaView>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('LiveOrders', { actualUser })
                            }}
                            className=" w-7/12 self-center h-max py-3 my-0.5 px-3 flex-row items-center rounded-xl z-20"
                            style={{ backgroundColor: '#3E5896' }}
                        >
                            <HStack className='items-center justify-between w-full'>
                                <>
                                    <HStack className='items-center' space={2}>
                                        <Image
                                            style={{ width: 20, height: 20, resizeMode: "contain" }}
                                            source={Tracking}
                                        />
                                        <Text className='text-base font-medium text-white'
                                        >
                                            Track My Order
                                        </Text>
                                    </HStack>
                                    <View style={{ transform: [{ rotate: '90deg' }] }}>
                                        <Image
                                            style={{ width: 12, height: 12, resizeMode: "contain" }}
                                            source={ChevronUp}
                                        />
                                    </View>
                                </>
                            </HStack>
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

            } */}

            {/* <SafeAreaView className="absolute bottom-32 w-7/12 self-center z-50 shadow-sm">
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('LiveOrders')
                    }}
                    className=" w-max h-max py-2 my-0.5 px-3 flex-row items-center rounded-lg z-50"
                    style={{backgroundColor: '#3E5896'}}
                >
                    <HStack className='items-center justify-between w-full'>
                        <>
                            <HStack className='items-center' space={2}>
                                <Image
                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                    source={Tracking}
                                />
                                <Text className='text-base font-medium text-white'
                                >
                                    Track My Order
                                </Text>
                            </HStack>
                            <View style={{ transform: [{ rotate: '90deg' }] }}>
                                <Image
                                    style={{ width: 12, height: 12, resizeMode: "contain" }}
                                    source={ChevronUp}
                                />
                            </View>
                        </>
                    </HStack>
                </TouchableOpacity>
            </SafeAreaView> */}

            <SafeAreaView className='h-max'>
                <View className="flex-row pb-3 pt-1.5 items-center mx-2 space-x-1 z-50 h-max w-10/12 justify-between self-center">

                    <Image source={AshokaLogo} className="p-4 rounded-full" style={{ height: 50, width: 50 }} />

                    <View className="">

                        <VStack space={1} className='justify-center'>
                            <Text allowFontScaling={false}
                                className='self-center font-semibold text-xl italic ' style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}>
                                AshokaEats
                            </Text>
                        </VStack>

                        {/* {LoadingJoke &&
                        <VStack space={2}>
                            <Skeleton h='2' rounded='full' w='20%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='90%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='90%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </VStack>
                    } */}

                        {/* Dropdown Menu */}
                        {/* {!showDropDown && !LoadingJoke &&
                        <>
                            <Text className='w-full pl-1 self-center font-semibold text-xs' style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}>
                                Deliver to
                            </Text>
                            <TouchableOpacity
                                className='w-full self-center'
                                onPress={() => {
                                    setIsOpen(!isOpen)
                                }}
                                style={[colorScheme == 'light' ? Styles.LightDropdownButton : Styles.DarkDropdownButton]}
                            >
                                <Text className='text-sm pl-2' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                    {DeliveryLocation}
                                </Text>
                                {isOpen ?
                                    <Image
                                        style={{ width: 12, height: 12, resizeMode: "contain" }}
                                        source={ChevronUp}
                                    />
                                    :
                                    <Image
                                        style={{ width: 12, height: 12, resizeMode: "contain" }}
                                        source={ChevronDown}
                                    />
                                }
                            </TouchableOpacity>
                            {isOpen === true &&
                                <View style={[colorScheme == 'light' ? Styles.LightDropdownMenu : Styles.DarkDropdownMenu]}>
                                    <FlatList data={Locations} renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setDeliveryLocation(item.location)
                                                    setIsOpen(false)
                                                }}
                                                style={[colorScheme == 'light' ? Styles.LightDropdownItem : Styles.DarkDropdownItem]}
                                            >
                                                <Text style={[colorScheme == 'light' ? Styles.LightDropdownText : Styles.DarkDropdownText]}>
                                                    {item.location}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    }} />
                                </View>
                            }
                        </>
                    } */}

                    </View>

                    <View className=''>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('UserScreen', { actualUser })
                            setIsOpen(false)
                        }}>
                            {userColor &&
                                <Avatar bg={userColor} source={{
                                    uri: `https://api.multiavatar.com/${actualUser.name}.png?apikey=Bvjs0QyHcCxZNe`
                                }}>
                                    <Text className='' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                        {actualUser.given_name[0]}{actualUser.family_name[0]}
                                    </Text>
                                </Avatar>
                            }
                        </TouchableOpacity>
                    </View>

                </View>
                {/* search */}
                <View className="flex-row item-center space-x-2 pb-2 mx-4 ">
                    <View className="flex-row space-x-2 flex-1 p-3 shadow-sm" style={[colorScheme == 'light' ? Styles.LightSearchBar : Styles.DarkSearchBar]} >
                        <Image
                            style={{ width: 16, height: 16, resizeMode: "contain" }}
                            source={Search}
                        />
                        {colorScheme == 'light' &&
                            <TextInput placeholder="Search for a dish or place" keyboardType="default" className='w-full'
                                style={{ color: '#000' }}
                                onPressIn={() => {
                                    setIsOpen(false)
                                }}
                                onChangeText={(text) => {
                                    setSearched(text)
                                }}
                                autoComplete='off'
                                autoCorrect={false}
                                enterKeyHint='done' />
                        }
                        {colorScheme != 'light' &&
                            <TextInput placeholder="Search for a dish or place" keyboardType="default" className='w-full'
                                style={{ color: '#fff' }}
                                onPressIn={() => {
                                    setIsOpen(false)
                                }}
                                onChangeText={(text) => {
                                    setSearched(text)
                                }}
                                autoComplete='off'
                                autoCorrect={false}
                                enterKeyHint='done'
                            />
                        }
                    </View>
                </View>

                {userHasLiveOrders &&
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('LiveOrders', { actualUser })
                        }}
                        className=" w-11/12 self-center h-max py-3 px-3 mb-1.5 flex-row items-center rounded-lg z-20"
                        style={{ backgroundColor: '#3E5896' }}
                    >
                        <HStack className='items-center justify-between w-full'>
                            <>
                                <HStack className='items-center' space={2}>
                                    <Image
                                        style={{ width: 20, height: 20, resizeMode: "contain" }}
                                        source={Tracking}
                                    />
                                    <Text allowFontScaling={false} className='text-md font-semibold text-white'
                                    >
                                        Track My Order
                                    </Text>
                                </HStack>
                                <View >
                                    <Image
                                        style={{ width: 12, height: 12, resizeMode: "contain" }}
                                        source={ChevronUp}
                                    />
                                </View>
                            </>
                        </HStack>
                    </TouchableOpacity>
                }

                <Slide in={!netInfo.isConnected} placement="top">
                    <Alert justifyContent="center" status="error" safeAreaTop={10}>
                        <VStack space={1} >
                            <HStack className='justify-center pt-2'>
                                <Image source={Warning} className="h-7 w-7" />
                            </HStack>
                            <HStack className='items-center justify-center'>
                                <Text className='text-md pt-1 font-medium pl-2 pr-1'>
                                    Mmm, Ashoka wifi stonks
                                </Text>
                                <Image source={Decreasing} className="h-5 w-5" />
                            </HStack>
                        </VStack>
                    </Alert>
                </Slide>

                {/* Body */}
                <Restaurants searched={Searched} actualUser={actualUser} LoadJoke={LoadJoke} />
            </SafeAreaView>


        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    dropdownArea: {
        top: '100%',
    },
    userPic: {
        width: 50,
        height: 50,
        borderRadius: 100,
        justifyContent: 'center'
    }
})