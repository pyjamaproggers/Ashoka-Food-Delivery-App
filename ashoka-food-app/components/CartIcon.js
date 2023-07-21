import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Text, useColorScheme, Image, useDisclose, ScrollView, Dimensions, SafeAreaView, Animated, Easing } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, selectCartItems, selectCartTotal } from "../reduxslices/cartslice";
import Styles from './Styles';
import { HStack, PresenceTransition } from 'native-base';
import Chevronup from '../assets/chevronupicon.png';
import Chevrondown from '../assets/chevrondownicon.png';
import Cart from '../assets/carticon.png';
import React, { useMemo, useState, useLayoutEffect } from "react";
import { Actionsheet, useColorMode } from "native-base";
import DishRow from '../screens/DishRow';
import { color } from '@rneui/base';

export default function CartIcon() {
    const items = useSelector(selectCartItems)
    const cartTotal = useSelector(selectCartTotal)
    const navigation = useNavigation()
    const colorScheme = useColorScheme()
    const colorMode = useColorMode();
    const windowHeight = Dimensions.get('window').height;
    const CartButtonHeight1 = Math.ceil(windowHeight * 0.01)
    const CartButtonHeight2 = Math.ceil(windowHeight * 0.2)
    const [showCartSheet, setShowCartSheet] = useState(false)
    const [groupedItemsInBasket, setGroupedItemsInBasker] = useState([]);
    const dispatch = useDispatch();

    useMemo(() => {
        const groupedItems = items.reduce((results, item) => {
            (results[items.id] = results[items.id] || []).push(item);
            return results;
        }, {});
        setGroupedItemsInBasker(groupedItems);
    }, [items]);

    if (items.length === 0) return null


    return (
        <>
            {showCartSheet == false &&
                <SafeAreaView className="absolute bottom-0 w-screen z-20"
                    style={[colorScheme == 'light' ? Styles.LightCartButton : Styles.DarkCartButton]}
                >
                    <PresenceTransition visible={!showCartSheet} initial={{
                        translateY: 100
                    }} animate={{
                        translateY: 0,
                        transition: {
                            duration: 200
                        }
                    }}>
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
                                onPress={() => navigation.navigate('Cart')}
                                className="bg-[#3E5896] py-2.5 flex-row items-center space-x-1"
                                style={Styles.NextButton}
                            >
                                <HStack className='items-center space-x-2'>
                                    <Text className='text-xl font-semibold text-white' >
                                        Next
                                    </Text>
                                    <Image
                                        style={{ width: 12, height: 12, resizeMode: "contain", transform: 'rotate(90deg)' }}
                                        source={Chevronup}
                                    />
                                </HStack>
                            </TouchableOpacity>

                        </HStack >
                    </PresenceTransition>

                </SafeAreaView >
            }
            {showCartSheet == true &&
                <View>
                    <Actionsheet isOpen={showCartSheet} onClose={() => { setShowCartSheet(!showCartSheet) }} size='full'
                    >
                        <Actionsheet.Content bgColor={colorMode == 'light' ? "white" : "#262626"} >
                            <View className='border-b border-gray-200 w-full' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                                <Text className=' py-2 pl-2 text-lg font-medium'
                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                    Items Added
                                </Text>
                            </View>

                            <ScrollView className="w-full" style={{ minHeight: 200 }}>
                                {Object.entries(groupedItemsInBasket).map(([key, items]) => (
                                    items.map((item, index) => (
                                        <>
                                            <Text style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>{item.name}</Text>
                                            <Text className="text-gray-400" style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>₹{item.Price}</Text>
                                            <TouchableOpacity>
                                                <Text
                                                    className="text-[#3E5896] text-xs"
                                                    onPress={() => dispatch(removeFromCart({ id: item.id }))}

                                                >
                                                    Remove
                                                </Text>
                                            </TouchableOpacity>
                                        </>
                                    ))
                                ))}

                            </ScrollView>

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
                                        onPress={() => navigation.navigate('Cart')}
                                        className="bg-[#3E5896] py-2.5 flex-row items-center space-x-1"
                                        style={Styles.NextButton}
                                    >
                                        <HStack className='items-center space-x-2'>
                                            <Text className='text-xl font-semibold text-white' >
                                                Next
                                            </Text>
                                            <Image
                                                style={{ width: 12, height: 12, resizeMode: "contain", transform: 'rotate(90deg)' }}
                                                source={Chevronup}
                                            />
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