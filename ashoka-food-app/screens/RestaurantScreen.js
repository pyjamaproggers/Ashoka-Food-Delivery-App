import React, { useLayoutEffect, useRef, useState } from 'react'
import { useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, Image, TextInput, ScrollView, Animated, useColorScheme } from 'react-native'
import { TouchableOpacity } from 'react-native';
import { ArrowLeftIcon, ClockIcon, MapPinIcon, BoltIcon, PhoneArrowUpRightIcon } from 'react-native-heroicons/solid';
import { selectRestaurant, setRestaurant } from '../reduxslices/restaurantSlice'
import { useDispatch } from 'react-redux'
import CartIcon from '../components/CartIcon';
import DishRow from './DishRow';
import { urlFor } from '../sanity';
import Styles from '../components/Styles';
import { ListItem } from '@rneui/themed';
import { HStack, VStack } from 'native-base';

const RestaurantScreen = () => {
    const [VegDishes, setVegDishes] = useState([]);
    const [NonVegDishes, setNonVegDishes] = useState([]);
    const [SearchedDishes, setSearchedDishes] = useState([]);
    const [MenuCategories, setMenuCategories] = useState([]);
    const [expanded, setExpanded] = useState(false)


  const colorScheme = useColorScheme();

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const scrollA = useRef(new Animated.Value(0)).current;

    const {
        params: {
            id, image, title, genre, timing, location, description, dishes
        },
    } = useRoute();

    const segregateDishes = (dishes) => {
        var TempVegDishes = []
        var TempNonVegDishes = []
        var i, j
        var TempMenuCategories = []
        for (i = 0; i < dishes.length; i++) {
            console.log(dishes[i])
            if (TempMenuCategories.length == 0) {
                TempMenuCategories.push(dishes[i].Menu_category)
            }
            else if (TempMenuCategories.length > 0) {
                var flag = 0
                for (j = 0; j < TempMenuCategories.length; j++) {
                    if (dishes[i].Menu_category != TempMenuCategories[j]) {
                        flag = 0
                    }
                    else {
                        flag = 1
                    }
                    if (TempMenuCategories.filter((x) => (x === dishes[i].Menu_category)).length == 0) {
                        TempMenuCategories.push(dishes[i].Menu_category)
                    }
                }
            }
            if (dishes[i].Veg_NonVeg == 'Veg') {
                TempVegDishes.push(dishes[i])
            }
            else {
                TempNonVegDishes.push(dishes[i])
            }
        }
        setVegDishes(TempVegDishes);
        setNonVegDishes(TempNonVegDishes);
        setMenuCategories(TempMenuCategories);
    }

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
        segregateDishes(dishes)
    }, [dispatch])



    return (
        <>
            <CartIcon />
            <Animated.ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollA } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingBottom: 150
                }}
                style={[colorScheme == 'light' ? { backgroundColor: '#F2F2F2' } : { backgroundColor: '#0c0c0f' }]}
            >
                <View className="relative" >
                    <Animated.Image source={{ uri: urlFor(image).url() }} style={Styles.RestaurantImage(scrollA)} />
                    <TouchableOpacity onPress={navigation.goBack} className="absolute top-14 left-5 p-2 rounded-full" style={[colorScheme == 'light' ? Styles.LightBackButton : Styles.DarkBackButton]}>
                        <ArrowLeftIcon size={20} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
                    </TouchableOpacity>
                </View>

                <View className='w-full flex-row justify-between pl-2 pr-4 py-1 items-center' style={[colorScheme=='light'? Styles.LightBGSec : Styles.DarkBGSec]}>
                    <VStack space={0.5}>
                        <HStack className='items-center'>
                            <Text className='text-2xl font-semibold' style={[colorScheme=='light'? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>{title} • </Text>
                            <Text className='italic text-xs pt-0.5 font-medium' style={[colorScheme=='light'? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>{genre}</Text>
                        </HStack>
                        <VStack space={1}>
                            <HStack space={2} alignContent={'center'}>
                                <ClockIcon opacity={1} color='#F04C0F' size={15} />
                                <Text className='text-xs' style={[colorScheme=='light'? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>{timing}</Text>
                            </HStack>
                            <HStack space={2} alignContent={'center'}>
                                <MapPinIcon opacity={1} color='#008FFF' size={15} />
                                <Text className='text-xs' style={[colorScheme=='light'? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>{location}</Text>
                            </HStack>
                            <HStack space={2} alignContent={'center'}>
                                <BoltIcon opacity={1} color='#FDD023' size={15} />
                                <Text className='text-xs' style={[colorScheme=='light'? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>{description}</Text>
                            </HStack>
                        </VStack>

                    </VStack>

                    {/* Phone Icon */}
                    <PhoneArrowUpRightIcon opacity={1} color='#f87c7c' size={25} />
                </View>

                {/* Menu */}
                <View className='justify-center place-items-center text-center'>
                    <Text className="p-4 font-semibold text-xl text-center" style={[colorScheme=='light'? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                        Menu
                    </Text>

                    {MenuCategories.map((category) => (
                        
                        <ListItem.Accordion
                            style={[colorScheme=='light'? Styles.LightBGSec : Styles.DarkBGSec]}
                            content={
                                <>
                                    <ListItem.Content >
                                        <ListItem.Title className='font-semibold' style={[colorScheme=='light'? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>{category}</ListItem.Title>
                                    </ListItem.Content>
                                </>
                            }
                            isExpanded={expanded}
                            onPress={() => {
                                setExpanded(!expanded);
                            }}
                            className='mt-2'
                        >
                            {dishes.map((dish) => {
                                if (dish.Menu_category == category) {
                                    return (
                                        <DishRow name={dish.name} Price={dish.Price} Veg_NonVeg={dish.Veg_NonVeg} />
                                    )
                                }
                            })}
                        </ListItem.Accordion>
                    ))}
                </View>
            </Animated.ScrollView>
        </>
    );
}

export default RestaurantScreen;

