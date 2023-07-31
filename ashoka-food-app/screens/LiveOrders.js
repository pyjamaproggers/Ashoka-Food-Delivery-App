import { View, Text, TouchableOpacity, ScrollView, colorScheme, useColorScheme, TextInput, FlatList, Alert, Dimensions, Animated, } from "react-native";
import React, { useMemo, useState, useLayoutEffect, useRef } from "react";
import { SafeAreaView, StyleSheet, StatusBar, Image } from "react-native";
import { CloseIcon, HStack, IconButton, Slide, VStack, Skeleton } from 'native-base';
import { useNavigation, useRoute } from "@react-navigation/native";
import Styles from '../components/Styles.js'
import Test1 from '../assets/testoutlet1.jpg'
import Test2 from '../assets/testoutlet2.jpg'

export default LiveOrders = () => {

    const colorScheme = useColorScheme()
    const navigation = useNavigation();

    const usersLiveOrders = [
        {
            name: 'Aryan Yadav',
            phone: '+918014213125',
            email: 'aryan.yadav_asp24@ashoka.edu.in',
            Restaurant: 'Roti Boti',
            orderAmount: '679.00',
            orderItems: [
                {
                    name: 'Butter Chicekn',
                    price: 200
                },
                {
                    name: 'Tandoori Chicken (half)',
                    price: 180
                },
            ],
            orderDate: '22:33PM on 31 July 2023',
            orderInstructions: '',
            orderType: 'Delivery',
            payment: 'Pay At Outlet',
            deliveryLocation: 'Sports Block',
            image: Test1
        },
        {
            name: 'Aryan Yadav',
            phone: '+918014213125',
            email: 'aryan.yadav_asp24@ashoka.edu.in',
            Restaurant: 'Dhaba',
            orderAmount: '679.00',
            orderItems: [
                {
                    name: 'Dal Makhani',
                    price: 69
                },
            ],
            orderDate: '18:06PM on 31 July 2023',
            orderInstructions: '',
            orderType: 'Delivery',
            payment: 'Pay At Outlet',
            deliveryLocation: 'RH1',
            image: Test2
        },
    ]

    const { width, height } = Dimensions.get('screen');
    const ITEM_WIDTH = width;
    const ITEM_HEIGHT = ITEM_WIDTH * 0.9;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            gestureEnabled: false,
        });
    }, []);

    return (
        <>
            <FlatList
                data={usersLiveOrders}
                horizontal
                showsHorizontalScrollIndicator={true}
                pagingEnabled
                renderItem={({ item, index }) => {
                    return (
                        <View style={{ width: width }}>
                            <SafeAreaView className='absolute top-0 z-20 w-screen'>
                                <View style={[colorScheme == 'light' ? Styles.LightTrackingTopBTN : Styles.DarkTrackingTopBTN]}>
                                    <VStack className='self-center items-center'
                                    >
                                        <Text className='font-medium text-xl'
                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                        >
                                            {item.Restaurant}
                                        </Text>
                                        <Text className='font-medium text-base'
                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                        >
                                            {item.orderDate}
                                        </Text>
                                    </VStack>
                                </View>
                            </SafeAreaView>
                            <Image
                                source={item.image}
                                style={{
                                    width: ITEM_WIDTH,
                                    height: ITEM_HEIGHT,
                                    resizeMode: 'cover'
                                }}
                            />
                        </View>
                    )
                }}
            />
        </>
    )
}