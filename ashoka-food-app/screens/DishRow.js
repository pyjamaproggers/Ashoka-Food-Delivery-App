import { View, Text, TouchableOpacity, Image, useColorScheme, ScrollView, ActivityIndicator, Button } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { urlFor } from "../sanity";
import { MinusCircleIcon, PlusCircleIcon, PlusSmallIcon, PlusIcon, MinusIcon, XMarkIcon } from "react-native-heroicons/solid";
import { addToCart, removeFromCart, selectCartItems, updateCartAdd, updateCartRemove, updateCartAddCustomized, updateCartRemoveCustomized } from "../reduxslices/cartslice";
import { useDispatch, useSelector } from "react-redux";
import VegIcon from '../assets/vegicon.png';
import NonVegIcon from '../assets/nonvegicon.png';
import Styles from "../components/Styles";
import { HStack, VStack, Actionsheet, Radio, Checkbox, Skeleton } from "native-base";
import { IP } from '@dotenv'
import Cart from '../assets/carticon.png';
import io from 'socket.io-client';

const DishRow = ({ id, name, Veg_NonVeg, Price, image, delivery, Restaurant, Customizations }) => {
    const colorScheme = useColorScheme();

    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const [itemQuantity, setItemQuantity] = useState(0)

    const [FetchedUnavailableItems, setFetchedUnavailableItems] = useState([])

    //Data structures for customizable dishes
    const [showCustomizationSheet, setShowCustomizationSheet] = useState()
    const [sheetLoading, setSheetLoading] = useState(false)

    const [dishCustomizations, setDishCustomizations] = useState([])
    const [userCustomizations, setUserCustomizations] = useState(new Map())
    const [CDishPrice, setCDishPrice] = useState(Price)
    const [CDishQuantity, setCDishQuantity] = useState(1)

    const [CDishVersionsInCart, setCDishVersionsInCart] = useState([])
    const [showCRemoveSheet, setShowCRemoveSheet] = useState(false)
    const [latestItem, setLatestItem] = useState(null)
    const [socket, setSocket] = useState(null)

    const addItem = () => {
        Price = parseFloat(Price)
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

    const removeItem = () => {
        Price = parseFloat(Price)
        var currentQuantity
        var additemQ
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            let removedDish = false;

            if (item.name === name && item.quantity === 1) {
                currentQuantity = 1;
                dispatch(removeFromCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: currentQuantity }));
                break; // Exit the loop completely
            }

            if (item.name === name && item.quantity >= 1) {
                console.log('coming here');
                currentQuantity = item.quantity;
                additemQ = currentQuantity - 1;
                dispatch(updateCartRemove({ newQuantity: additemQ, dishName: item.name }));
                removedDish = true;
                break; // Exit the loop completely
            }
        }
    };

    const addWithCustomizations = () => {
        Price = parseFloat(Price);

        var currentQuantity;
        var additemQ;

        const tempUserCustomizationsObject = {};
        userCustomizations.forEach((value, key) => {
            tempUserCustomizationsObject[key] = value.selectedItems;
        });

        let userCustomizationsObject = {};
        for (const genre in tempUserCustomizationsObject) {
            const items = tempUserCustomizationsObject[genre];

            if (Array.isArray(items)) {
                let customizationString = '';
                items.forEach((itemObject, index) => {
                    if (index === 0) {
                        customizationString = itemObject.name;
                    } else {
                        customizationString += ', ' + itemObject.name;
                    }
                });
                userCustomizationsObject[genre] = customizationString;
            } else {
                userCustomizationsObject[genre] = items.name;
            }
        }


        if (items.length === 0) {
            setItemQuantity(CDishQuantity);
            dispatch(addToCart({ id, name, Price: CDishPrice, image, Restaurant, Veg_NonVeg, quantity: CDishQuantity, customizations: userCustomizationsObject }));
            setCDishQuantity(1)
            setShowCustomizationSheet(false);
            setUserCustomizations(new Map())
        } else {
            if (items.filter((x) => (x.name === name)).length === 0) {
                setItemQuantity(CDishQuantity);
                dispatch(addToCart({ id, name, Price: CDishPrice, image, Restaurant, Veg_NonVeg, quantity: CDishQuantity, customizations: userCustomizationsObject }));
                setCDishQuantity(1)
                setShowCustomizationSheet(false);
                setUserCustomizations(new Map())
            } else {
                let foundSameCustomizations = false
                items.forEach((item) => {
                    if (item.name === name) {
                        console.log(objectsAreEqual(item.customizations, userCustomizationsObject))
                        if (objectsAreEqual(item.customizations, userCustomizationsObject)) {
                            console.log('FOUND EXACT SAME DISH W C ')
                            foundSameCustomizations = true
                            currentQuantity = item.quantity
                            additemQ = currentQuantity + CDishQuantity
                            setItemQuantity(additemQ)
                            dispatch(updateCartAddCustomized({ newQuantity: additemQ, dishName: item.name, customizations: userCustomizationsObject }))
                            setCDishQuantity(1)
                            setShowCustomizationSheet(false);
                            setUserCustomizations(new Map())
                        }
                    }
                })
                if (!foundSameCustomizations) {
                    console.log('NOT FOUND')
                    setItemQuantity(itemQuantity + CDishQuantity);
                    dispatch(addToCart({ id, name, Price: CDishPrice, image, Restaurant, Veg_NonVeg, quantity: CDishQuantity, customizations: userCustomizationsObject }));
                    setCDishQuantity(1)
                    setShowCustomizationSheet(false);
                    setUserCustomizations(new Map())
                }
            }
        }

        // console.log({ id, name, Price: CDishPrice, image, Restaurant, Veg_NonVeg, quantity: CDishQuantity, customizations: userCustomizationsObject })

    }

    const removeWithCustomizations = (quantity, customizations, name) => {
        dispatch(updateCartRemoveCustomized({dishName: name, customizations}))
        setShowCRemoveSheet(false)
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

    const connectToSocket = () => {
        const socket = io(`http://${IP}:8800`, {});

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        socket.on('unavailableItemsListUpdated', async (item) => {
            console.log("Unavailable Item List Updated")
            setLatestItem(item)
        });

        socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        setSocket(socket);
    };

    

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

                const tempUserCustomizations = new Map();

                tempCustomizations.forEach((customization) => {
                    if (!tempUserCustomizations.has(customization.genre)) {
                        if (customization.required === 'Yes') {
                            tempUserCustomizations.set(customization.genre, {
                                genre: customization.genre,
                                selectedItems: customization.items[0],
                            })
                        }
                        else {
                            tempUserCustomizations.set(customization.genre, {
                                genre: customization.genre,
                                selectedItems: [],
                            })
                        }
                    }
                })
                setUserCustomizations(tempUserCustomizations)
                setSheetLoading(false)
            }
            setSheetLoading(false)
        }, 200)

    };

    const addCustomizations = (genre, customization, required,) => {

        const tempUserCustomizations = userCustomizations

        if (required) {
            tempUserCustomizations.set(genre, {
                genre: genre,
                selectedItems: customization
            })
        }
        else {
            if (genre === 'Sauces') {
                tempUserCustomizations.set(genre, {
                    genre: genre,
                    selectedItems: (customization.length > 5) ?
                        tempUserCustomizations.get(genre).selectedItems
                        :
                        customization
                })
            }
            else {
                tempUserCustomizations.set(genre, {
                    genre: genre,
                    selectedItems: customization
                })
            }
        }

        let tempCDIshPrice = 0

        for (const [genre, value] of tempUserCustomizations) {
            if (value.selectedItems.length > 0) {
                value.selectedItems.forEach((selectedItem) => {
                    // console.log('in IF ' + genre + selectedItem.Price)
                    tempCDIshPrice += selectedItem.Price
                })
            }
            else {
                if (value.selectedItems.Price != undefined) {
                    // console.log('in ELSE' + genre + value.selectedItems.Price)
                    tempCDIshPrice += value.selectedItems.Price
                }
            }
        }
        setCDishPrice(tempCDIshPrice)

        // setUserCustomizations(tempUserCustomizations)
    }

    const askWhichCustomizationToRemove = () => {
        console.log('YES IM HERE')
        setShowCRemoveSheet(true)
        setSheetLoading(true)

        let dishVersionsInCart = []
        window.setTimeout(() => {
            for (const item of items) {
                if (item.name === name) {
                    dishVersionsInCart.push(item)
                }
            }
            setCDishVersionsInCart(dishVersionsInCart)
            setShowCRemoveSheet(true)
            setSheetLoading(false)
        }, 200)
    }

    console.log(items)

    useEffect(() => {
        if (items.length == 0) {
            setItemQuantity(0)
        }
        if (items.length != 0) {
            let itemQ = 0
            for (const item of items) {
                if (item.name === name) {
                    itemQ += item.quantity
                }
            }
            setItemQuantity(itemQ)
        }
        fetchUnavailableItems()
    }, [items, userCustomizations, latestItem])

    useEffect(() => {
        const fetchData = async () => {
            connectToSocket();
        };
        fetchData();
    }, []);

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
                                            <TouchableOpacity onPress={() => askWhichCustomizationToRemove()} className='p-3 px-2'>
                                                <MinusIcon size={16} color='white' />
                                            </TouchableOpacity>

                                            <Text className='text-xl font-medium' style={{ color: 'white' }}>
                                                {itemQuantity}
                                            </Text>

                                            <TouchableOpacity onPress={() => segregateCustomizations()} className='p-3 px-2'>
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
                        onPress={() => {
                            setShowCustomizationSheet(false)
                            setCDishPrice(Price)
                            setCDishQuantity(1)
                        }}
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
                                                            defaultValue={userCustomizations.get(item.genre).selectedItems}
                                                            onChange={nextValue => {
                                                                addCustomizations(item.genre, nextValue, true);
                                                            }}
                                                        >

                                                            {/* {console.log(userCustomizations)} */}

                                                            {item.items.map((element) => (

                                                                <Radio
                                                                    size='sm'
                                                                    colorScheme='rose'
                                                                    value={element}
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
                                                            onChange={(selectedArray) => {
                                                                addCustomizations(item.genre, selectedArray, false);
                                                            }}
                                                        >

                                                            {item.items.map(element => (

                                                                <Checkbox
                                                                    value={element}
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

                        {!sheetLoading &&
                            <HStack className='pt-3 w-11/12 px-2 justify-between'>

                                {/* Add/Minus Button for customized dish */}
                                <View className='justify-center items-center w-3/12'>
                                    <HStack
                                        style={[colorScheme == 'light' ? Styles.LightAddButtonFinal : Styles.DarkAddButtonFinal]}
                                    >
                                        <TouchableOpacity onPress={() => {
                                            if (CDishQuantity == 1) {
                                                setShowCustomizationSheet(false)
                                                setCDishPrice(Price)
                                            }
                                            else {
                                                setCDishQuantity(CDishQuantity - 1)
                                            }
                                        }} className='p-3 px-2'>
                                            <MinusIcon size={16} color='white' />
                                        </TouchableOpacity>

                                        <Text className='text-xl font-medium' style={{ color: 'white' }}>
                                            {CDishQuantity}
                                        </Text>

                                        <TouchableOpacity onPress={() => {
                                            setCDishQuantity(CDishQuantity + 1)
                                        }} className='p-3 px-2'>
                                            <PlusIcon size={16} color='white' />
                                        </TouchableOpacity>
                                    </HStack>

                                </View>

                                {/* Add item to cart button */}
                                <View className='justify-center items-center w-4/6'>
                                    <HStack className='bg-[#3E5896] py-2 rounded-md w-full items-center justify-center'
                                    >
                                        <TouchableOpacity onPress={() => {
                                            // addWithCustomizations invocation
                                            addWithCustomizations()
                                        }} className='px-0.5 py-0.5 flex-row items-center justify-evenly w-11/12'>
                                            <Image
                                                style={{ width: 20, height: 20, resizeMode: "contain", }}
                                                source={Cart}
                                            />
                                            {CDishQuantity == 1 &&
                                                <Text allowFontScaling={false} className='font-medium text-base'
                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                >
                                                    Add Item (₹{(CDishPrice * CDishQuantity).toFixed(2)})
                                                </Text>
                                            }
                                            {CDishQuantity > 1 &&
                                                <Text allowFontScaling={false} className='font-medium text-base'
                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                >
                                                    Add Items (₹{(CDishPrice * CDishQuantity).toFixed(2)})
                                                </Text>
                                            }
                                        </TouchableOpacity>
                                    </HStack>

                                </View>


                            </HStack>

                        }

                    </Actionsheet.Content>
                </Actionsheet>

            }

            {showCRemoveSheet &&

                <Actionsheet hideDragIndicator={true}
                    isOpen={showCRemoveSheet}
                    onClose={() => { setShowCRemoveSheet(false) }}
                    disableOverlay={true}
                >
                    <TouchableOpacity className='p-3 rounded-full m-3' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}
                        onPress={() => {
                            setShowCRemoveSheet(false)
                        }}
                    >
                        <XMarkIcon size={20} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
                    </TouchableOpacity>
                    <Actionsheet.Content bgColor={colorScheme == 'light' ? "#f2f2f2" : "#0c0c0f"} >
                        <View className='w-full text-center' style={[colorScheme == 'light' ? Styles.LightBG : Styles.DarkBG]}>
                            <Text className='self-center pt-2 pb-3 text-lg font-medium text-center'
                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                Choose {name} To Remove
                            </Text>
                        </View>

                        {!sheetLoading &&

                            <ScrollView
                                className='w-screen'
                                showsVerticalScrollIndicator={false}>

                                {CDishVersionsInCart.length > 0 &&

                                    <VStack className='w-full space-y-4'>

                                        {console.log('CDISHVERSION HERE NIGGAA ' + CDishVersionsInCart)}


                                        {CDishVersionsInCart.map((item) => (

                                            <>
                                                <HStack className='items-center justify-between px-2 w-full py-4 my-3 rounded-lg w-11/12 self-center' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                                                    {/* Dish Details Block */}
                                                    <VStack className='justify-start w-7/12' style={{}}>
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

                                                        <Text className='text-base font-medium py-1.5'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                        >
                                                            {name}
                                                        </Text>

                                                        <Text className='pb-1 font-medium text-xs'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                        >
                                                            ₹{Price}
                                                        </Text>

                                                        <VStack className='py-1'>
                                                            {item.customizations && Object.keys(item.customizations).map(key => (
                                                                <VStack>
                                                                    {item.customizations[key].length > 0 &&
                                                                        <>
                                                                            <Text className='text-xs font-medium pt-0.5 text-gray-400'
                                                                            // style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                            >
                                                                                {key}
                                                                            </Text>
                                                                            <Text className='text-xs font-medium pb-0.5'
                                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                            >
                                                                                {item.customizations[key]}
                                                                            </Text>
                                                                        </>
                                                                    }

                                                                </VStack>
                                                            ))}
                                                        </VStack>


                                                    </VStack>

                                                    <>
                                                        <VStack className='items-center'>
                                                            <TouchableOpacity onPress={() => removeWithCustomizations(item.quantity, item.customizations, item.name)} className=''>
                                                                <HStack className='p-2'
                                                                    style={[colorScheme == 'light' ? Styles.LightAddButtonFinal : Styles.DarkAddButtonFinal]}
                                                                >
                                                                    <Text className='text-md font-medium text-center self-center w-full' style={{ color: 'white' }}>
                                                                        Remove x{item.quantity}
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

                    </Actionsheet.Content>
                </Actionsheet>

            }
        </>
    );
};

export default DishRow;