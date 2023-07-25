import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Text, useColorScheme, Image, useDisclose, ScrollView, Dimensions, SafeAreaView, Animated, Easing } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, selectCartItems, selectCartTotal, updateCartAdd, updateCartRemove } from "../reduxslices/cartslice";
import Styles from './Styles';
import { Center, HStack, PresenceTransition, VStack } from 'native-base';
import Chevronup from '../assets/chevronupicon.png';
import Chevrondown from '../assets/chevrondownicon.png';
import Cart from '../assets/carticon.png';
import React, { useMemo, useState, useLayoutEffect } from "react";
import { Actionsheet, useColorMode } from "native-base";
import DishRow from '../screens/DishRow';
import VegIcon from '../assets/vegicon.png';
import NonVegIcon from '../assets/nonvegicon.png';
import { XMarkIcon, PlusSmallIcon, PlusIcon, MinusIcon } from 'react-native-heroicons/solid';

export default function CartIcon({ actualUser }) {
    const items = useSelector(selectCartItems)
    const cartTotal = useSelector(selectCartTotal)
    const navigation = useNavigation()
    const colorScheme = useColorScheme()
    const windowHeight = Dimensions.get('window').height;
    const [showCartSheet, setShowCartSheet] = useState(false)
    const dispatch = useDispatch();

    console.log(items)
    const [Basket, setBasket] = useState();

    const addItem = (id, name, Price, image, Restaurant, Veg_NonVeg) => {
        Price = parseFloat(Price)
        console.log('****')
        var currentQuantity
        var additemQ

        if (items.length == 0) {
            currentQuantity = 0
            additemQ = currentQuantity + 1
            dispatch(addToCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: additemQ }));
        }
        else {
            if (items.filter((x) => (x.name == name)).length == 0) {
                currentQuantity = 0
                additemQ = currentQuantity + 1
                dispatch(addToCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: additemQ }));
            }
            else {
                items.map((item) => {
                    if (item.name == name) {
                        console.log('coming here')
                        currentQuantity = item.quantity
                        additemQ = currentQuantity + 1
                        // dispatch(addToCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: additemQ }));
                        // dispatch(removeFromCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: currentQuantity }));
                        dispatch(updateCartAdd({ newQuantity: additemQ, dishName: item.name }))
                    }
                })
            }
        };
    };

    const removeItem = (id, name, Price, image, Restaurant, Veg_NonVeg) => {
        Price = parseFloat(Price)
        console.log('****')
        var currentQuantity
        var additemQ
        items.map((item) => {
            if (item.name == name && item.quantity == 1) {
                currentQuantity = 1
                dispatch(removeFromCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: currentQuantity }));
            }
            if (item.name == name && item.quantity >= 1) {
                currentQuantity = item.quantity
                additemQ = currentQuantity - 1
                // dispatch(addToCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: additemQ }));
                // dispatch(removeFromCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: currentQuantity }));
                dispatch(updateCartRemove({ newQuantity: additemQ, dishName: item.name }))
            }
        })
    };

    useMemo(() => {
        var UniqueRestaurantsInCart = []

        for (i = 0; i < items.length; i++) {
            if (UniqueRestaurantsInCart.length == 0) {
                UniqueRestaurantsInCart.push(items[i]["Restaurant"])
            }
            else {
                for (j = 0; j < UniqueRestaurantsInCart.length; j++) {
                    if (UniqueRestaurantsInCart.filter((x) => (x === items[i]["Restaurant"])).length == 0) {
                        UniqueRestaurantsInCart.push(items[i]["Restaurant"])
                    }
                }
            }
        }

        var TempBasket = []
        for (i = 0; i < UniqueRestaurantsInCart.length; i++) {
            let UniqueRestaurantMiniCart = {
                name: UniqueRestaurantsInCart[i],
                items: []
            }
            TempBasket.push(UniqueRestaurantMiniCart)
        }

        TempBasket.map((RestaurantMiniCart, index) => {
            items.map((item, index) => {
                if (item['Restaurant'] == RestaurantMiniCart.name) {
                    if (RestaurantMiniCart.items.length == 0) {
                        RestaurantMiniCart.items.push(item)
                    }
                    else {
                        for (j = 0; j < RestaurantMiniCart.items.length; j++) {
                            if (RestaurantMiniCart.items.filter((x) => (x.name === item.name)).length === 0) {
                                RestaurantMiniCart.items.push(item)
                            }
                        }
                    }
                }
            })
        })
        console.log(TempBasket)
        setBasket(TempBasket)
    }, [items]);
    if (items.length === 0) return null

    return (
        <>
            {showCartSheet == false &&
                <SafeAreaView className="absolute bottom-0 w-screen z-20 " style={[colorScheme == 'light' ? Styles.LightCartButton : Styles.DarkCartButton]}>
                    <PresenceTransition visible={!showCartSheet} initial={{
                        opacity: 0
                    }} animate={{
                        opacity: 1,
                        transition: {
                            duration: 200,
                            delay: 25
                        }
                    }}>
                        <SafeAreaView  >
                            <HStack className='justify-evenly mt-2' >

                                <TouchableOpacity
                                    onPress={() => setShowCartSheet(!showCartSheet)}
                                    className="py-2.5 flex-row items-center space-x-1"
                                    style={Styles.ShowCartButton}
                                >
                                    <HStack className='items-center space-x-2'>
                                        <Image
                                            style={{ width: 20, height: 20, resizeMode: "contain", }}
                                            source={Cart}
                                        />
                                        {items.length == 1 &&
                                            <Text className='text-md font-semibold text-black'
                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                            >
                                                {items.length} ITEM ADDED
                                            </Text>
                                        }
                                        {items.length > 1 &&
                                            <Text className='text-md font-semibold text-black'
                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                            >
                                                {items.length} ITEMS ADDED
                                            </Text>
                                        }
                                        {showCartSheet &&
                                            <Image
                                                style={{ width: 12, height: 12, resizeMode: "contain", }}
                                                source={Chevrondown}
                                            />
                                        }
                                        {!showCartSheet &&
                                            <Image
                                                style={{ width: 12, height: 12, resizeMode: "contain", }}
                                                source={Chevronup}
                                            />
                                        }
                                    </HStack>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Cart', { actualUser, Basket })}
                                    className="bg-[#3E5896] py-2.5 flex-row items-center space-x-1"
                                    style={Styles.NextButton}
                                >
                                    <HStack className='items-center space-x-2'>
                                        <Text className='text-xl font-semibold text-white' >
                                            Next
                                        </Text>
                                        <View style={{ transform: [{ rotate: '90deg' }] }}>
                                            <Image
                                                style={{ width: 12, height: 12, resizeMode: "contain" }}
                                                source={Chevronup}
                                            />

                                        </View>
                                    </HStack>
                                </TouchableOpacity>

                            </HStack >
                        </SafeAreaView>
                    </PresenceTransition>

                </SafeAreaView >
            }
            {showCartSheet == true &&
                <View>
                    <Actionsheet isOpen={showCartSheet} onClose={() => { setShowCartSheet(!showCartSheet) }} size='full'
                    >
                        <Actionsheet.Content bgColor={colorScheme == 'light' ? "white" : "#262626"} >
                            <View className='w-full' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                                <Text className='self-center py-2 pl-2 text-lg font-medium'
                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                    So far you've added...
                                </Text>
                            </View>
                            {
                                <ScrollView className='w-screen' showsVerticalScrollIndicator={false}>
                                    {Basket.map((BasketRestaurant, index) => (
                                        <>
                                            <View className='mt-7 border-t' style={[colorScheme == 'light' ? Styles.LightHomeAdlibCartBorder : Styles.DarkHomeAdlibCartBorder]}  >
                                                {BasketRestaurant.name === 'The Hunger Cycle' &&
                                                    <Text
                                                        allowFontScaling={false}
                                                        className="text-center font-normal text-md mx-28 mt-3 -top-5 -mb-5"
                                                        style={[colorScheme == 'light' ? Styles.LightHomeAdlibCart : Styles.DarkHomeAdlibCart]}
                                                    >
                                                        {BasketRestaurant.name}
                                                    </Text>
                                                }
                                                {BasketRestaurant.name === 'Roti Boti' &&
                                                    <Text
                                                        allowFontScaling={false}
                                                        className="text-center font-normal text-md mx-36 mt-3 -top-5 -mb-5"
                                                        style={[colorScheme == 'light' ? Styles.LightHomeAdlibCart : Styles.DarkHomeAdlibCart]}
                                                    >
                                                        {BasketRestaurant.name}
                                                    </Text>
                                                }
                                                {BasketRestaurant.name === 'Dhaba' &&
                                                    <Text
                                                        allowFontScaling={false}
                                                        className="text-center font-normal text-md mx-36 mt-3 -top-5 -mb-5"
                                                        style={[colorScheme == 'light' ? Styles.LightHomeAdlibCart : Styles.DarkHomeAdlibCart]}
                                                    >
                                                        {BasketRestaurant.name}
                                                    </Text>
                                                }
                                                {BasketRestaurant.name === 'Chicago Pizza' &&
                                                    <Text
                                                        allowFontScaling={false}
                                                        className="text-center font-normal text-md mx-32 mt-3 -top-5 -mb-5"
                                                        style={[colorScheme == 'light' ? Styles.LightHomeAdlibCart : Styles.DarkHomeAdlibCart]}
                                                    >
                                                        {BasketRestaurant.name}
                                                    </Text>
                                                }
                                                {BasketRestaurant.name === 'Subway' &&
                                                    <Text
                                                        allowFontScaling={false}
                                                        className="text-center font-normal text-md mx-36 mt-3 -top-5 -mb-5"
                                                        style={[colorScheme == 'light' ? Styles.LightHomeAdlibCart : Styles.DarkHomeAdlibCart]}
                                                    >
                                                        {BasketRestaurant.name}
                                                    </Text>
                                                }
                                                {BasketRestaurant.name === 'Rasananda' &&
                                                    <Text
                                                        allowFontScaling={false}
                                                        className="text-center font-normal text-md mx-32 mt-3 -top-5 -mb-5"
                                                        style={[colorScheme == 'light' ? Styles.LightHomeAdlibCart : Styles.DarkHomeAdlibCart]}
                                                    >
                                                        {BasketRestaurant.name}
                                                    </Text>
                                                }
                                                {BasketRestaurant.name === 'Chaat Stall' &&
                                                    <Text
                                                        allowFontScaling={false}
                                                        className="text-center font-normal text-md mx-32 mt-3 -top-5 -mb-5"
                                                        style={[colorScheme == 'light' ? Styles.LightHomeAdlibCart : Styles.DarkHomeAdlibCart]}
                                                    >
                                                        {BasketRestaurant.name}
                                                    </Text>
                                                }
                                            </View>
                                            {
                                                BasketRestaurant.items.map((dish, index) => (
                                                    <>
                                                        {/* <DishRow name={dish.name} Price={dish.Price} Veg_NonVeg={dish.Veg_NonVeg} key={dish._id} id={dish._id} Restaurant={dish.Restaurant} /> */}
                                                        <HStack className='items-center justify-between w-screen pt-2 pb-2' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                                                            {/* Dish Details Block */}
                                                            <VStack style={{ marginLeft: '2%' }}>
                                                                {dish.Veg_NonVeg === "Veg" ? (
                                                                    <Image
                                                                        style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                        source={VegIcon}
                                                                    />
                                                                ) : (
                                                                    <Image
                                                                        style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                        source={NonVegIcon}
                                                                    />
                                                                )}

                                                                <Text className='text-lg font-medium py-1.5'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                >
                                                                    {dish.name}
                                                                </Text>

                                                                <Text
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                >
                                                                    ₹{dish.Price}
                                                                </Text>

                                                            </VStack>

                                                            {/* Add/Minus BUtton Block */}

                                                            {
                                                                <HStack
                                                                    style={[colorScheme == 'light' ? Styles.LightAddButtonFinal : Styles.DarkAddButtonFinal]}
                                                                >
                                                                    <TouchableOpacity onPress={() => { removeItem(dish.id, dish.name, dish.Price, dish.image, dish.Restaurant, dish.Veg_NonVeg) }} className='p-3 px-2'>
                                                                        <MinusIcon size={16} color='white' />
                                                                    </TouchableOpacity>

                                                                    <Text className='text-xl font-medium' style={{ color: 'white' }}>
                                                                        {dish.quantity}
                                                                    </Text>

                                                                    <TouchableOpacity onPress={() => { addItem(dish.id, dish.name, dish.Price, dish.image, dish.Restaurant, dish.Veg_NonVeg) }} className='p-3 px-2'>
                                                                        <PlusIcon size={16} color='white' />
                                                                    </TouchableOpacity>
                                                                </HStack>
                                                            }

                                                        </HStack>
                                                    </>
                                                ))
                                            }
                                        </>
                                    ))}
                                </ScrollView>
                            }

                            <View className="bottom-0 w-screen"
                            >
                                <HStack className='justify-evenly mt-2'>

                                    <TouchableOpacity
                                        onPress={() => setShowCartSheet(!showCartSheet)}
                                        className="py-2.5 flex-row items-center space-x-1"
                                        style={Styles.ShowCartButton}
                                    >
                                        <HStack className='items-center space-x-2'>
                                            <Image
                                                style={{ width: 20, height: 20, resizeMode: "contain", }}
                                                source={Cart}
                                            />
                                            {items.length == 1 &&
                                                <Text className='text-md font-semibold text-black'
                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                >
                                                    {items.length} ITEM ADDED
                                                </Text>
                                            }
                                            {items.length > 1 &&
                                                <Text className='text-md font-semibold text-black'
                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                >
                                                    {items.length} ITEMS ADDED
                                                </Text>
                                            }
                                            {showCartSheet &&
                                                <Image
                                                    style={{ width: 12, height: 12, resizeMode: "contain", }}
                                                    source={Chevrondown}
                                                />
                                            }
                                            {!showCartSheet &&
                                                <Image
                                                    style={{ width: 12, height: 12, resizeMode: "contain", }}
                                                    source={Chevronup}
                                                />
                                            }
                                        </HStack>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => { navigation.navigate('Cart', { actualUser, Basket }); setShowCartSheet(false) }}
                                        className="bg-[#3E5896] py-2.5 flex-row items-center space-x-1"
                                        style={Styles.NextButton}
                                    >
                                        <HStack className='items-center space-x-2'>
                                            <Text className='text-xl font-semibold text-white' >
                                                Next
                                            </Text>
                                            <View style={{ transform: [{ rotate: '90deg' }] }}>
                                                <Image
                                                    style={{ width: 12, height: 12, resizeMode: "contain", }}
                                                    source={Chevronup}
                                                />
                                            </View>
                                        </HStack>
                                    </TouchableOpacity>

                                </HStack >

                            </View >

                        </Actionsheet.Content>
                    </Actionsheet>
                </View>
            }

        </>
    )
}