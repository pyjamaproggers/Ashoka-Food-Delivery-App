import { View, Text, TouchableOpacity, ScrollView, colorScheme, useColorScheme, TextInput, FlatList, Alert } from "react-native";
import React, { useMemo, useState, useLayoutEffect, useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { selectRestaurant } from "../reduxslices/restaurantSlice";
import { addToCart, removeFromCart, selectCartItems, selectCartTotal, updateCartAdd, updateCartRemove } from "../reduxslices/cartslice";
import { ArrowLeftIcon, ChevronRightIcon } from 'react-native-heroicons/solid';
import { SafeAreaView, StyleSheet, StatusBar, Image } from "react-native";
import { urlFor } from "../sanity";
import Styles from '../components/Styles.js'
import { HStack, TextArea, VStack, Alert as NativeBaseAlert, Skeleton, Spinner } from "native-base";
import VegIcon from '../assets/vegicon.png';
import client from '../sanity';
import NonVegIcon from '../assets/nonvegicon.png';
import PenIcon from '../assets/pen.png';
import { PlusIcon, MinusIcon } from 'react-native-heroicons/solid';
import Subtotal from '../assets/subtotal.png';
import Total from '../assets/total.png'
import FinalTotal from '../assets/finaltotal.png'
import Government from '../assets/government.png';
import DeliveryBhaiya from '../assets/deliverybhaiya.png';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Chevronup from '../assets/chevronupicon.png';
import ChevronDown from '../assets/chevrondownicon.png';
import FoodDelivery from '../assets/fooddelivery.png';
import DineIn from '../assets/dinein.png';
import RH from '../assets/rh.png'
import AC04 from '../assets/ac04.png'
import SportsBlock from '../assets/sportsblock.png'
import Mess from '../assets/mess.png'
import UPI from '../assets/upi.png'
import COD from '../assets/cod.png'
import { IP } from '@dotenv'
import BrokenHeart from '../assets/brokenheart.png'
import PayAtRestaurant from '../assets/payatrestaurant.png'


const BasketScreen = () => {
    const colorScheme = useColorScheme()
    const { params: { actualUser, Basket } } = useRoute();
    const navigation = useNavigation();

    const items = useSelector(selectCartItems);
    const dispatch = useDispatch();

    const [FinalBasket, setFinalBasket] = useState()
    const [FinalBasketReady, setFinalBasketReady] = useState(false)
    const [CartTotal, setCartTotal] = useState(0)

    const [DeliveryLocation, setDeliveryLocation] = useState('Location')
    const [isLocationOpen, setIsLocationOpen] = useState(false)
    const [deliveryOptions, setDeliveryOptions] = useState()

    const [PaymentOption, setPaymentOption] = useState('Payment Mode')
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [paymentOptions, setPaymentOptions] = useState()

    const [OrderTypeOption, setOrderTypeOption] = useState('Order Type')
    const [isOrderTypeOpen, setIsOrderTypeOpen] = useState(false)
    const [orderTypeOptions, setOrderTypeOptions] = useState()

    const [Fetching, setFetching] = useState()

    const [showSpinner, setShowSpinner] = useState(false)

    // const Locations = [
    //     { location: 'RH1', icon: RH },
    //     { location: 'RH2', icon: RH },
    //     { location: 'RH3', icon: RH },
    //     { location: 'RH4', icon: RH },
    //     { location: 'RH5', icon: RH },
    //     { location: 'Library AC04', icon: AC04 },
    //     { location: 'Sports Block', icon: SportsBlock },
    //     { location: 'Mess', icon: Mess },
    // ]

    // const paymentOptions = [
    //     { option: 'Pay On Delivery', icon: COD },
    //     { option: 'Pay via UPI', icon: UPI },
    // ]
    // const paymentOptions2 = [
    //     { option: 'Pay On Delivery', icon: COD },
    // ]
    // const paymentOptions3 = [
    //     { option: 'Pay via UPI', icon: UPI },
    // ]

    // const orderTypeOptions = [
    //     { option: 'Delivery', icon: FoodDelivery },
    //     { option: 'Dine In', icon: DineIn },
    // ]
    // const orderTypeOptions2 = [
    //     { option: 'Delivery', icon: FoodDelivery },
    // ]

    const instructionsPlaceholders = [
        'Bhaiya mirchi thodi kam daalna...',
        'Bhaiya nimbu soda sweet please...',
        'Cookie free de sakte ho kya...',
        'Bhaiya yeh fries ka price thoda kam karo yaar...',
        'Bhaiya do extra pav...',
        'Bun Muska mei thodi honey kam please...',
        'Thodi extra chilli flakes please...',
    ]

    const deliveryCharges = {
        'Chicago Pizza': 20.00,
        'Roti Boti': 0.00,
        'Dhaba': 10.00,
        'Subway': 20.00,
        'Chaat Stall': 0.00,
        'The Hunger Cycle': 15.00,
        'Rasananda': 10.00,
    }

    const query = `*[_type == "restaurant"]
        { name, image }`;

    const addItem = (id, name, Price, image, Restaurant, Veg_NonVeg) => {
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

    const removeItem = (id, name, Price, image, Restaurant, Veg_NonVeg) => {
        Price = parseFloat(Price)
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

    const checkUnavailableItems = async () => {
        var checkArray = 'The following items were removed from your cart as they became unavailable: '

        for (const basketRestaurant of Basket) {
            try {
                const response = await fetch(`http://${IP}:8800/api/items/${basketRestaurant.name}`)
                const data = await response.json()
                var TempFetchedUnavailableItems = []
                var unavailableItemsInCart = ''
                var flag = 0
                if (data) {
                    data.map((item, index) => {
                        TempFetchedUnavailableItems.push(item.name)
                    })
                    items.map((item, index) => {
                        if (TempFetchedUnavailableItems.includes(item.name)) {
                            flag = 1
                            if (unavailableItemsInCart.length == 0) {
                                unavailableItemsInCart = unavailableItemsInCart.concat('', item.name)
                            } else {
                                unavailableItemsInCart = unavailableItemsInCart.concat(', ', item.name)
                            }
                            dispatch(removeFromCart({ id: item.id, name: item.name, Price: item.Price, image: item.image, Restaurant: item.Restaurant, Veg_NonVeg: item.Veg_NonVeg, quantity: 0 }))
                        }
                    })
                    if (flag == 1) {
                        unavailableItemsInCart = unavailableItemsInCart.concat(' from ', basketRestaurant.name)
                    }
                }
                if (unavailableItemsInCart.length > 0) {
                    checkArray = checkArray.concat('\n', `${unavailableItemsInCart}`)
                } else {
                    checkArray.concat('', '')
                }
            } catch (error) {
                console.error('Error while fetching unavailable items on cart screen' + error)
            }
        }

        return checkArray
    }

    const updateInstructions = (instruction, restaurant) => {
        var TempFinalBasket = FinalBasket
        TempFinalBasket.map((Outlet, index) => {
            if (Outlet.name == restaurant) {
                Outlet.instructions = instruction
            }
        })
        setFinalBasket(TempFinalBasket)
    };

    const getInstructions = (restaurant) => {
        for (const Outlet of FinalBasket) {
            if (Outlet.name === restaurant) {
                // console.log(restaurant + " FOUND");
                // console.log(Outlet.instructions);
                return Outlet.instructions;
            }
        }
        return null; // Return null or any default value if the restaurant is not found
    };

    useMemo(async () => {
        console.log('MEMO RUNNING AGAIN YAY')
        setFetching(true)

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
                restaurantTotal: 0
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
                    RestaurantMiniCart['restaurantTotal'] += (item.Price * item.quantity)
                }
            })
        })

        var TempCartTotal = 0
        TempBasket.map((BasketRestaurant, index) => {
            // console.log(BasketRestaurant.name)
            var Subtotal = 0
            var FinalTotal = 0
            BasketRestaurant.items.map((item, index) => {
                Subtotal = Subtotal + (item.Price * item.quantity)
            })
            if (BasketRestaurant.name == 'Roti Boti') {
                var GSTtotal = (Math.round(Subtotal * (1.05) * 100) / 100).toFixed(2)
                FinalTotal = ((Math.round(GSTtotal * 100) / 100) + (Math.round(deliveryCharges[BasketRestaurant.name] * 100) / 100)).toFixed(2)
                // console.log((Math.round(FinalTotal * 100) / 100).toFixed(2))
            }
            else {
                FinalTotal = ((Math.round(Subtotal * 100) / 100) + (Math.round(deliveryCharges[BasketRestaurant.name] * 100) / 100))
                // console.log((Math.round(FinalTotal * 100) / 100).toFixed(2))
            }
            TempCartTotal = ((Math.round(TempCartTotal * 100) / 100) + (Math.round(FinalTotal * 100) / 100)).toFixed(2)
            BasketRestaurant.restaurantTotal = Subtotal
        })
        setCartTotal(TempCartTotal)

        client
            .fetch(query)
            .then((data) => {
                var TempFinalBasket = []
                TempFinalBasket = TempBasket
                let FoodVillageInCart = false
                data.map((restaurant, index) => {
                    TempFinalBasket.map((basketRestaurant, index) => {
                        if (restaurant.name == basketRestaurant.name) {
                            basketRestaurant['image'] = restaurant.image
                        }
                        if (basketRestaurant.name == 'Chaat Stall') {
                            FoodVillageInCart = true
                        }
                    })
                })
                if (FoodVillageInCart) {
                    setDeliveryOptions([
                        { location: 'RH1', icon: RH },
                        { location: 'RH2', icon: RH },
                        { location: 'RH3', icon: RH },
                        { location: 'RH4', icon: RH },
                        { location: 'RH5', icon: RH },
                    ])
                }
                else {
                    setDeliveryOptions([
                        { location: 'RH1', icon: RH },
                        { location: 'RH2', icon: RH },
                        { location: 'RH3', icon: RH },
                        { location: 'RH4', icon: RH },
                        { location: 'RH5', icon: RH },
                        { location: 'Library AC04', icon: AC04 },
                        { location: 'Sports Block', icon: SportsBlock },
                        { location: 'Mess', icon: Mess },
                    ])
                }
                setOrderTypeOptions([
                    { option: 'Delivery', icon: FoodDelivery },
                    { option: 'Dine In', icon: DineIn },
                ])
                setPaymentOptions([
                    { option: 'Pay On Delivery', icon: COD },
                    { option: 'Pay At Outlet', icon: PayAtRestaurant },
                ])
                setFinalBasket(TempFinalBasket)
                setFinalBasketReady(true)
                setFetching(false)
            })
            .catch((error) => {
                console.log('Error:', error); // Log any errors that occur
            });

        // let itemsCheck = await checkUnavailableItems();
        // if (itemsCheck != 'The following items were removed from your cart as they became unavailable: ') {
        //     Alert.alert(itemsCheck)
        // }

    }, [items]);

    if (items.length == 0) { navigation.goBack() }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const sendOrderToDatabase = async (orderData) => {
        const url = `http://${IP}:8800/api/orders`; // Node Server (Our backend, put the IP address as ur local IPV4 address)
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                console.log("Order sent successfully!");
                setShowSpinner(false)
                // Perform any actions after a successful order submission if needed
            } else {
                console.error("Failed to send order!");
                // Handle error scenarios if needed
            }
        } catch (error) {
            console.error("Error occurred while sending order:", error);
            // Handle error scenarios if needed
        }
    };

    // Function to calculate GST for a restaurant
    const calculateGST = (subtotal, restaurantName) => {
        if (restaurantName === 'Roti Boti' || restaurantName === 'Subway' || restaurantName === 'Chicago Pizza') {
            return (Math.round(subtotal * 0.18 * 100) / 100);
        } else {
            return 0;
        }
    };

    // Function to place the order
    const placeOrder = async () => {
        // Create an array to store separate order objects for each restaurant
        const orders = [];

        const day = new Date();
        const m = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"]
        var orderDate = ''
        if (day.getHours() >= 12) {
            if (day.getMinutes() < 10) {
                console.log('coming here')
                orderDate = day.getHours() + ':' + '0' + day.getMinutes() + 'PM' + ' on ' + day.getDate() + ' ' + m[day.getMonth()] + ' ' + day.getFullYear()
            }
            else {
                orderDate = day.getHours() + ':' + day.getMinutes() + 'PM' + ' on ' + day.getDate() + ' ' + m[day.getMonth()] + ' ' + day.getFullYear()
            }
        }
        else {
            if (day.getMinutes() < 10) {
                orderDate = day.getHours() + ':' + '0' + day.getMinutes() + 'AM' + ' on ' + day.getDate() + ' ' + m[day.getMonth()] + ' ' + day.getFullYear()
            }
            else {
                orderDate = day.getHours() + ':' + day.getMinutes() + 'AM' + ' on ' + day.getDate() + ' ' + m[day.getMonth()] + ' ' + day.getFullYear()
            }
        }

        if (DeliveryLocation == 'Location') {
            Alert.alert(
                'Where do we get it delivered to? Check the dropdown'
            )
            setShowSpinner(false)
            return
        }
        if (PaymentOption == 'Payment Mode') {
            Alert.alert(
                'How are you paying for this? Check the dropdown.'
            )
            setShowSpinner(false)
            return
        }
        if (OrderTypeOption == 'Order Type') {
            Alert.alert(
                'What is your order type? Check the dropdown'
            )
            setShowSpinner(false)
            return
        }

        // Iterate over the FinalBasket array
        for (const BasketRestaurant of FinalBasket) {
            console.log('Still coming here')
            // Calculate the subtotal and GST for the current restaurant
            const subtotal = BasketRestaurant.restaurantTotal;
            const gst = calculateGST(subtotal, BasketRestaurant.name);

            // Calculate the total amount with GST and delivery charges
            const totalAmount = (subtotal + gst + deliveryCharges[BasketRestaurant.name]).toFixed(2);

            // Extract item names and prices from the BasketRestaurant items
            const orderItems = BasketRestaurant.items.map(item => ({
                name: item.name,
                price: item.Price,
                quantity: item.quantity
            }));

            const orderInstructions = getInstructions(BasketRestaurant.name)

            // Create an order object for the current restaurant
            const orderData = {
                name: actualUser.name,
                phone: actualUser.phone,
                email: actualUser.email,
                Restaurant: BasketRestaurant.name,
                orderAmount: totalAmount,
                orderItems: orderItems,
                orderDate: orderDate,
                orderInstructions: orderInstructions,
                deliveryLocation: DeliveryLocation,
                payment: PaymentOption,
                type: OrderTypeOption,
                orderStatus: "placed"
            };

            // Push the order object to the orders array
            orders.push(orderData);
        }

        let itemsCheck = await checkUnavailableItems()
        if (itemsCheck == 'The following items were removed from your cart as they became unavailable: ') {
            // Now, you have an array of order objects, each representing an order for a different restaurant
            // Call the sendOrderToDatabase function to send the orders to the API
            for (const orderData of orders) {
                sendOrderToDatabase(orderData);
            }
            for (const item of items){
                dispatch(removeFromCart({ id: item.id, name: item.name, Price: item.Price, image: item.image, Restaurant: item.Restaurant, Veg_NonVeg: item.Veg_NonVeg, quantity: 0 }))
            }
            navigation.navigate('LiveOrders', { actualUser });
        }
        else {
            Alert.alert(itemsCheck)
            setShowSpinner(false)
        }

    };

    return (
        <View className="flex-1 pt-14" style={[colorScheme == 'light' ? { backgroundColor: '#F2F2F2' } : { backgroundColor: '#0c0c0f' }]}>

            {!FinalBasketReady &&
                <VStack className='pt-8 items-center space-y-6'>
                    <Skeleton h='2' rounded='full' w='20%'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                    <Skeleton h='12' rounded='md' w='12'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                    <Skeleton h='3' rounded='full' w='20%'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />

                    <Skeleton h='2' rounded='full' w='80%'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />

                    <Skeleton h='12' rounded='md' w='90%'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                    <Skeleton h='12' rounded='md' w='90%'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />

                    <Skeleton h='2' rounded='full' w='80%'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                    <Skeleton h='8' rounded='md' w='90%'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />

                    <Skeleton h='2' rounded='full' w='20%'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                    <Skeleton h='16' rounded='md' w='90%'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />

                    <Skeleton h='2' rounded='full' w='20%'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                    <Skeleton h='24' rounded='md' w='90%'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />

                </VStack>
            }

            {CartTotal.length != 0 && FinalBasketReady &&
                <SafeAreaView className="absolute bottom-0 w-screen z-20 " style={[colorScheme == 'light' ? Styles.LightCartButton : Styles.DarkCartButton]}>
                    <VStack className='w-full'>

                        <HStack className='w-full self-center justify-evenly'>

                            <VStack style={{ width: '45%' }}>
                                <TouchableOpacity
                                    className=' self-center'
                                    onPress={() => {
                                        setIsOrderTypeOpen(!isOrderTypeOpen)
                                        if (isLocationOpen) {
                                            setIsLocationOpen(false)
                                        }
                                        if (isPaymentOpen) {
                                            setIsPaymentOpen(false)
                                        }
                                    }}
                                    style={[colorScheme == 'light' ? styles.LightDropdownButtonCart : styles.DarkDropdownButtonCart]}
                                >
                                    <HStack className='w-full items-center justify-between'>
                                        <HStack className='items-center'>
                                            {OrderTypeOption == 'Delivery' ?
                                                <Image
                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                    source={FoodDelivery}
                                                />
                                                :
                                                <Image
                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                    source={DineIn}
                                                />
                                            }
                                            <Text className='text-sm pl-2 font-medium' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                {OrderTypeOption}
                                            </Text>
                                        </HStack>
                                        {isOrderTypeOpen ?
                                            <Image
                                                style={{ width: 12, height: 12, resizeMode: "contain" }}
                                                source={ChevronDown}
                                            />
                                            :
                                            <Image
                                                style={{ width: 12, height: 12, resizeMode: "contain" }}
                                                source={Chevronup}
                                            />
                                        }
                                    </HStack>
                                </TouchableOpacity>
                                {isOrderTypeOpen === true &&
                                    <View style={[colorScheme == 'light' ? styles.LightDropdownMenu2 : styles.DarkDropdownMenu2]}
                                        className='h-max'
                                    >
                                        {FinalBasket.length > 1 &&
                                            <FlatList data={orderTypeOptions} renderItem={({ item, index }) => {
                                                if (index == orderTypeOptions.length - 1) {
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setOrderTypeOption(item.option)
                                                                setIsOrderTypeOpen(false)
                                                            }}
                                                            style={[colorScheme == 'light' ? styles.LightDropdownItemEnd : styles.DarkDropdownItemEnd]}
                                                        >
                                                            <HStack className='items-center'>
                                                                {item.option == 'Delivery' ?
                                                                    <Image
                                                                        style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                        source={FoodDelivery}
                                                                    />
                                                                    :
                                                                    <Image
                                                                        style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                        source={DineIn}
                                                                    />
                                                                }
                                                                <Text className='text-sm pl-2 font-medium' style={[colorScheme == 'light' ? Styles.LightDropdownText : Styles.DarkDropdownText]}>
                                                                    {item.option}
                                                                </Text>
                                                            </HStack>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setOrderTypeOption(item.option)
                                                            setIsOrderTypeOpen(false)
                                                        }}
                                                        style={[colorScheme == 'light' ? styles.LightDropdownItem : styles.DarkDropdownItem]}
                                                    >
                                                        <HStack className='items-center'>
                                                            {item.option == 'Delivery' ?
                                                                <Image
                                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                    source={FoodDelivery}
                                                                />
                                                                :
                                                                <Image
                                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                    source={DineIn}
                                                                />
                                                            }
                                                            <Text className='text-sm pl-2 font-medium' style={[colorScheme == 'light' ? Styles.LightDropdownText : Styles.DarkDropdownText]}>
                                                                {item.option}
                                                            </Text>
                                                        </HStack>
                                                    </TouchableOpacity>
                                                )
                                            }} />
                                        }
                                        {FinalBasket.length == 1 &&
                                            <FlatList data={orderTypeOptions} renderItem={({ item, index }) => {
                                                if (index == orderTypeOptions.length - 1) {
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setOrderTypeOption(item.option)
                                                                setIsOrderTypeOpen(false)
                                                            }}
                                                            style={[colorScheme == 'light' ? styles.LightDropdownItemEnd : styles.DarkDropdownItemEnd]}
                                                        >
                                                            <HStack className='items-center'>
                                                                {item.option == 'Delivery' ?
                                                                    <Image
                                                                        style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                        source={FoodDelivery}
                                                                    />
                                                                    :
                                                                    <Image
                                                                        style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                        source={DineIn}
                                                                    />
                                                                }
                                                                <Text className='text-sm pl-2 font-medium' style={[colorScheme == 'light' ? Styles.LightDropdownText : Styles.DarkDropdownText]}>
                                                                    {item.option}
                                                                </Text>
                                                            </HStack>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setOrderTypeOption(item.option)
                                                            setIsOrderTypeOpen(false)
                                                        }}
                                                        style={[colorScheme == 'light' ? styles.LightDropdownItem : styles.DarkDropdownItem]}
                                                    >
                                                        <HStack className='items-center'>
                                                            {item.option == 'Delivery' ?
                                                                <Image
                                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                    source={FoodDelivery}
                                                                />
                                                                :
                                                                <Image
                                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                    source={DineIn}
                                                                />
                                                            }
                                                            <Text className='text-sm pl-2 font-medium' style={[colorScheme == 'light' ? Styles.LightDropdownText : Styles.DarkDropdownText]}>
                                                                {item.option}
                                                            </Text>
                                                        </HStack>
                                                    </TouchableOpacity>
                                                )
                                            }} />

                                        }
                                    </View>
                                }
                            </VStack>

                            <VStack style={{ width: '45%' }}
                            >
                                <TouchableOpacity
                                    className=' self-center'
                                    onPress={() => {
                                        setIsLocationOpen(!isLocationOpen)
                                        if (isPaymentOpen) {
                                            setIsPaymentOpen(false)
                                        }
                                        if (isOrderTypeOpen) {
                                            setIsOrderTypeOpen(false)
                                        }
                                    }}
                                    style={[colorScheme == 'light' ? styles.LightDropdownButtonCart : styles.DarkDropdownButtonCart]}
                                >
                                    <HStack className='w-full items-center justify-between'>
                                        <HStack className='items-center'>
                                            {(DeliveryLocation == 'RH1' || DeliveryLocation == 'RH2' || DeliveryLocation == 'RH3' || DeliveryLocation == 'RH4' || DeliveryLocation == 'RH5' || DeliveryLocation == 'Location') &&
                                                <Image
                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                    source={RH}
                                                />
                                            }
                                            {DeliveryLocation == 'Library AC04' &&
                                                <Image
                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                    source={AC04}
                                                />
                                            }
                                            {DeliveryLocation == 'Mess' &&
                                                <Image
                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                    source={Mess}
                                                />
                                            }
                                            {DeliveryLocation == 'Sports Block' &&
                                                <Image
                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                    source={SportsBlock}
                                                />
                                            }
                                            <Text className='text-sm pl-2 font-medium' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                {DeliveryLocation}
                                            </Text>
                                        </HStack>
                                        {isLocationOpen ?
                                            <Image
                                                style={{ width: 12, height: 12, resizeMode: "contain" }}
                                                source={ChevronDown}
                                            />
                                            :
                                            <Image
                                                style={{ width: 12, height: 12, resizeMode: "contain" }}
                                                source={Chevronup}
                                            />
                                        }
                                    </HStack>
                                </TouchableOpacity>
                                {isLocationOpen === true &&
                                    <View style={[colorScheme == 'light' ? styles.LightDropdownMenu2 : styles.DarkDropdownMenu2]}
                                        className='h-max'
                                    >
                                        <FlatList data={deliveryOptions} renderItem={({ item, index }) => {
                                            if (index == deliveryOptions.length - 1) {
                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setDeliveryLocation(item.location)
                                                            setIsLocationOpen(false)
                                                        }}
                                                        style={[colorScheme == 'light' ? styles.LightDropdownItemEnd : styles.DarkDropdownItemEnd]}
                                                    >
                                                        <HStack className='items-center'>
                                                            {(item.location == 'RH1' || item.location == 'RH2' || item.location == 'RH3' || item.location == 'RH4' || item.location == 'RH5' || item.location == 'Location') &&
                                                                <Image
                                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                    source={RH}
                                                                />
                                                            }
                                                            {item.location == 'Library AC04' &&
                                                                <Image
                                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                    source={AC04}
                                                                />
                                                            }
                                                            {item.location == 'Mess' &&
                                                                <Image
                                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                    source={Mess}
                                                                />
                                                            }
                                                            {item.location == 'Sports Block' &&
                                                                <Image
                                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                    source={SportsBlock}
                                                                />
                                                            }
                                                            <Text className='text-sm pl-2 font-medium' style={[colorScheme == 'light' ? Styles.LightDropdownText : Styles.DarkDropdownText]}>
                                                                {item.location}
                                                            </Text>

                                                        </HStack>
                                                    </TouchableOpacity>
                                                )
                                            }
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setDeliveryLocation(item.location)
                                                        setIsLocationOpen(false)
                                                    }}
                                                    style={[colorScheme == 'light' ? styles.LightDropdownItem : styles.DarkDropdownItem]}
                                                >
                                                    <HStack className='items-center'>
                                                        {(item.location == 'RH1' || item.location == 'RH2' || item.location == 'RH3' || item.location == 'RH4' || item.location == 'RH5' || item.location == 'Location') &&
                                                            <Image
                                                                style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                source={RH}
                                                            />
                                                        }
                                                        {item.location == 'Library AC04' &&
                                                            <Image
                                                                style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                source={AC04}
                                                            />
                                                        }
                                                        {item.location == 'Mess' &&
                                                            <Image
                                                                style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                source={Mess}
                                                            />
                                                        }
                                                        {item.location == 'Sports Block' &&
                                                            <Image
                                                                style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                source={SportsBlock}
                                                            />
                                                        }
                                                        <Text className='text-sm pl-2 font-medium' style={[colorScheme == 'light' ? Styles.LightDropdownText : Styles.DarkDropdownText]}>
                                                            {item.location}
                                                        </Text>

                                                    </HStack>
                                                </TouchableOpacity>
                                            )
                                        }} />
                                    </View>
                                }
                            </VStack>

                        </HStack>


                        <HStack className='justify-evenly items-center w-full self-center'>

                            <VStack style={{ width: '45%' }}
                            >
                                <TouchableOpacity
                                    className=' self-center'
                                    onPress={() => {
                                        setIsPaymentOpen(!isPaymentOpen)
                                        if (isLocationOpen) {
                                            setIsLocationOpen(false)
                                        }
                                        if (isOrderTypeOpen) {
                                            setIsOrderTypeOpen(false)
                                        }
                                    }}
                                    style={[colorScheme == 'light' ? styles.LightDropdownButtonCart : styles.DarkDropdownButtonCart]}
                                >
                                    <HStack className='w-full items-center justify-between'>
                                        <HStack className='items-center'>
                                            {PaymentOption == 'Pay On Delivery' ?
                                                <Image
                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                    source={COD}
                                                />
                                                :
                                                <Image
                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                    source={UPI}
                                                />
                                            }
                                            <Text className='text-sm pl-2 font-medium' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                {PaymentOption}
                                            </Text>
                                        </HStack>
                                        {isPaymentOpen ?
                                            <Image
                                                style={{ width: 12, height: 12, resizeMode: "contain" }}
                                                source={ChevronDown}
                                            />
                                            :
                                            <Image
                                                style={{ width: 12, height: 12, resizeMode: "contain" }}
                                                source={Chevronup}
                                            />
                                        }
                                    </HStack>
                                </TouchableOpacity>
                                {isPaymentOpen === true &&
                                    <View style={[colorScheme == 'light' ? styles.LightDropdownMenu2 : styles.DarkDropdownMenu2]}
                                        className='h-max'
                                    >
                                        {FinalBasket.length >= 1 &&
                                            <FlatList data={paymentOptions} renderItem={({ item, index }) => {
                                                if (index == paymentOptions.length - 1) {
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setPaymentOption(item.option)
                                                                setIsPaymentOpen(false)
                                                            }}
                                                            style={[colorScheme == 'light' ? styles.LightDropdownItemEnd : styles.DarkDropdownItemEnd]}
                                                        >
                                                            <HStack className='items-center'>
                                                                {item.option == 'Pay On Delivery' ?
                                                                    <Image
                                                                        style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                        source={COD}
                                                                    />
                                                                    :
                                                                    <Image
                                                                        style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                        source={UPI}
                                                                    />
                                                                }
                                                                <Text className='text-sm pl-2 font-medium' style={[colorScheme == 'light' ? Styles.LightDropdownText : Styles.DarkDropdownText]}>
                                                                    {item.option}
                                                                </Text>
                                                            </HStack>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setPaymentOption(item.option)
                                                            setIsPaymentOpen(false)
                                                        }}
                                                        style={[colorScheme == 'light' ? styles.LightDropdownItem : styles.DarkDropdownItem]}
                                                    >
                                                        <HStack className='items-center'>
                                                            {item.option == 'Pay On Delivery' ?
                                                                <Image
                                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                    source={COD}
                                                                />
                                                                :
                                                                <Image
                                                                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                                                                    source={UPI}
                                                                />
                                                            }
                                                            <Text className='text-sm pl-2 font-medium' style={[colorScheme == 'light' ? Styles.LightDropdownText : Styles.DarkDropdownText]}>
                                                                {item.option}
                                                            </Text>
                                                        </HStack>
                                                    </TouchableOpacity>
                                                )
                                            }} />
                                        }
                                    </View>
                                }
                            </VStack>

                            <TouchableOpacity
                                onPress={()=>{
                                    setShowSpinner(true)
                                    placeOrder()
                                }}
                                className="bg-[#3E5896] py-1.5 my-0.5 px-3 flex-row items-center rounded-lg z-20"
                                style={{ width: '47.5%' }}
                            >
                                <HStack className='items-center justify-between  w-full'>
                                    {!showSpinner &&
                                        <>
                                            <VStack>
                                                <Text className='text-base pl-1 font-medium text-white' >
                                                    Place Your Order
                                                </Text>
                                                <Text className='text-sm pl-1 font-medium text-white' >
                                                    (₹{CartTotal})
                                                </Text>
                                            </VStack>
                                            <View style={{ transform: [{ rotate: '90deg' }] }}>
                                                <Image
                                                    style={{ width: 12, height: 12, resizeMode: "contain" }}
                                                    source={Chevronup}
                                                />
                                            </View>
                                        </>
                                    }
                                    {showSpinner &&
                                        <View className='w-full py-2.5'>
                                            <Spinner color='white' />
                                        </View>
                                    }
                                </HStack>
                            </TouchableOpacity>

                        </HStack >

                    </VStack>
                </SafeAreaView>
            }
            <KeyboardAwareScrollView>
                {FinalBasketReady &&
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 200
                        }}

                    >
                        <View className="relative">
                            <HStack className='items-center pt-2'>
                                <TouchableOpacity onPress={navigation.goBack} className="p-2 rounded-full" style={[colorScheme == 'light' ? Styles.LightBackButton : Styles.DarkBackButton]}>
                                    <ArrowLeftIcon size={20} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
                                </TouchableOpacity>
                            </HStack>
                        </View>

                        <VStack className='w-screen items-center'>
                            <Text className='self-center font-medium text-md pb-4' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                ORDER DETAILS
                            </Text>
                            <View className='w-11/12 pb-3 space-y-6 ' >
                                {FinalBasket.map((BasketRestaurant, index) => (
                                    <View className='space-y-2'>
                                        <VStack className='w-full items-center space-y-2 pb-3 pt-2'>
                                            <Image source={{ uri: urlFor(BasketRestaurant.image).url() }} style={{ width: 40, height: 40, borderRadius: 5 }} />
                                            <Text allowFontScaling={false} className='text-lg font-medium'
                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                            >
                                                {BasketRestaurant.name}
                                            </Text>
                                        </VStack>
                                        <View className='mt-3 border-t' style={[colorScheme == 'light' ? Styles.LightHomeAdlibBorder : Styles.DarkHomeAdlibBorder]}  >
                                            <Text
                                                allowFontScaling={false}
                                                className="text-center text-sm mx-28 -top-3 -mb-2"
                                                style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                                            >
                                                Item(s) Added
                                            </Text>
                                        </View>
                                        <View className='rounded-xl w-full shadow-sm' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                                            {
                                                BasketRestaurant.items.map((dish, index) => (
                                                    <>
                                                        {/* <DishRow name={dish.name} Price={dish.Price} Veg_NonVeg={dish.Veg_NonVeg} key={dish._id} id={dish._id} Restaurant={dish.Restaurant} delivery='Yes'/> */}
                                                        <HStack className='items-center justify-between py-2 rounded-lg' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>

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
                                                                    <Text className='pl-4 text-sm font-normal' allowFontScaling={false}
                                                                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                    >
                                                                        ₹{dish.Price * dish.quantity} (₹{dish.Price}x{dish.quantity})
                                                                    </Text>
                                                                    :
                                                                    <Text className='pl-4 text-sm font-normal' allowFontScaling={false}
                                                                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                    >
                                                                        ₹{dish.Price}
                                                                    </Text>
                                                                }
                                                            </VStack>


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

                                        <VStack>
                                            <View className='w-full mt-3 border-t' style={[colorScheme == 'light' ? Styles.LightHomeAdlibBorder : Styles.DarkHomeAdlibBorder]}  >
                                                <Text
                                                    allowFontScaling={false}
                                                    className="text-center text-sm mx-24 -top-3"
                                                    style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                                                >
                                                    Cooking Instructions
                                                </Text>
                                            </View>
                                            <View className='w-full rounded-lg shadow-sm' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>

                                                <HStack className='p-3 space-x-2 items-center'>
                                                    <Image
                                                        style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                        source={PenIcon}
                                                    />
                                                    {colorScheme == 'light' &&
                                                        <TextInput placeholder='Bhaiya mirchi thodi kam...' keyboardType="default" className='w-10/12 text-xs'
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
                                                            enterKeyHint='done'
                                                            onFocus={() => {
                                                                setIsLocationOpen(false)
                                                                setIsOrderTypeOpen(false)
                                                                setIsPaymentOpen(false)
                                                            }}
                                                        />
                                                    }
                                                    {colorScheme != 'light' &&
                                                        <TextInput placeholder='Bhaiya mirchi thodi kam...' keyboardType="default" className='w-10/12 text-xs'
                                                            placeholderTextColor='#a6a6a6'
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
                                                            enterKeyHint='done'
                                                            onFocus={() => {
                                                                setIsLocationOpen(false)
                                                                setIsOrderTypeOpen(false)
                                                                setIsPaymentOpen(false)
                                                            }}
                                                        />
                                                    }
                                                    {/* {colorScheme == 'light' && BasketRestaurant.name == 'Rasananda' &&
                                                        <TextInput placeholder={instructionsPlaceholders[5]} keyboardType="default" className='w-10/12 text-xs'
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
                                                            enterKeyHint='done'
                                                        />
                                                    }
                                                    {colorScheme == 'light' && BasketRestaurant.name == 'Dhaba' &&
                                                        <TextInput placeholder={instructionsPlaceholders[1]} keyboardType="default" className='w-10/12 text-xs'
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
                                                            enterKeyHint='done'
                                                        />
                                                    }
                                                    {colorScheme == 'light' && BasketRestaurant.name == 'Roti Boti' &&
                                                        <TextInput placeholder={instructionsPlaceholders[0]} keyboardType="default" className='w-10/12 text-xs'
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
                                                            enterKeyHint='done'
                                                        />
                                                    }
                                                    {colorScheme == 'light' && BasketRestaurant.name == 'Subway' &&
                                                        <TextInput placeholder={instructionsPlaceholders[2]} keyboardType="default" className='w-10/12 text-xs'
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
                                                            enterKeyHint='done'
                                                        />
                                                    }
                                                    {colorScheme == 'light' && BasketRestaurant.name == 'Chicago Pizza' &&
                                                        <TextInput placeholder={instructionsPlaceholders[6]} keyboardType="default" className='w-10/12 text-xs'
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
                                                            enterKeyHint='done'
                                                        />
                                                    }
                                                    {colorScheme == 'light' && BasketRestaurant.name == 'The Hunger Cycle' &&
                                                        <TextInput placeholder={instructionsPlaceholders[3]} keyboardType="default" className='w-10/12 text-xs'
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
                                                            enterKeyHint='done'
                                                        />
                                                    } */}
                                                </HStack>
                                            </View>
                                        </VStack>

                                        {FinalBasket.length > 1 &&
                                            <VStack>
                                                <View className='w-full mt-3 border-t ' style={[colorScheme == 'light' ? Styles.LightHomeAdlibBorder : Styles.DarkHomeAdlibBorder]}  >
                                                    <Text
                                                        allowFontScaling={false}
                                                        className="text-center text-sm mx-32 -top-3"
                                                        style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                                                    >
                                                        Outlet Bill
                                                    </Text>
                                                </View>
                                                <View className='w-full rounded-lg px-3 pt-2 pb-1 shadow-sm' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                                                    <VStack>
                                                        <HStack className='w-full justify-between py-1'>
                                                            <HStack className='space-x-1.5'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={Subtotal}
                                                                />
                                                                <Text allowFontScaling={false} className='font-medium text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                >
                                                                    Subtotal
                                                                </Text>
                                                            </HStack>
                                                            <Text allowFontScaling={false} className='font-medium text-md'
                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                            >
                                                                ₹{(Math.round(BasketRestaurant.restaurantTotal * 100) / 100).toFixed(2)}
                                                            </Text>
                                                        </HStack>
                                                        <HStack className='w-full justify-between py-1'>
                                                            <HStack className='space-x-1.5'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={Government}
                                                                />
                                                                <Text allowFontScaling={false} className='font-normal text-xs'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                >
                                                                    GST
                                                                </Text>
                                                            </HStack>
                                                            {(BasketRestaurant.name == 'Roti Boti') ?
                                                                <Text allowFontScaling={false} className='font-normal text-xs'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                >
                                                                    ₹{(Math.round(BasketRestaurant.restaurantTotal * (0.05) * 100) / 100).toFixed(2)}
                                                                </Text>
                                                                :
                                                                <Text allowFontScaling={false} className='font-normal text-xs'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                >
                                                                    0
                                                                </Text>
                                                            }
                                                        </HStack>
                                                        <HStack className='w-full  justify-between py-1 pb-2'>
                                                            <HStack className='space-x-1.5'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={DeliveryBhaiya}
                                                                />
                                                                <Text allowFontScaling={false} className='font-normal text-xs'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                >
                                                                    Delivery & Restaurant Charges
                                                                </Text>
                                                            </HStack>
                                                            <Text allowFontScaling={false} className='font-normal text-xs'
                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                            >
                                                                ₹{(Math.round(deliveryCharges[BasketRestaurant.name] * 100) / 100).toFixed(2)}
                                                            </Text>
                                                        </HStack>
                                                        <HStack className='w-full  justify-between py-2 border-t'
                                                            style={[colorScheme == 'light' ? { borderColor: 'rgb(209, 213, 219)' } : { borderColor: 'rgb(107, 114, 128)' }]}
                                                        >
                                                            <HStack className='space-x-1.5'>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                                    source={Total}
                                                                />
                                                                <Text allowFontScaling={false} className='font-semibold text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                >
                                                                    Total Amount
                                                                </Text>
                                                            </HStack>
                                                            {(BasketRestaurant.name == 'Roti Boti' || BasketRestaurant.name == 'Subway' || BasketRestaurant.name == 'Chicago Pizza') ?
                                                                <Text allowFontScaling={false} className='font-semibold text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                >
                                                                    ₹{((Math.round(BasketRestaurant.restaurantTotal * (1.18) * 100) / 100) + (Math.round(deliveryCharges[BasketRestaurant.name] * 100) / 100)).toFixed(2)}
                                                                </Text>
                                                                :
                                                                <Text allowFontScaling={false} className='font-semibold text-md'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                >
                                                                    ₹{((Math.round(BasketRestaurant.restaurantTotal * 100) / 100) + (Math.round(deliveryCharges[BasketRestaurant.name] * 100) / 100)).toFixed(2)}
                                                                </Text>
                                                            }
                                                        </HStack>
                                                    </VStack>
                                                </View>
                                            </VStack>
                                        }

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


                        {FinalBasket.length > 1 ?
                            <>
                                <VStack className='w-screen items-center'>
                                    <Text className='text-center font-medium text-md pt-6 pb-4' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                        BILL SUMMARY
                                    </Text>
                                </VStack>
                                <View className='w-11/12 self-center rounded-lg px-3 py-2 shadow-sm' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                                    <VStack>
                                        {FinalBasket.map((BasketRestaurant) => {
                                            return (
                                                <HStack className='w-full justify-between py-1'>
                                                    <HStack className='space-x-1.5'>
                                                        <Image
                                                            style={{ width: 20, height: 20, resizeMode: "contain", borderRadius: 5 }}
                                                            source={{ uri: urlFor(BasketRestaurant.image).url() }}
                                                        />
                                                        <Text allowFontScaling={false} className='font-normal text-sm'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                        >
                                                            {BasketRestaurant.name}
                                                        </Text>
                                                    </HStack>
                                                    {(BasketRestaurant.name == 'Roti Boti' || BasketRestaurant.name == 'Subway' || BasketRestaurant.name == 'Chicago Pizza') ?
                                                        <Text allowFontScaling={false} className='font-normal text-sm'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                        >
                                                            ₹{((Math.round(BasketRestaurant.restaurantTotal * (1.18) * 100) / 100) + (Math.round(deliveryCharges[BasketRestaurant.name] * 100) / 100)).toFixed(2)}
                                                        </Text>
                                                        :
                                                        <Text allowFontScaling={false} className='font-normal text-sm'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                        >
                                                            ₹{((Math.round(BasketRestaurant.restaurantTotal * 100) / 100) + (Math.round(deliveryCharges[BasketRestaurant.name] * 100) / 100)).toFixed(2)}
                                                        </Text>
                                                    }
                                                </HStack>
                                            )
                                        })}
                                        <HStack className='w-full justify-between mt-1 pt-2 pb-1 border-t'
                                            style={[colorScheme == 'light' ? { borderColor: 'rgb(209, 213, 219)' } : { borderColor: 'rgb(107, 114, 128)' }]}
                                        >
                                            <HStack className='space-x-1.5 pl-1'>
                                                <Image
                                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                    source={FinalTotal}
                                                />
                                                <Text allowFontScaling={false} className='font-semibold text-md'
                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                >
                                                    Grand Total
                                                </Text>
                                            </HStack>
                                            <Text allowFontScaling={false} className='font-semibold text-md'
                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                            >
                                                ₹{CartTotal}
                                            </Text>
                                        </HStack>
                                    </VStack>
                                </View>
                            </>
                            :
                            <VStack>
                                <Text className='text-center font-medium text-md pt-6 pb-4' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                    BILL SUMMARY
                                </Text>
                                <View className='w-11/12 self-center rounded-lg px-3 pt-2 pb-1 shadow-sm' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                                    <VStack>
                                        {FinalBasket.map((BasketRestaurant) => (
                                            <>
                                                <HStack className='w-full justify-between py-1'>
                                                    <HStack className='space-x-1.5'>
                                                        <Image
                                                            style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                            source={Subtotal}
                                                        />
                                                        <Text allowFontScaling={false} className='font-medium text-md'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                        >
                                                            Subtotal
                                                        </Text>
                                                    </HStack>
                                                    <Text allowFontScaling={false} className='font-medium text-md'
                                                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                    >
                                                        ₹{(Math.round(BasketRestaurant.restaurantTotal * 100) / 100).toFixed(2)}
                                                    </Text>
                                                </HStack>
                                                <HStack className='w-full  justify-between py-1'>
                                                    <HStack className='space-x-1.5'>
                                                        <Image
                                                            style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                            source={Government}
                                                        />
                                                        <Text allowFontScaling={false} className='font-normal text-xs'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                        >
                                                            GST
                                                        </Text>
                                                    </HStack>
                                                    {(BasketRestaurant.name == 'Roti Boti') ?
                                                        <Text allowFontScaling={false} className='font-normal text-xs'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                        >
                                                            ₹{(Math.round(BasketRestaurant.restaurantTotal * (0.05) * 100) / 100).toFixed(2)}
                                                        </Text>
                                                        :
                                                        <Text allowFontScaling={false} className='font-normal text-xs'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                        >
                                                            0
                                                        </Text>
                                                    }
                                                </HStack>
                                                <HStack className='w-full  justify-between py-1 pb-2'>
                                                    <HStack className='space-x-1.5'>
                                                        <Image
                                                            style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                            source={DeliveryBhaiya}
                                                        />
                                                        <Text allowFontScaling={false} className='font-normal text-xs'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                        >
                                                            Delivery & Restaurant Charges
                                                        </Text>
                                                    </HStack>
                                                    <Text allowFontScaling={false} className='font-normal text-xs'
                                                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                    >
                                                        ₹{(Math.round(deliveryCharges[BasketRestaurant.name] * 100) / 100).toFixed(2)}
                                                    </Text>
                                                </HStack>
                                                <HStack className='w-full  justify-between py-2 border-t'
                                                    style={[colorScheme == 'light' ? { borderColor: 'rgb(209, 213, 219)' } : { borderColor: 'rgb(107, 114, 128)' }]}
                                                >
                                                    <HStack className='space-x-1.5'>
                                                        <Image
                                                            style={{ width: 15, height: 15, resizeMode: "contain" }}
                                                            source={FinalTotal}
                                                        />
                                                        <Text allowFontScaling={false} className='font-semibold text-md'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                        >
                                                            Grand Total
                                                        </Text>
                                                    </HStack>
                                                    {(BasketRestaurant.name == 'Roti Boti' || BasketRestaurant.name == 'Subway' || BasketRestaurant.name == 'Chicago Pizza') ?
                                                        <Text allowFontScaling={false} className='font-semibold text-md'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                        >
                                                            ₹{((Math.round(BasketRestaurant.restaurantTotal * (1.05) * 100) / 100) + (Math.round(deliveryCharges[BasketRestaurant.name] * 100) / 100)).toFixed(2)}
                                                        </Text>
                                                        :
                                                        <Text allowFontScaling={false} className='font-semibold text-md'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                        >
                                                            ₹{((Math.round(BasketRestaurant.restaurantTotal * 100) / 100) + (Math.round(deliveryCharges[BasketRestaurant.name] * 100) / 100)).toFixed(2)}
                                                        </Text>
                                                    }
                                                </HStack>
                                            </>

                                        ))}
                                    </VStack>
                                </View>
                            </VStack>
                        }

                        <VStack className='w-screen items-center shadow-sm'>
                            <Text className='text-center font-medium text-md pt-6 pb-2' allowFontScaling={false} style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                CANCELLATION POLICY
                            </Text>
                            <View className='w-11/12 mt-2 p-3 rounded-lg' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                                <Text className='text-xs' allowFontScaling={false}
                                    style={[colorScheme == 'light' ? Styles.LightTextSecondary : Styles.DarkTextSecondary]}
                                >
                                    If you decide to cancel the order anytime after order placement we will take note and my be forced to suspend you from the app, if done often.
                                    Please try to avoid cancellation as it leads to food wastage.
                                </Text>
                            </View>
                        </VStack>

                        <VStack>
                            <Text
                                allowFontScaling={false}
                                className='self-center text-center font-semibold mt-16 text-md italic w-full'
                                style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                            >
                                Brought to you by
                            </Text>
                            <Text
                                allowFontScaling={false}
                                className='self-center text-center font-semibold mb-6 text-md italic w-full'
                                style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                            >
                                Aryan Yadav & Zahaan Shapoorjee
                            </Text>
                        </VStack>

                    </ScrollView>
                }
            </KeyboardAwareScrollView>


        </View>
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
        fontWeight: 400,
        fontSize: 16,
        paddingBottom: 2,
        color: 'black'
    },
    DarknameText: {
        fontWeight: 400,
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
        fontSize: 12,
        color: 'black'
    },
    DarkphoneText: {
        fontSize: 12,
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
    },
    LightDropdownButtonCart: {
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: '#FFFFFF',
    },
    DarkDropdownButtonCart: {
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: '#262626',
    },
    LightDropdownMenu: {
        width: '100%',
        borderRadius: '6px',
        borderWidth: '1px',
        borderColor: 'rgb(229,231,235)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.05,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: '100%',
    },
    DarkDropdownMenu: {
        width: '100%',
        borderRadius: '6px',
        borderTopWidth: '1px',
        borderColor: 'rgb(0,0,0)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.05,
        backgroundColor: '#262626',
        position: 'absolute',
        bottom: '100%',
    },
    LightDropdownMenu2: {
        width: '100%',
        borderRadius: '6px',
        borderWidth: '1px',
        borderColor: 'rgb(229,231,235)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.1,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: '100%',
    },
    DarkDropdownMenu2: {
        width: '100%',
        borderRadius: '6px',
        borderTopWidth: '1px',
        borderColor: 'rgb(0,0,0)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.05,
        backgroundColor: '#262626',
        position: 'absolute',
        bottom: '100%',
    },
    LightDropdownItem: {
        borderBottomWidth: '1px',
        borderColor: 'rgb(229, 231, 235)',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    DarkDropdownItem: {
        borderBottomWidth: '1px',
        borderColor: 'rgb(75, 85, 99)',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    LightDropdownItemEnd: {
        borderBottomWidth: '1px',
        borderColor: '#ffffff',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    DarkDropdownItemEnd: {
        borderBottomWidth: '1px',
        borderColor: '#262626',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
});
