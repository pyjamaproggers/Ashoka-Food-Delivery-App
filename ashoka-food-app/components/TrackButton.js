import { View, Text, TouchableOpacity, ScrollView, colorScheme, useColorScheme, TextInput, FlatList, Alert } from "react-native";
import React, { useMemo, useState, useLayoutEffect, useRef } from "react";
import { SafeAreaView, StyleSheet, StatusBar, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Styles from '../components/Styles.js'
import ChevronUp from '../assets/chevronupicon.png'
import ChevronDown from '../assets/chevrondownicon.png'
import { CloseIcon, HStack, IconButton, Slide, VStack, Skeleton } from 'native-base';

export default TrackButton = () => {

    const colorScheme = useColorScheme()
    const navigation = useNavigation();

    return (
        <SafeAreaView className="absolute bottom-0 w-screen z-50 " style={[colorScheme == 'light' ? Styles.LightCartButton : Styles.DarkCartButton]}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('LiveOrders')
                }}
                className="bg-[#3E5896] absolute bottom-w w-max h-max py-1.5 my-0.5 px-3 flex-row items-center rounded-lg z-20"
            >
                <HStack className='items-center justify-between w-full'>
                    <>
                        <VStack>
                            <Text className='text-2xl pl-1 font-medium text-white'
                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                            >
                                Track My Order(s)
                            </Text>
                        </VStack>
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
    )
}