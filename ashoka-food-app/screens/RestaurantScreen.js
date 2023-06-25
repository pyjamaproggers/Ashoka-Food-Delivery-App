import React, {useLayoutEffect} from 'react'
import { useEffect } from 'react';
import { useRoute, useNavigation} from '@react-navigation/native';
import { View, Text, Image, TextInput, ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native';
import { ArrowLeftIcon, ClockIcon, MapPinIcon, BoltIcon} from 'react-native-heroicons/solid';
import { selectRestaurant, setRestaurant } from '../reduxslices/restaurantSlice'
import { useDispatch } from 'react-redux'
import CartIcon from '../components/CartIcon';
import DishRow from './DishRow';

const RestaurantScreen = () =>
{
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const {
        params: {
            id, image, title, genre, timing, location, description, dishes
        },
    } = useRoute();

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerShown: false,
        })
    }, [])

    useEffect(() => {
        dispatch(
          setRestaurant({
            description: description, location : location,
        name : title, image : image, genre : null, timing : timing, 
        dishes : dishes
          })
        )
        console.log("RESTAURANT SET!")
      }, [dispatch])
    return(
        <>
        <CartIcon/>
        <ScrollView>
            <View className="relative">
                <Image source={image} className="w-full h-56 bg-gray-300 p-4"/>
                <TouchableOpacity onPress={navigation.goBack} className="absolute top-14 left-5 p-2 bg-gray-100 rounded-full">
                    <ArrowLeftIcon size={20} color="black"/>
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
                    {dishes.map((dish)=>{
                        console.log(dish)
                        return(
                            <DishRow name = {dish.name} Price = {dish.Price} Veg_NonVeg={dish.Veg_NonVeg}/>
                        )
                        })}
                </View>
        </ScrollView>
        </>
    );
}

export default RestaurantScreen;

