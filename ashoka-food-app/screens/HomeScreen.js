import React, { useLayoutEffect, useState } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AshokaLogo from '../assets/ASHOKAWHITELOGO.png';
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


const HomeScreen = () => {
    const navigation = useNavigation();
    const netInfo = useNetInfo()
    const [DeliveryLocation, setDeliveryLocation] = useState('RH1')
    const [isOpen, setIsOpen] = useState(false)
    const [Searched, setSearched] = useState('')

    const colorScheme = useColorScheme();

    const Locations = [
        { location: 'RH1' },
        { location: 'RH2' },
        { location: 'RH3' },
        { location: 'RH4' },
        { location: 'RH5' },
        { location: 'Library AC04' },
    ]

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


    return (
        <SafeAreaView className=" pt-5" style={[colorScheme == 'light' ? { backgroundColor: '#F2F2F2' } : { backgroundColor: '#0c0c0f' }]}>

            <View className="flex-row pb-3 items-center mx-4 space-x-2 z-50">

                <Image source={AshokaLogo} className="h-7 w-7 bg-gray-300 p-4 rounded-full" />
                <View className="flex-1">
                    <Text className="font-normal text-xs pl-2"
                        style={[colorScheme == 'light' ? Styles.LightTextSecondary : Styles.DarkTextSecondary]}
                    >
                        Deliver to
                    </Text>

                    {/* Dropdown Menu */}

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
                            }} />
                    }
                    {colorScheme != 'light' &&
                        <TextInput placeholder="Search for a dish or place" keyboardType="default" className='w-full'
                            style={{ color: '#fff' }}
                            onPressIn={() => {
                                setIsOpen(false)
                            }}
                            onChangeText={(text) => {
                                setSearched(text)
                            }} />
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
            <Restaurants searched={Searched} actualUser={actualUser} />

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