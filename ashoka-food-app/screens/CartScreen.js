import { View, Text, TouchableOpacity, ScrollView, colorScheme, useColorScheme, TextInput } from "react-native";
import React, { useMemo, useState, useLayoutEffect, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { selectRestaurant } from "../reduxslices/restaurantSlice";
import { addToCart, removeFromCart, selectCartItems, selectCartTotal, updateCartAdd, updateCartRemove } from "../reduxslices/cartslice";
import { ArrowLeftIcon, ChevronRightIcon } from 'react-native-heroicons/solid';
import { XCircleIcon } from "react-native-heroicons/solid";
import { SafeAreaView, StyleSheet, StatusBar, Image } from "react-native";
import { urlFor } from "../sanity";
import AshokaLogo from '../assets/ASHOKAWHITELOGO.png';
import Styles from '../components/Styles.js'
import { HStack, TextArea, VStack } from "native-base";
import VegIcon from '../assets/vegicon.png';
import client from '../sanity';
import NonVegIcon from '../assets/nonvegicon.png';
import PenIcon from '../assets/pen.png';
import { XMarkIcon, PlusSmallIcon, PlusIcon, MinusIcon } from 'react-native-heroicons/solid';

const BasketScreen = () => {
    const colorScheme = useColorScheme()
    const { params: { actualUser, Basket } } = useRoute();
    // console.log(Basket)
    const restaurant = useSelector(selectRestaurant);
    const navigation = useNavigation();
    const items = useSelector(selectCartItems);
    const [groupedItemsInBasket, setGroupedItemsInBasket] = useState([]);
    const dispatch = useDispatch();
    const [FinalBasket, setFinalBasket] = useState()
    const [FinalBasketReady, setFinalBasketReady] = useState(false)

    const query = `*[_type == "restaurant"]
        { name, image }`;

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

    const updateInstructions = (instruction, restaurant) => {
        var TempFinalBasket = FinalBasket
        TempFinalBasket.map((Outlet, index) => {
            if (Outlet.name == restaurant) {
                Outlet.instructions = instruction
            }
        })
        setFinalBasket(TempFinalBasket)
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
                instructions: '',
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

        client
            .fetch(query)
            .then((data) => {
                var TempFinalBasket = []
                TempFinalBasket = TempBasket
                data.map((restaurant, index) => {
                    TempFinalBasket.map((basketRestaurant, index) => {
                        if (restaurant.name == basketRestaurant.name) {
                            basketRestaurant['image'] = restaurant.image
                        }
                    })
                })
                setFinalBasket(TempFinalBasket)
                setFinalBasketReady(true)
            })
            .catch((error) => {
                console.log('Error:', error); // Log any errors that occur
            });

    }, [items]);



    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const sendOrderToDatabase = async (groupedItems, restaurantName) => {
        const url = ""; // Node Server

        const orderData = {
            phone: actualUser.phone,
            email: actualUser.email,
            name: actualUser.name,
            groupedItemsInBasket: groupedItems,
            restaurant: restaurantName,
            orderDate: new Date().toISOString(), // Adding the date and time of the order
        };
        console.log(orderData);

        // try {
        //   const response = await fetch(url, {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(orderData),
        //   });

        //   if (response.ok) {
        //     console.log("Order sent successfully!");
        //     // Perform any actions after a successful order submission if needed
        //   } else {
        //     console.error("Failed to send order!");
        //     // Handle error scenarios if needed
        //   }
        // } catch (error) {
        //   console.error("Error occurred while sending order:", error);
        //   // Handle error scenarios if needed
        // }
    };

    return (
        <SafeAreaView className="flex-1" style={[colorScheme == 'light' ? { backgroundColor: '#F2F2F2' } : { backgroundColor: '#0c0c0f' }]}>
            {FinalBasketReady &&
            <ScrollView>
                <View className="relative">
                    <HStack className='items-center pt-2'>
                        <TouchableOpacity onPress={navigation.goBack} className="p-2 rounded-full" style={[colorScheme == 'light' ? Styles.LightBackButton : Styles.DarkBackButton]}>
                            <ArrowLeftIcon size={20} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
                        </TouchableOpacity>
                    </HStack>
                </View>

                <VStack className='w-screen items-center'>
                    <Text className='text-center font-medium text-md py-4' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                        ORDER DETAILS
                    </Text>
                    <View className='w-11/12 pb-3 space-y-6 ' >
                        {FinalBasket.map((BasketRestaurant, index) => (
                            <View className='space-y-2'>
                                <View className='rounded-lg ' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                                    <VStack className='w-full items-center space-x-2 pt-2'>
                                        <Image source={{ uri: urlFor(BasketRestaurant.image).url() }} style={{ width: 40, height: 40, borderRadius: 5 }} />
                                        <Text allowFontScaling={false} className='text-lg font-medium'
                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                        >
                                            {BasketRestaurant.name}
                                        </Text>
                                    </VStack>
                                    <View className='mt-5 border-t' style={[colorScheme == 'light' ? Styles.LightHomeAdlibCartBorder : Styles.DarkHomeAdlibCartBorder]}  >
                                        <Text
                                            allowFontScaling={false}
                                            className="text-center text-sm mx-28 -top-3"
                                            style={[colorScheme == 'light' ? Styles.LightHomeAdlibCart : Styles.DarkHomeAdlibCart]}
                                        >
                                            Item(s) Added
                                        </Text>
                                    </View>
                                    {
                                        BasketRestaurant.items.map((dish, index) => (
                                            <>
                                                {/* <DishRow name={dish.name} Price={dish.Price} Veg_NonVeg={dish.Veg_NonVeg} key={dish._id} id={dish._id} Restaurant={dish.Restaurant} /> */}
                                                <HStack className='items-center justify-between pb-3 rounded-lg' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>

                                                    {/* Dish Details Block */}
                                                    <VStack style={{ marginLeft: '2%' }}>
                                                        <HStack className='items-center space-x-1'>
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
                                                            <Text className='text-md font-normal py-1.5' allowFontScaling={false}
                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                            >
                                                                {dish.name}
                                                            </Text>

                                                        </HStack>
                                                        {dish.quantity > 1 ?
                                                            <Text className='pl-4 text-md font-normal' allowFontScaling={false}
                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                            >
                                                                ₹{dish.Price * dish.quantity} (₹{dish.Price}x{dish.quantity})
                                                            </Text>
                                                            :
                                                            <Text className='pl-4 text-md font-normal' allowFontScaling={false}
                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                            >
                                                                ₹{dish.Price}
                                                            </Text>
                                                        }
                                                    </VStack>

                                                    {/* Add/Minus BUtton Block */}

                                                    {
                                                        <HStack
                                                            style={[colorScheme == 'light' ? Styles.LightAddButtonFinalOrder : Styles.DarkAddButtonFinalOrder]}
                                                        >
                                                            <TouchableOpacity onPress={() => { removeItem(dish.id, dish.name, dish.Price, dish.image, dish.Restaurant, dish.Veg_NonVeg) }} className='p-3 px-2'>
                                                                <MinusIcon size={16} color='white' />
                                                            </TouchableOpacity>

                                                            <Text allowFontScaling={false} className='text-base font-medium' style={{ color: 'white' }}>
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
                                </View>

                                <View className='w-full rounded-lg' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                                    <HStack className='p-3 space-x-2 items-center'>
                                        <Image
                                            style={{ width: 15, height: 15, resizeMode: "contain" }}
                                            source={PenIcon}
                                        />
                                        {colorScheme == 'light' &&
                                            <TextInput placeholder="Add instructions for this outlet (max 100)" keyboardType="default" className='w-10/12 text-xs'
                                                placeholderTextColor='#666666'
                                                style={{ color: '#000', paddingTop: 0 }}
                                                onChangeText={(text) => {
                                                    updateInstructions(text, BasketRestaurant.name)
                                                }}
                                                autoComplete='off'
                                                autoCorrect={false}
                                                multiline={true}
                                                maxLength={100}
                                                numberOfLines={4}
                                                allowFontScaling={false}
                                            />
                                        }
                                        {colorScheme != 'light' &&
                                            <TextInput placeholder="Add instructions for this outlet (max 100)" keyboardType="default" className='w-10/12 text-xs'
                                                placeholderTextColor='#8f8f8f'
                                                style={{ color: '#fff', paddingTop: 0 }}
                                                onChangeText={(text) => {
                                                    updateInstructions(text, BasketRestaurant.name)
                                                }}
                                                autoComplete='off'
                                                autoCorrect={false}
                                                multiline={true}
                                                maxLength={100}
                                                numberOfLines={4}
                                                allowFontScaling={false}
                                            />
                                        }
                                    </HStack>
                                </View>
                            </View>
                        ))}
                    </View>
                </VStack>

                <VStack className='w-screen items-center'>
                    <Text className='text-center font-medium text-md pt-4 pb-2' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                        CONTACT DETAILS
                    </Text>
                    <View style={colorScheme == 'light' ? styles.LightnameEmailPhotoContainer : styles.DarknameEmailPhotoContainer} className='shadow-sm'>

                        <View className='px-3'>
                            {actualUser.hasOwnProperty('picture') ? (
                                <Image style={styles.userPic} source={{ uri: actualUser.picture }} />
                            ) : (
                                <Image style={styles.userPic} source={userPic} />
                            )}
                        </View>
                        <View className='flex-col space-y-1 pl-0.5'>
                            <Text allowFontScaling={false} style={colorScheme == 'light' ? styles.LightnameText : styles.DarknameText}>{actualUser.given_name} {actualUser.family_name}</Text>

                            {/* user.phone */}
                            <View className='flex-row items-center space-x-1 '>
                                <Text allowFontScaling={false} style={colorScheme == 'light' ? styles.LightphoneText : styles.DarkphoneText}>{actualUser.phone}</Text>
                            </View>
                        </View>

                    </View>
                </VStack>

                <VStack className='w-screen items-center'>
                    <Text className='text-center font-medium text-md pt-6 pb-2' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                        BILL SUMMARY
                    </Text>
                </VStack>
            </ScrollView>
            }


        </SafeAreaView>
    );
};

export default BasketScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        //   borderColor: 'gray',
        //   borderWidth: 1,
    },
    userPic: {
        width: 50,
        height: 50,
        borderRadius: 100,
    },
    LightnameEmailPhotoContainer: {
        width: '91.666667%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 10,
        backgroundColor: 'white',
        borderTopLeftRadius: '10',
        borderTopRightRadius: '10',
        borderBottomRightRadius: '10',
        borderBottomLeftRadius: '10'
    },
    DarknameEmailPhotoContainer: {
        width: '91.666667%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 10,
        backgroundColor: '#262626',
        borderTopLeftRadius: '10',
        borderTopRightRadius: '10',
        borderBottomRightRadius: '10',
        borderBottomLeftRadius: '10'
    },
    LightnameText: {
        fontWeight: 500,
        fontSize: 16,
        paddingBottom: 2,
        color: 'black'
    },
    DarknameText: {
        fontWeight: 500,
        fontSize: 16,
        paddingBottom: 2,
        color: 'white'
    },
    LightemailText: {
        fontSize: 12,
        color: 'black'
    },
    DarkemailText: {
        fontSize: 12,
        color: 'white'
    },
    LightbackButton: {
        width: "10%",
        marginLeft: 20,
        backgroundColor: 'white'
    },
    DarkbackButton: {
        width: "10%",
        marginLeft: 20,
        backgroundColor: '#262626'
    },
    LightphoneText: {
        fontSize: 14,
        color: 'black'
    },
    DarkphoneText: {
        fontSize: 14,
        color: 'white'
    },
    LightuserDetailsContainer: {
        width: '95%',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    DarkuserDetailsContainer: {
        width: '95%',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginTop: 10,
        backgroundColor: '#262626',
        borderRadius: 10,
    },
    LightlogoutContainer: {
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        bottom: 0,
        position: 'absolute',
    },
    DarklogoutContainer: {
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#262626',
        borderRadius: 10,
        bottom: 0,
        position: 'absolute',
    }
});
