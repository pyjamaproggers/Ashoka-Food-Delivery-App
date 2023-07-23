import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList, useColorScheme } from 'react-native';
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
import { Alert, CloseIcon, HStack, IconButton, Slide, VStack } from 'native-base';
import { useNetInfo } from "@react-native-community/netinfo";
import axios from 'axios';
import { LoadJoke } from './Restaurants';

const HomeScreen = () => {
    const navigation = useNavigation();
    const netInfo = useNetInfo()
    const [DeliveryLocation, setDeliveryLocation] = useState('RH1')
    const [isOpen, setIsOpen] = useState(false)
    const [Searched, setSearched] = useState('')
    const [Joke, setJoke] = useState('')
    const [GetJoke, setGetJoke] = useState(false)

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

    const LoadJoke = (data) => {
        if (data = true) {
            fetchJokes()
        }
    }

    const options = {
        method: 'GET',
        url: 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist&type=single',
        contentType: 'application/json',
    };

    const fetchJokes = async () => {
        try {
            const response = await axios.request(options)
                .then(response => {
                    if (response.status == 200) {
                        if (response.data.joke.length <= 100) {
                            setJoke(response.data.joke)
                        }
                        else {
                            fetchJokes()
                        }
                    }
                })
        } catch (error) {
            console.error(error);
        }
    }
    const test = () => {
        console.log('*')
    }



    const {
        params: { actualUser },
    } = useRoute();
    console.log(actualUser)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            gestureEnabled: false,
        });
    }, [colorScheme]);

    const MINUTE_MS = 36000000; //every hour

    useEffect(() => {
        fetchJokes()
        const interval = setInterval(() => {
            fetchJokes()
        }, MINUTE_MS);

        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])


    return (
        <SafeAreaView className=" pt-5" style={[colorScheme == 'light' ? { backgroundColor: '#F2F2F2' } : { backgroundColor: '#0c0c0f' }]}>

            <View className="flex-row pb-3 items-center mx-2 space-x-1 z-50 h-max">
                <VStack className='self-center justify-center items-center' space={2}>
                    <Image source={AshokaLogo} className="p-4 rounded-full" style={{ height: 30, width: 30 }} />
                    <Text className='self-center font-semibold text-xs italic' style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}>
                        AshokaEats™
                    </Text>
                </VStack>
                <View className="flex-1">

                    {/* Dropdown Menu */}
                    {Joke &&
                        <VStack space={1}>
                            <Text className="font-normal text-xs pl-2"
                                style={[colorScheme == 'light' ? Styles.LightTextSecondary : Styles.DarkTextSecondary]}
                            >
                                Joke of the hour
                            </Text>
                            <Text className="font-normal text-xs pl-2"
                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                            >
                                {Joke}
                            </Text>
                        </VStack>
                    }

                    {Joke.length == 0 &&
                        <>
                            <TouchableOpacity
                                onPress={() => {
                                    setIsOpen(!isOpen)
                                }}
                                style={[colorScheme == 'light' ? Styles.LightDropdownButton : Styles.DarkDropdownButton]}
                            >
                                <Text className='text-sm' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
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
                    }

                </View>

                <View className='flex-end'>
                    <TouchableOpacity onPress={() => {
                        console.log(actualUser);
                        navigation.navigate('UserScreen', { actualUser })
                        setIsOpen(false)
                    }}>
                        {actualUser.hasOwnProperty('picture') ?
                            <Image style={styles.userPic} source={{ uri: actualUser.picture }} />
                            :
                            <Image style={styles.userPic} source={userPic} />
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
                            autoCorrect={false} />
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
                            autoCorrect={false} />
                    }
                </View>
            </View>

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