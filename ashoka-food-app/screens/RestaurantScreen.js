import React, { useLayoutEffect, useRef, useState } from 'react'
import { useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, Image, TextInput, ScrollView, Animated } from 'react-native'
import { TouchableOpacity } from 'react-native';
import { ArrowLeftIcon, ClockIcon, MapPinIcon, BoltIcon } from 'react-native-heroicons/solid';
import { selectRestaurant, setRestaurant } from '../reduxslices/restaurantSlice'
import { useDispatch } from 'react-redux'
import CartIcon from '../components/CartIcon';
import DishRow from './DishRow';
import { urlFor } from '../sanity';
import Styles from '../components/Styles';
import { ListItem } from '@rneui/themed';

const RestaurantScreen = () => {
    const [VegDishes, setVegDishes] = useState([]);
    const [NonVegDishes, setNonVegDishes] = useState([]);
    const [SearchedDishes, setSearchedDishes] = useState([]);
    const [MenuCategories, setMenuCategories] = useState([])

    const navigation = useNavigation();
    const dispatch = useDispatch()
    const {
        params: {
            id, image, title, genre, timing, location, description, dishes
        },
    } = useRoute();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, [])

    useEffect(() => {
        dispatch(
            setRestaurant({
                description: description, location: location,
                name: title, image: image, genre: null, timing: timing,
                dishes: dishes
            })
            // Menu_category, Price, Veg_NonVeg, image, name
        )
        console.log(dishes)
        var i,j
        var TempMenuCategories = []
        for(i=0;i<dishes.length;i++){
            if(TempMenuCategories.length==0){
                TempMenuCategories.push(dishes[i].Menu_category)
            }
            else if(TempMenuCategories.length>0){
                var flag = 0
                for(j=0;j<TempMenuCategories.length;j++){
                    if(dishes[i].Menu_category!=TempMenuCategories[j]){
                        flag = 0
                    }
                    else {
                        flag = 1
                    }
                }
                if(flag == 0){
                    TempMenuCategories.push(dishes[i].Menu_category)
                }
            }
        }
        setMenuCategories(TempMenuCategories)
    }, [dispatch])

    const scrollA = useRef(new Animated.Value(0)).current;
    
    return (
        <>
            <CartIcon />
            <Animated.ScrollView 
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: scrollA}}}],
                    {useNativeDriver: true}
                )}
                scrollEventThrottle={16}
            >
                <View className="relative">
                    <Animated.Image source={{ uri: urlFor(image).url() }} style={Styles.RestaurantImage(scrollA)}/>
                    <TouchableOpacity onPress={navigation.goBack} className="absolute top-14 left-5 p-2 bg-gray-100 rounded-full">
                        <ArrowLeftIcon size={20} color="black" />
                    </TouchableOpacity>
                </View>
                <View className="bg-white flex-1">
                    <View className="px-4 pt-4 items-center">
                        <Text className="font-semibold text-3xl pb-2">
                            {title}
                        </Text>
                        <Text className='items-center justify-center pb-2 italic text-lg'>{genre}</Text>
                        <View className="flex-1 space-x-2 space-y-2 my-1">
                            <View className='flex-row items-center'>
                                <ClockIcon opacity={1} color='#F04C0F' size={20} />
                                <Text className="text-md pl-1 text-gray-1000 items-center">{timing} </Text>
                            </View>
                        </View>
                        <View className="flex-1 space-x-2 space-y-2 my-1">
                            <View className='flex-row items-center'>
                                <MapPinIcon opacity={1} color='#2989D6' size={20} />
                                <Text className="text-md pl-1 text-gray-1000 items-center">{location} </Text>
                            </View>
                        </View>
                        <View className="flex-1 space-x-2 space-y-2 my-1 pb-1">
                            <View className='flex-row items-center'>
                                <BoltIcon opacity={1} color='#FDD023' size={20} />
                                <Text className="text-md pl-1 text-gray-1000 items-center">{description} </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Menu */}
                <View>
                    <Text className="px-4 pt-6 mb-3 font-bold text-xl">
                        Menu
                    </Text>

                    {/* Dishrows */}
                    {dishes.map((dish) => {
                        console.log(dish)
                        return (
                            <DishRow name={dish.name} Price={dish.Price} Veg_NonVeg={dish.Veg_NonVeg} />
                        )
                    })}
                </View>
            </Animated.ScrollView>
        </>
    );
}

export default RestaurantScreen;

