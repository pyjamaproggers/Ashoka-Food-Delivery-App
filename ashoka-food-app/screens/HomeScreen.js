import React, { useLayoutEffect, useState } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AshokaLogo from '../assets/ASHOKAWHITELOGO.png';
import userPic from '../assets/userAvatar.png'
import { ChevronDownIcon, MagnifyingGlassIcon, ChevronUpIcon } from 'react-native-heroicons/outline';
import Restaurants from './Restaurants';
import Styles from '../components/Styles';

const HomeScreen = () => {
    const navigation = useNavigation();

    const [DeliveryLocation, setDeliveryLocation] = useState('RH1')
    const [isOpen, setIsOpen] = useState(false)

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
                            <ChevronUpIcon size={20} color="#f87c7c" />
                            :
                            <ChevronDownIcon size={20} color="#f87c7c" />
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
                    <MagnifyingGlassIcon color="#f87c7c" size={20} />
                    <TextInput placeholder="Search for a dish or place" keyboardType="default" className='w-full'
                        onPressIn={() => {
                            setIsOpen(false)
                        }} />
                </View>
            </View>
            
            {/* Body */}
            <Restaurants />

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