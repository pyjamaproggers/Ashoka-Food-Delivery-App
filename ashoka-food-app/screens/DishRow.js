import { View, Text, TouchableOpacity, Image, useColorScheme, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { urlFor } from "../sanity";
import { MinusCircleIcon, PlusCircleIcon, PlusSmallIcon, PlusIcon, MinusIcon, XMarkIcon } from "react-native-heroicons/solid";
import { addToCart, removeFromCart, selectCartItems } from "../reduxslices/cartslice";
import { useDispatch, useSelector } from "react-redux";
import VegIcon from '../assets/vegicon.png';
import NonVegIcon from '../assets/nonvegicon.png';
import Styles from "../components/Styles";
import { HStack, VStack, Actionsheet, Radio, Checkbox, Skeleton } from "native-base";
import { IP } from '@dotenv'

const DishRow = ({ id, name, Veg_NonVeg, Price, image, delivery, Restaurant, Customizations }) => {
    const colorScheme = useColorScheme();
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const [itemQuantity, setItemQuantity] = useState(0)
    const [FetchedUnavailableItems, setFetchedUnavailableItems] = useState([])
    const [showCustomizationSheet, setShowCustomizationSheet] = useState()
    const [dishCustomizations, setDishCustomizations] = useState([])
    const [userCustomizations, setUserCustomizations] = useState()
    const [sheetLoading, setSheetLoading] = useState(false)

    const addItem = () => {
        Price = parseFloat(Price)
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

    const segregateCustomizations = () => {
        setShowCustomizationSheet(true)
        setSheetLoading(true)

        window.setTimeout(() => {
            if (Customizations !== null) {
                const genresMap = new Map(); // Using a map for better lookup efficiency

                Customizations.forEach((customization) => {
                    if (!genresMap.has(customization.Genre)) {
                        genresMap.set(customization.Genre, {
                            genre: customization.Genre,
                            items: [],
                            required: 'No'
                        });
                    }

                    const genreInfo = genresMap.get(customization.Genre);
                    genreInfo.items.push(customization);
                    genreInfo.items = genreInfo.items.reverse();

                    if (customization.Required === 'Yes') {
                        genreInfo.required = 'Yes';
                    }
                });

                const tempCustomizations = Array.from(genresMap.values());

                setDishCustomizations(tempCustomizations)

                const tempUserCustomizations = {}

                tempCustomizations.forEach(customization => {
                    tempUserCustomizations[customization.genre] = []
                })

                setUserCustomizations(tempUserCustomizations)
                setSheetLoading(false)
            }
            setSheetLoading(false)
        }, 200)

    };

    const addCustomizations = (currentCustomizations, genre, customization, required,) => {

        let tempUserCustomizations = {}

        if (required) {
            tempUserCustomizations = {
                ...currentCustomizations,
                [genre]: customization
            }
        }

        else {
            if (genre === 'Sauces') {
                customization.length > 3 ?
                    tempUserCustomizations = {
                        ...currentCustomizations,
                    }
                    :
                    tempUserCustomizations = {
                        ...currentCustomizations,
                        [genre]: customization
                    }
            }
            else {
                tempUserCustomizations = {
                    ...currentCustomizations,
                    [genre]: customization
                }
            }
        }
        // console.log(tempUserCustomizations)

        setUserCustomizations(tempUserCustomizations)
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
        // console.log(name + Customizations)
    }, [items])

    return (
        <>
            <HStack className='items-center justify-between px-2 w-full py-4' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                {/* Dish Details Block */}
                <VStack className='justify-start' style={{}}>
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
                        {Customizations == null ?
                            <>
                                {/* Add/Minus BUtton Block */}
                                {(itemQuantity == 0 || itemQuantity == null) && delivery == 'Yes' &&
                                    <TouchableOpacity onPress={addItem}
                                        className='items-center'
                                    >
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
                                    <View className='justify-center items-center'>
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

                                    </View>
                                }

                            </>
                            :
                            <>
                                {/* Add/Minus BUtton Block */}
                                {(itemQuantity == 0 || itemQuantity == null) && delivery == 'Yes' &&
                                    <TouchableOpacity onPress={() => { segregateCustomizations() }}>
                                        <VStack className='self-center items-center' >
                                            <HStack
                                                style={[colorScheme == 'light' ? Styles.LightAddButtonInitial : Styles.DarkAddButtonInitial]}
                                            >
                                                <Text className='text-xl font-medium ' style={{ color: '#3E5896', marginLeft: 4 }}>
                                                    ADD
                                                </Text>
                                                <PlusSmallIcon size={16} color='#3E5896' />
                                            </HStack>
                                            <Text allowFontScaling={false} className='mt-1 text-xs font-normal'
                                                style={[colorScheme == 'light' ? { color: 'rgb(156, 163, 175)' } : { color: 'rgb(107, 114, 128)' }]}
                                            >
                                                Customizable
                                            </Text>
                                        </VStack>
                                    </TouchableOpacity>
                                }
                                {itemQuantity > 0 && delivery == 'Yes' &&
                                    <VStack className='items-center'>
                                        <HStack
                                            style={[colorScheme == 'light' ? Styles.LightAddButtonFinal : Styles.DarkAddButtonFinal]}
                                        >
                                            <TouchableOpacity onPress={removeItem} className='p-3 px-2'>
                                                <MinusIcon size={16} color='white' />
                                            </TouchableOpacity>

                                            <Text className='text-xl font-medium' style={{ color: 'white' }}>
                                                {itemQuantity}
                                            </Text>

                                            <TouchableOpacity onPress={() => setShowCustomizationSheet(true)} className='p-3 px-2'>
                                                <PlusIcon size={16} color='white' />
                                            </TouchableOpacity>
                                        </HStack>
                                        <Text allowFontScaling={false} className='mt-1 text-xs font-normal'
                                            style={[colorScheme == 'light' ? { color: 'rgb(156, 163, 175)' } : { color: 'rgb(107, 114, 128)' }]}
                                        >
                                            Customizable
                                        </Text>
                                    </VStack>
                                }
                            </>
                        }
                    </>
                }



            </HStack>



            {showCustomizationSheet &&

                <Actionsheet hideDragIndicator={true}
                    isOpen={showCustomizationSheet}
                    onClose={() => { setShowCustomizationSheet(!showCustomizationSheet) }}
                    size='full'
                    disableOverlay={true}
                >
                    <TouchableOpacity className='p-3 rounded-full m-3' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}
                        onPress={() => setShowCustomizationSheet(false)}
                    >
                        <XMarkIcon size={20} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
                    </TouchableOpacity>
                    <Actionsheet.Content bgColor={colorScheme == 'light' ? "#f2f2f2" : "#0c0c0f"} >
                        <View className='w-full' style={[colorScheme == 'light' ? Styles.LightBG : Styles.DarkBG]}>
                            <Text className='self-center pt-2 pb-3 text-lg font-medium'
                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                Customize {name}
                            </Text>
                        </View>

                        {!sheetLoading &&

                            <ScrollView
                                className='w-screen'
                                showsVerticalScrollIndicator={false}>

                                {dishCustomizations.length > 0 && userCustomizations &&

                                    <VStack className='w-full space-y-4'>


                                        {dishCustomizations.map((item) => (

                                            <>



                                                {item.required === 'Yes' ?

                                                    <VStack className=' self-center rounded-md px-2 my-2'
                                                        style={[colorScheme == 'light' ? { backgroundColor: '#ffffff', width: '95%' } : { backgroundColor: '#262626', width: '95%' }]}
                                                    >

                                                        <HStack className='items-center py-0.5 justify-between border-b-gray'>
                                                            <VStack className=''>
                                                                <Text className='p-0.5 text-base font-medium'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                >
                                                                    {item.genre}
                                                                </Text>
                                                                <Text className='p-0.5 font-medium'
                                                                    style={[colorScheme == 'light' ? { color: 'rgb(156, 163, 175)' } : { color: 'rgb(107, 114, 128)' }]}
                                                                >
                                                                    Select any 1 option
                                                                </Text>

                                                            </VStack>
                                                            <Text
                                                                className='p-1 text-red-500'
                                                            >
                                                                Required
                                                            </Text>
                                                        </HStack>

                                                        <Radio.Group
                                                            // defaultValue={userCustomizations.get(item.genre).selectedItems[0]}
                                                            defaultValue={userCustomizations[item.genre]}
                                                            onChange={nextValue => {
                                                                addCustomizations(userCustomizations, item.genre, nextValue, true);
                                                            }}
                                                        >

                                                            {item.items.map((element) => (

                                                                <Radio
                                                                    size='sm'
                                                                    colorScheme='rose'
                                                                    value={element.name.replace(name, '').trim()}
                                                                    my={2}
                                                                >

                                                                    <HStack className='justify-between w-11/12 items-center'>

                                                                        <HStack className='p-2 items-center space-x-2'>
                                                                            {element.Veg_NonVeg === "Veg" &&
                                                                                <Image
                                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                                    source={VegIcon}
                                                                                />
                                                                            }
                                                                            {element.Veg_NonVeg === 'Non Veg' &&
                                                                                <Image
                                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                                    source={NonVegIcon}
                                                                                />
                                                                            }
                                                                            <Text className='font-medium text-md'
                                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                            >
                                                                                {element.name.replace(name, '').trim()}
                                                                            </Text>
                                                                        </HStack>

                                                                        {element.Price > 0 &&

                                                                            <Text className='font-medium text-md'
                                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                            >
                                                                                ₹{element.Price}
                                                                            </Text>

                                                                        }


                                                                    </HStack>

                                                                </Radio>

                                                            ))}
                                                        </Radio.Group>

                                                    </VStack>

                                                    :

                                                    <VStack className=' self-center rounded-md px-2 my-2'
                                                        style={[colorScheme == 'light' ? { backgroundColor: '#ffffff', width: '95%' } : { backgroundColor: '#262626', width: '95%' }]}
                                                    >
                                                        <HStack className='items-center py-0.5 justify-between border-b-gray'>
                                                            <VStack className=''>
                                                                <Text className='p-0.5 text-base'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                >
                                                                    {item.genre}
                                                                </Text>
                                                                <Text className='p-0.5'
                                                                    style={[colorScheme == 'light' ? { color: 'rgb(156, 163, 175)' } : { color: 'rgb(107, 114, 128)' }]}
                                                                >
                                                                    Select upto {item.items.length} option
                                                                </Text>

                                                            </VStack>
                                                        </HStack>


                                                        <Checkbox.Group
                                                            value={userCustomizations[item.genre]}
                                                            onChange={(selectedArray) => {
                                                                addCustomizations(userCustomizations, item.genre, selectedArray, false);
                                                            }}
                                                        >

                                                            {item.items.map(element => (

                                                                <Checkbox
                                                                    value={element.name.replace(name, '').trim()}
                                                                    colorScheme="danger"
                                                                    my={2}
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                    size='sm'
                                                                >
                                                                    <HStack className='items-center justify-between w-11/12'>

                                                                        <HStack className='ml-2 items-center space-x-2'>
                                                                            {element.Veg_NonVeg === "Veg" &&
                                                                                <Image
                                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                                    source={VegIcon}
                                                                                />
                                                                            }
                                                                            {element.Veg_NonVeg === 'Non Veg' &&
                                                                                <Image
                                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                                    source={NonVegIcon}
                                                                                />
                                                                            }
                                                                            <Text className='font-medium text-md'
                                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                            >
                                                                                {element.name.replace(name, '').trim()}
                                                                            </Text>
                                                                        </HStack>

                                                                        {element.Price > 0 &&

                                                                            <Text className='font-medium text-md'
                                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                            >
                                                                                ₹{element.Price}
                                                                            </Text>

                                                                        }

                                                                    </HStack>
                                                                </Checkbox>

                                                            ))}

                                                        </Checkbox.Group>

                                                    </VStack>

                                                }
                                            </>
                                        ))}


                                    </VStack>

                                }


                            </ScrollView>

                        }

                        {sheetLoading &&
                            <VStack className='w-full py-3 space-y-1'>
                                <VStack className='w-full py-3 space-y-2'>
                                    <Skeleton h='10' rounded='md' className='w-11/12 self-center '
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton rounded='md' className='w-11/12 h-28 self-center '
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </VStack>
                                <HStack className='w-11/12 self-center justify-between py-2 space-x-2 items-center'>
                                    <Skeleton h='12' rounded='md' className='w-2/6 self-center '
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                    <Skeleton rounded='md' className='w-7/12 h-12 self-center '
                                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                                </HStack>
                            </VStack>
                        }


                        {/* <View className="bottom-0 w-screen"
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
                                                {items.reduce((total, item) => total + item.quantity, 0)} ITEM ADDED
                                            </Text>
                                        }
                                        {items.length > 1 &&
                                            <Text className='text-md font-semibold text-black'
                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                            >
                                                {items.reduce((total, item) => total + item.quantity, 0)} ITEMS ADDED
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

                        </View > */}

                    </Actionsheet.Content>
                </Actionsheet>
            }
        </>
    );
};

export default DishRow;
