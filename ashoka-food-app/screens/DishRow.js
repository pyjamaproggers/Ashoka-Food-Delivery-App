import { View, Text, TouchableOpacity, Image, useColorScheme } from "react-native";
import React from "react";
import { urlFor } from "../sanity";
import { MinusCircleIcon, PlusCircleIcon, PlusSmallIcon, PlusIcon, MinusIcon } from "react-native-heroicons/solid";
import { addToCart, removeFromCart, selectCartItems } from "../reduxslices/cartslice";
import { useDispatch, useSelector } from "react-redux";
import VegIcon from '../assets/vegicon.png';
import NonVegIcon from '../assets/nonvegicon.png';
import Styles from "../components/Styles";
import { HStack, VStack } from "native-base";

const DishRow = ({ id, name, Veg_NonVeg, Price, image, delivery, Restaurant }) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const colorScheme = useColorScheme();
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const itemQuantity = items.filter(item => item.name === name).length;

    const addItem = () => {
        Price = parseFloat(Price)
        dispatch(addToCart({ id, name, Price, image, Restaurant }));
    };

    const removeItem = () => {
        Price = parseFloat(Price)
        dispatch(removeFromCart({ id, name, Price, image, Restaurant }));
    };
    return (
        <>
            <HStack className='items-center justify-between w-full py-4' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                {/* Dish Details Block */}
                <VStack className='justify-start' style={{marginLeft: '2%'}}>
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

                {/* Add/Minus BUtton Block */}

                {itemQuantity == 0 && delivery=='Yes' &&
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

                {itemQuantity > 0 && delivery=='Yes' &&
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

            </HStack>
        </>
    );
};

export default DishRow;
