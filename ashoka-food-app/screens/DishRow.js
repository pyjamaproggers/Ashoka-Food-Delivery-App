import { View, Text, TouchableOpacity, Image, useColorScheme } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { urlFor } from "../sanity";
import { MinusCircleIcon, PlusCircleIcon, PlusSmallIcon, PlusIcon, MinusIcon } from "react-native-heroicons/solid";
import { addToCart, removeFromCart, selectCartItems } from "../reduxslices/cartslice";
import { useDispatch, useSelector } from "react-redux";
import VegIcon from '../assets/vegicon.png';
import NonVegIcon from '../assets/nonvegicon.png';
import Styles from "../components/Styles";
import { HStack, VStack } from "native-base";
import { IP } from '@dotenv'

const DishRow = ({ id, name, Veg_NonVeg, Price, image, delivery, Restaurant }) => {
    const colorScheme = useColorScheme();
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const [itemQuantity, setItemQuantity] = useState(0)
    const [FetchedUnavailableItems, setFetchedUnavailableItems] = useState([])

    const addItem = () => {
        Price = parseFloat(Price)
        console.log('****')
        var currentQuantity
        var additemQ

        if (items.length == 0) {
            currentQuantity = 0
            additemQ = currentQuantity + 1
            setItemQuantity(currentQuantity + 1)
            dispatch(addToCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: additemQ }));
        }
        else {
            if (items.filter((x) => (x.name == name)).length == 0) {
                currentQuantity = 0
                additemQ = currentQuantity + 1
                setItemQuantity(currentQuantity + 1)
                dispatch(addToCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: additemQ }));
            }
            else {
                items.map((item) => {
                    if (item.name == name) {
                        currentQuantity = item.quantity
                        additemQ = currentQuantity + 1
                        setItemQuantity(currentQuantity + 1)
                        dispatch(addToCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: additemQ }));
                        dispatch(removeFromCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: currentQuantity }));
                    }
                })
            }
        };
    }

    const removeItem = () => {
        Price = parseFloat(Price)
        var currentQuantity
        var additemQ
        items.map((item) => {
            if (item.name == name && item.quantity == 1) {
                currentQuantity = 1
                setItemQuantity(currentQuantity - 1)
                dispatch(removeFromCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: currentQuantity }));
            }
            if (item.name == name && item.quantity >= 1) {
                currentQuantity = item.quantity
                additemQ = currentQuantity - 1
                setItemQuantity(currentQuantity - 1)
                dispatch(addToCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: additemQ }));
                dispatch(removeFromCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: currentQuantity }));
            }
        })
    };

    const fetchUnavailableItems = async () => {
        try {
            const response = await fetch(`http://${IP}:8800/api/items/${Restaurant}`);
            const data = await response.json();
            var TempFetchedUnavailableItems = []
            if (data) {
                data.map((item, index) => {
                    TempFetchedUnavailableItems.push(item.name)
                })
                setFetchedUnavailableItems(TempFetchedUnavailableItems)
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    useEffect(() => {
        if (items.length == 0) {
            setItemQuantity(0)
        }
        if (items.length != 0) {
            let dishNotFound = true
            items.map((item) => {
                if (item.name == name) {
                    dishNotFound = false
                    setItemQuantity(item.quantity)
                }
            });
            if (dishNotFound) {
                setItemQuantity(0)
            }
        }
        fetchUnavailableItems()
    }, [items])

    return (
        <>
            <HStack className='items-center justify-between w-full py-4' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                {/* Dish Details Block */}
                <VStack className='justify-start' style={{ marginLeft: '2%' }}>
                    {Veg_NonVeg === "Veg" ? (
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
                        {name}
                    </Text>

                    <Text
                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                    >
                        ₹{Price}
                    </Text>

                </VStack>

                {FetchedUnavailableItems.includes(name) ? 
                    <VStack className='w-max pr-8 items-center'>
                        <Text className='font-medium'
                            style={[colorScheme == 'light' ? Styles.LightTextSecondary : Styles.DarkTextSecondary]}
                        >
                            Currently
                        </Text>
                        <Text className='font-medium'
                            style={[colorScheme == 'light' ? Styles.LightTextSecondary : Styles.DarkTextSecondary]}
                        >  
                           Unavailable 
                        </Text>
                    </VStack>
                :
                    <>
                        {/* Add/Minus BUtton Block */}
                        {(itemQuantity == 0 || itemQuantity == null) && delivery == 'Yes' &&
                            <TouchableOpacity onPress={addItem}>
                                <HStack
                                    style={[colorScheme == 'light' ? Styles.LightAddButtonInitial : Styles.DarkAddButtonInitial]}
                                >
                                    <Text className='text-xl font-medium ' style={{ color: '#3E5896', marginLeft: 4 }}>
                                        ADD
                                    </Text>
                                    <PlusSmallIcon size={16} color='#3E5896' />
                                </HStack>
                            </TouchableOpacity>
                        }
                        {itemQuantity > 0 && delivery == 'Yes' &&
                            <HStack
                                style={[colorScheme == 'light' ? Styles.LightAddButtonFinal : Styles.DarkAddButtonFinal]}
                            >
                                <TouchableOpacity onPress={removeItem} className='p-3 px-2'>
                                    <MinusIcon size={16} color='white' />
                                </TouchableOpacity>

                                <Text className='text-xl font-medium' style={{ color: 'white' }}>
                                    {itemQuantity}
                                </Text>

                                <TouchableOpacity onPress={addItem} className='p-3 px-2'>
                                    <PlusIcon size={16} color='white' />
                                </TouchableOpacity>
                            </HStack>
                        }
                    </>
                }


            </HStack>
        </>
    );
};

export default DishRow;
