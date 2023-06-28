import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Text, useColorScheme, Image, useDisclose, ScrollView } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, selectCartItems, selectCartTotal } from "../reduxslices/cartslice";
import Styles from './Styles';
import { HStack } from 'native-base';
import Chevronup from '../assets/chevronupicon.png';
import Chevrondown from '../assets/chevrondownicon.png';
import Cart from '../assets/carticon.png';
import React, { useMemo, useState, useLayoutEffect } from "react";
import { Actionsheet } from "native-base";
import DishRow from '../screens/DishRow';

export default function CartIcon() {
    const items = useSelector(selectCartItems)
    const cartTotal = useSelector(selectCartTotal)
    const navigation = useNavigation()
    const colorScheme = useColorScheme()
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
                <View className="absolute bottom-0 w-screen z-20"
                    style={[colorScheme == 'light' ? Styles.LightCartButton : Styles.DarkCartButton]}
                >
                    <HStack className='justify-evenly mt-2' style={{ paddingBottom: '10%' }}>

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
                                    <Text className='text-md font-semibold text-black'>
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
            }
            {showCartSheet == true &&
                <View>
                    <Actionsheet isOpen={showCartSheet} onClose={() => { setShowCartSheet(!showCartSheet) }} size="full" 
                    style={{
                    }}>
                        <Actionsheet.Content>
                            <View className='border-b border-gray-200 w-full'>
                                <Text className=' py-2 pl-2 text-lg font-medium'>
                                    Items Added
                                </Text>
                            </View>
                            <ScrollView className="h-full">
                            {Object.entries(groupedItemsInBasket).map(([key, items]) => (
                                items.map((item, index) => (
                                    <Actionsheet.Item key={`${key}-${index}`}>
                                        <Text>{item.name}</Text>
                                        <Text className="text-gray-400">₹{item.Price}</Text>
                                        <TouchableOpacity>
                                        <Text
                                            className="text-[#3E5896] text-xs"
                                            onPress={() => dispatch(removeFromCart({ id: item.id }))}
                                        >
                                            Remove
                                        </Text>
                                        </TouchableOpacity>
                                </Actionsheet.Item>
                                ))
                            ))}
                            </ScrollView>
                            <View className="absolute bottom-0 w-screen "
                                style={[colorScheme == 'light' ? Styles.LightCartButton : Styles.DarkCartButton]}
                            >
                                <HStack className='justify-evenly mt-2' style={{ paddingBottom: '10%' }}>

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
                                            {items.length == 1 && showCartSheet == true &&
                                                <Text className='text-md font-semibold text-black'
                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                >
                                                    {items.length} ITEM ADDED
                                                </Text>
                                            }
                                            {items.length > 1 && showCartSheet == true &&
                                                <Text className='text-md font-semibold text-black'>
                                                    {items.length} ITEMS ADDED
                                                </Text>
                                            }
                                            {showCartSheet && showCartSheet == true &&
                                                <Image
                                                    style={{ width: 12, height: 12, resizeMode: "contain", }}
                                                    source={Chevrondown}
                                                />
                                            }
                                            {!showCartSheet && showCartSheet == true &&
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