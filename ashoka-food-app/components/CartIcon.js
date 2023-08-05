import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Text, useColorScheme, Image, useDisclose, ScrollView, Dimensions, SafeAreaView, Animated, Easing } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, selectCartItems, selectCartTotal, updateCartAdd, updateCartRemove, updateCartAddCustomized, updateCartRemoveCustomized } from "../reduxslices/cartslice";
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

export default function CartIcon({ actualUser, store }) {
    const items = useSelector(selectCartItems)
    const dispatch = useDispatch();
    const navigation = useNavigation()
    const colorScheme = useColorScheme()
    const windowHeight = Dimensions.get('window').height;
    const [showCartSheet, setShowCartSheet] = useState(false)

    const [Basket, setBasket] = useState();

    const { width, height } = Dimensions.get('screen');
    const ITEM_WIDTH = width;
    const ITEM_HEIGHT = height;

    const totalItemsInCart = items.reduce((total, item) => total + item.quantity, 0);

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
                        currentQuantity = item.quantity
                        additemQ = currentQuantity + 1
                        // dispatch(addToCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: additemQ }));
                        // dispatch(removeFromCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: currentQuantity }));
                        dispatch(updateCartAdd({ newQuantity: additemQ, dishName: item.name }))
                    }
                })
            }
        };
    }
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
    }

    const removeWithCustomizations = (quantity, customizations, name) => {
        dispatch(updateCartRemoveCustomized({ dishName: name, customizations }))
    };

    function objectsAreEqual(obj1, obj2) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (const key of keys1) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }

        return true;
    }

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
                items: [],
                image: []
            }
            TempBasket.push(UniqueRestaurantMiniCart)
        }

        TempBasket.map((RestaurantMiniCart, index) => {
            items.map((item, index) => {
                if (item['Restaurant'] == RestaurantMiniCart.name) {
                    RestaurantMiniCart.items.push(item)
                    // if (RestaurantMiniCart.items.length == 0) {
                    //     RestaurantMiniCart.items.push(item)
                    // }
                    // else {
                    //     for (j = 0; j < RestaurantMiniCart.items.length; j++) {
                    //         if (RestaurantMiniCart.items.filter((x) => (x.name === item.name)).length === 0) {
                    //             RestaurantMiniCart.items.push(item)
                    //         }
                    //     }
                    // }
                }
            })
        })

        setBasket(TempBasket)
    }, [items]);

    if (items.length === 0) return null

    return (
        <>
            <SafeAreaView className="absolute bottom-0 w-screen z-20 " style={[colorScheme == 'light' ? Styles.LightCartButton : Styles.DarkCartButton]}>
                <HStack className='justify-evenly items-center my-2' >

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
                            {totalItemsInCart == 1 &&
                                <Text className='text-md font-semibold text-black'
                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                >
                                    {totalItemsInCart} ITEM ADDED
                                </Text>
                            }
                            {totalItemsInCart > 1 &&
                                <Text className='text-md font-semibold text-black'
                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                >
                                    {totalItemsInCart} ITEMS ADDED
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

            {showCartSheet == true &&
                <View>

                    <Actionsheet hideDragIndicator={true} isOpen={showCartSheet} onClose={() => { setShowCartSheet(!showCartSheet) }}
                    >
                        <TouchableOpacity className='p-3 rounded-full m-3' style={[colorScheme == 'light' ? Styles.LightBG : Styles.DarkBG]}
                            onPress={() => setShowCartSheet(false)}
                        >
                            <XMarkIcon size={20} style={[colorScheme == 'light' ? { color: '#0c0c0f' } : { color: '#f2f2f2' }]} />
                        </TouchableOpacity>

                        <Actionsheet.Content bgColor={colorScheme == 'light' ? "#f2f2f2" : "#0c0c0f"} >
                            <View className='w-full' style={[colorScheme == 'light' ? Styles.LightBG : Styles.DarkBG]}>
                                <Text className='self-center py-2 pl-2 text-lg font-medium'
                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                    So far you've added...
                                </Text>
                            </View>
                            {
                                <ScrollView className='w-full self-center' showsVerticalScrollIndicator={false}>
                                    {Basket.map((BasketRestaurant, index) => (
                                        <>
                                            <View className='mt-7 border-t' style={[colorScheme == 'light' ? Styles.LightHomeAdlibBorder : Styles.DarkHomeAdlibBorder]}  >
                                                {BasketRestaurant.name === 'The Hunger Cycle' &&
                                                    <Text
                                                        allowFontScaling={false}
                                                        className="text-center font-normal text-md mx-28 mt-3 -top-5 "
                                                        style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                                                    >
                                                        {BasketRestaurant.name}
                                                    </Text>
                                                }
                                                {BasketRestaurant.name === 'Roti Boti' &&
                                                    <Text
                                                        allowFontScaling={false}
                                                        className="text-center font-normal text-md mx-36 mt-3 -top-5 "
                                                        style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                                                    >
                                                        {BasketRestaurant.name}
                                                    </Text>
                                                }
                                                {BasketRestaurant.name === 'Dhaba' &&
                                                    <Text
                                                        allowFontScaling={false}
                                                        className="text-center font-normal text-md mx-36 mt-3 -top-5 "
                                                        style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                                                    >
                                                        {BasketRestaurant.name}
                                                    </Text>
                                                }
                                                {BasketRestaurant.name === 'Chicago Pizza' &&
                                                    <Text
                                                        allowFontScaling={false}
                                                        className="text-center font-normal text-md mx-32 mt-3 -top-5 "
                                                        style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                                                    >
                                                        {BasketRestaurant.name}
                                                    </Text>
                                                }
                                                {BasketRestaurant.name === 'Subway' &&
                                                    <Text
                                                        allowFontScaling={false}
                                                        className="text-center font-normal text-md mx-36 mt-3 -top-5 "
                                                        style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                                                    >
                                                        {BasketRestaurant.name}
                                                    </Text>
                                                }
                                                {BasketRestaurant.name === 'Rasananda' &&
                                                    <Text
                                                        allowFontScaling={false}
                                                        className="text-center font-normal text-md mx-32 mt-3 -top-5 "
                                                        style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                                                    >
                                                        {BasketRestaurant.name}
                                                    </Text>
                                                }
                                                {BasketRestaurant.name === 'Chaat Stall' &&
                                                    <Text
                                                        allowFontScaling={false}
                                                        className="text-center font-normal text-md mx-32 mt-3 -top-5 "
                                                        style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                                                    >
                                                        {BasketRestaurant.name}
                                                    </Text>
                                                }
                                            </View>

                                            <VStack className=''>
                                                {
                                                    BasketRestaurant.items.map((dish, index) => (
                                                        <View>
                                                            {/* <DishRow name={dish.name} Price={dish.Price} Veg_NonVeg={dish.Veg_NonVeg} delivery={delivery} key={dish._id} id={dish._id} Restaurant={dish.Restaurant} Customizations={dish.Customizations} /> */}
                                                            {/* <DishRow name={dish.name} Price={dish.Price} Veg_NonVeg={dish.Veg_NonVeg} delivery='Yes' key={dish.id} id={dish.id} Restaurant={dish.Restaurant} Customizations={dish.customizations} /> */}

                                                            {dish.hasOwnProperty('customizations') ?
                                                                <>
                                                                    <HStack className='items-center justify-between px-2 w-full pt-2 pb-2 my-1 rounded-lg self-center' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                                                                        {/* Dish Details Block */}
                                                                        <VStack className='justify-start w-7/12' style={{}}>
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

                                                                            <Text className='text-base font-medium py-1.5'
                                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                            >
                                                                                {dish.name}
                                                                            </Text>

                                                                            <Text className='pb-1 font-medium text-xs'
                                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                            >
                                                                                ₹{(dish.Price).toFixed(2)}
                                                                            </Text>

                                                                            <VStack className='py-1'>
                                                                                {dish.customizations && Object.keys(dish.customizations).map(key => (
                                                                                    <VStack>
                                                                                        {dish.customizations[key].length > 0 &&
                                                                                            <>
                                                                                                <Text className='text-xs font-medium pt-0.5 text-gray-400'
                                                                                                // style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                                                >
                                                                                                    {key}
                                                                                                </Text>
                                                                                                <Text className='text-xs font-medium pb-0.5'
                                                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                                                >
                                                                                                    {dish.customizations[key].replace(dish.name, '').trim()}
                                                                                                </Text>
                                                                                            </>
                                                                                        }

                                                                                    </VStack>
                                                                                ))}
                                                                            </VStack>


                                                                        </VStack>

                                                                        <>
                                                                            <VStack className='items-center'>
                                                                                <TouchableOpacity onPress={() => removeWithCustomizations(dish.quantity, dish.customizations, dish.name)} className=''>
                                                                                    <HStack className='p-2'
                                                                                        style={[colorScheme == 'light' ? Styles.LightAddButtonFinal : Styles.DarkAddButtonFinal]}
                                                                                    >
                                                                                        <Text className='text-md font-medium text-center self-center w-full' style={{ color: 'white' }}>
                                                                                            Remove x{dish.quantity}
                                                                                        </Text>
                                                                                    </HStack>
                                                                                </TouchableOpacity>
                                                                                <Text allowFontScaling={false} className='mt-1 text-xs font-normal'
                                                                                    style={[colorScheme == 'light' ? { color: 'rgb(156, 163, 175)' } : { color: 'rgb(107, 114, 128)' }]}
                                                                                >
                                                                                    Customizable
                                                                                </Text>
                                                                            </VStack>
                                                                        </>



                                                                    </HStack>
                                                                </>
                                                                :
                                                                <>
                                                                    <HStack className='items-center rounded-lg justify-between w-full pt-2 pb-2 my-1' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
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

                                                                            <Text className='text-base font-medium py-1'
                                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                            >
                                                                                {dish.name}
                                                                            </Text>

                                                                            <Text className='text-md'
                                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                            >
                                                                                ₹{(dish.Price).toFixed(2)}
                                                                            </Text>

                                                                        </VStack>

                                                                        {/* Add/Minus BUtton Block */}

                                                                        {
                                                                            <HStack className='self-center'
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
                                                            }


                                                        </View>
                                                    ))
                                                }
                                            </VStack>
                                        </>
                                    ))}
                                </ScrollView>
                            }

                            <SafeAreaView className='w-screen' >

                                <HStack className='pt-3 w-10/12 self-center px-2 justify-between' >

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
                                            {totalItemsInCart == 1 &&
                                                <Text className='text-md font-semibold text-black'
                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                >
                                                    {totalItemsInCart} ITEM ADDED
                                                </Text>
                                            }
                                            {totalItemsInCart > 1 &&
                                                <Text className='text-md font-semibold text-black'
                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                >
                                                    {totalItemsInCart} ITEMS ADDED
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
                                        onPress={() => {
                                            setShowCartSheet(false)
                                            navigation.navigate('Cart', { actualUser, Basket })
                                        }
                                        }
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


                        </Actionsheet.Content>


                        {/* <SafeAreaView className=" bottom-0 w-screen z-20 " style={[colorScheme == 'light' ? Styles.LightCartButton : Styles.DarkCartButton]}> */}
                        {/* </SafeAreaView> */}
                    </Actionsheet>
                </View>
            }

        </>
    )
}