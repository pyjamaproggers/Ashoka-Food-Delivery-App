import React, { Component, useLayoutEffect } from 'react'
import { useRoute, useNavigation} from '@react-navigation/native';
import { View, Text, Image, TextInput, ScrollView } from 'react-native'

const RestaurantScreen = () =>
{
    const navigation = useNavigation();
    
    const {
        params: {
            id, image, title, genre, rating, location, description
        },
    } = useRoute();

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerShown: false,
        })
    }, [])

    return(
        <ScrollView>
            <Text>{title}</Text>
        </ScrollView>
    )
}

export default RestaurantScreen;

