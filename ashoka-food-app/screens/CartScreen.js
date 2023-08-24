import { View, Text, TouchableOpacity, ScrollView, colorScheme, useColorScheme, TextInput, FlatList, Alert } from "react-native";
import React, { useMemo, useState, useLayoutEffect, useRef, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { selectRestaurant } from "../reduxslices/restaurantSlice";
import { addToCart, removeFromCart, selectCartItems, selectCartTotal, updateCartAdd, updateCartRemove } from "../reduxslices/cartslice";
import { ArrowLeftIcon, ChevronRightIcon } from 'react-native-heroicons/solid';
import { SafeAreaView, StyleSheet, StatusBar, Image } from "react-native";
import { urlFor } from "../sanity";
import Styles from '../components/Styles.js'
import { HStack, TextArea, VStack, Alert as NativeBaseAlert, Skeleton, Spinner, Avatar } from "native-base";
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
import io from 'socket.io-client';

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

    const [latestItem, setLatestItem] = useState(null)
    const [socket, setSocket] = useState(null)
    const [restaurantData, setRestaurantData] = useState(null)

    const colors = [
        'amber.400',
        'lightBlue.400',
        'secondary.400',
        'pink.400',
        'purple.400',
        'violet.400',
        'indigo.400',
        'teal.500',
    ]

    const [userColor, setUserColor] = useState(colors[Math.floor(Math.random() * colors.length)])

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
        'Shuddh Desi Dhaba': 10.00,
        'Subway': 20.00,
        'The Food Village': 0.00,
        'The Hunger Cycle': 15.00,
        'Rasananda': 10.00,
        'Dosai': 0.00
    }

    const query = `*[_type == "restaurant"]
        { name, image, timing }`;

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
            if (items.filter((x) => (x.name == name && x.Restaurant == Restaurant)).length == 0) {
                currentQuantity = 0
                additemQ = currentQuantity + 1
                dispatch(addToCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: additemQ }));
            }
            else {
                items.map((item) => {
                    if (item.name == name && item.Restaurant == Restaurant) {
                        currentQuantity = item.quantity
                        additemQ = currentQuantity + 1
                        // dispatch(addToCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: additemQ }));
                        // dispatch(removeFromCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: currentQuantity }));
                        dispatch(updateCartAdd({ newQuantity: additemQ, dishName: item.name, restaurant: item.Restaurant }))
                    }
                })
            }
        };
    }

    const removeItem = (id, name, Price, image, Restaurant, Veg_NonVeg) => {
        Price = parseFloat(Price)
        var currentQuantity
        var additemQ
        items.map((item) => {
            if (item.name == name && item.Restaurant===Restaurant && item.quantity == 1) {
                currentQuantity = 1
                dispatch(removeFromCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: currentQuantity }));
            }
            if (item.name == name && item.Restaurant===Restaurant && item.quantity >= 1) {
                currentQuantity = item.quantity
                additemQ = currentQuantity - 1
                // dispatch(addToCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: additemQ }));
                // dispatch(removeFromCart({ id, name, Price, image, Restaurant, Veg_NonVeg, quantity: currentQuantity }));
                dispatch(updateCartRemove({ newQuantity: additemQ, dishName: item.name, restaurant: Restaurant }))
            }
        })
    }

    const connectToSocket = () => {
        const socket = io(`${IP}`, {});

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

    const checkUnavailableItems = async () => { //ChatGPT Optimised
        let checkArray = 'The following items were removed from your cart as they became unavailable:\n';

        for (const basketRestaurant of Basket) {
            try {
                const response = await fetch(`${IP}/api/items/${basketRestaurant.name}`);
                const data = await response.json();
                const fetchedUnavailableItems = data.map((item) => item.name);

                const unavailableItemsInCart = items
                    .filter((item) => fetchedUnavailableItems.includes(item.name))
                    .map((item) => item.name);

                for (const item of unavailableItemsInCart) {
                    dispatch(
                        removeFromCart({
                            id: item.id,
                            name: item.name,
                            Price: item.Price,
                            image: item.image,
                            Restaurant: item.Restaurant,
                            Veg_NonVeg: item.Veg_NonVeg,
                            quantity: 0
                        })
                    );
                }

                if (unavailableItemsInCart.length > 0) {
                    checkArray += `${unavailableItemsInCart.join(', ')} from ${basketRestaurant.name}\n`;
                }
            } catch (error) {
                console.error('Error while fetching unavailable items on cart screen: ' + error);
            }
        }

        return checkArray;
    };


    const checkRestaurantClosed = async () => {



        let checkArray = 'The following restaurants are closed:\n';
        const currentTime = new Date();
        console.log(Basket)
        for (const basketRestaurant of FinalBasket) {
            const timing = basketRestaurant.timing;
            
            console.log("Timing: " + timing);
    
            const [openTime, closeTime] = timing.includes(' To ') ? timing.split(' To ') : timing.split(' - ');
            console.log("Open Time: " + openTime);
            console.log("Close Time: " + closeTime);
    
            const openHour = parseInt(openTime.slice(0, -2));
            const openPeriod = openTime.slice(-2);
            const closeHour = parseInt(closeTime.slice(0, -2));
            const closePeriod = closeTime.slice(-2);
    
            if (openPeriod === 'PM' && openHour !== 12) {
                openHour += 12;
            }
            if (closePeriod === 'PM' && closeHour !== 12) {
                closeHour += 12;
            }
            console.log(currentTime.getHours())
            console.log(openHour)
            console.log(closeHour)
            if (closeHour < openHour) {
                console.log('coming first in timing issue')
                if (currentTime.getHours() >= openHour || currentTime.getHours() < closeHour) {
                    checkArray += basketRestaurant.name + ' (' + openTime + ' - ' + closeTime + '), ';
                }
            } 
            else {
                console.log('coming second in timing issue')
                if (!(currentTime.getHours() >= openHour && currentTime.getHours() < closeHour)) {
                    checkArray += basketRestaurant.name + ', ';
                    console.log(basketRestaurant.name)
                }
            }
        }
    
        return checkArray;
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
                return Outlet.instructions;
            }
        }
        return null; // Return null or any default value if the restaurant is not found
    };

    useMemo(async () => { //ChatGPT Optimised
        setFetching(true);

        const uniqueRestaurantSet = new Set(); // Use Set for efficient uniqueness check

        items.forEach((item) => {
            uniqueRestaurantSet.add(item.Restaurant);
        });

        const uniqueRestaurantsInCart = Array.from(uniqueRestaurantSet);

        const tempBasket = uniqueRestaurantsInCart.map((restaurantName) => ({
            name: restaurantName,
            items: [],
            instructions: '',
            timing: '',
            restaurantTotal: 0
        }));

        tempBasket.forEach((restaurantMiniCart) => {
            items.forEach((item) => {
                if (item.Restaurant === restaurantMiniCart.name) {
                    restaurantMiniCart.items.push(item);
                    restaurantMiniCart.restaurantTotal += item.Price * item.quantity;
                }
            });
        });

        let tempCartTotal = 0;

        tempBasket.forEach((basketRestaurant) => {
            let subTotal = 0;

            basketRestaurant.items.forEach((item) => {
                subTotal += item.Price * item.quantity;
            });

            let finalTotal = subTotal + deliveryCharges[basketRestaurant.name];

            if (basketRestaurant.name === 'Roti Boti') {
                finalTotal = (Math.round(finalTotal * 1.05 * 100) / 100).toFixed(2);
            }

            tempCartTotal = (Math.round((tempCartTotal + finalTotal) * 100) / 100).toFixed(2);

            basketRestaurant.restaurantTotal = subTotal;
        });

        setCartTotal(tempCartTotal);

        try {
            const data = await client.fetch(query);
            setRestaurantData(data)
            const tempFinalBasket = [...tempBasket]; // Avoid modifying the same object

            let foodVillageInCart = false;
            let dhabaThaliInCart = false

            data.forEach((restaurant) => {
                tempFinalBasket.forEach((basketRestaurant) => {
                    if (restaurant.name === basketRestaurant.name) {
                        basketRestaurant.image = restaurant.image;
                        console.log(restaurant.timing)
                        basketRestaurant.timing = restaurant.timing;
                    }
                    if (basketRestaurant.name === 'The Food Village') {
                        foodVillageInCart = true;
                    }
                    if (basketRestaurant.name === 'Shuddh Desi Dhaba') {
                        basketRestaurant.items.forEach((dish)=>{
                            if(dish.name.includes('Thali')){
                                dhabaThaliInCart = true
                            }
                        })
                    }
                });
            });

            setDeliveryOptions(
                foodVillageInCart
                    ? [
                        { location: 'RH1', icon: RH },
                        { location: 'RH2', icon: RH },
                        { location: 'RH3', icon: RH },
                        { location: 'RH4', icon: RH },
                        { location: 'RH5', icon: RH }
                    ]
                    : [
                        { location: 'RH1', icon: RH },
                        { location: 'RH2', icon: RH },
                        { location: 'RH3', icon: RH },
                        { location: 'RH4', icon: RH },
                        { location: 'RH5', icon: RH },
                        { location: 'Library AC04', icon: AC04 },
                        { location: 'Sports Block', icon: SportsBlock },
                        { location: 'Mess', icon: Mess }
                    ]
            );

            setOrderTypeOptions(
                dhabaThaliInCart ?
                [
                    { option: 'Dine In', icon: DineIn }
                ]
                :
                [
                { option: 'Delivery', icon: FoodDelivery },
                { option: 'Dine In', icon: DineIn }
                ]
            );

            setPaymentOptions([
                { option: 'Pay On Delivery', icon: COD },
                { option: 'Pay At Outlet', icon: PayAtRestaurant }
            ]);
            console.log(tempFinalBasket)
            setFinalBasket(tempFinalBasket);
            setFinalBasketReady(true);
        } catch (error) {
            console.log('Error:', error);
        }

        setFetching(false);

        // Uncomment and modify your checkUnavailableItems logic if needed
        // let itemsCheck = await checkUnavailableItems();
        // if (itemsCheck !== 'The following items were removed from your cart as they became unavailable: ') {
        //     Alert.alert(itemsCheck);
        // }
    }, [items, latestItem]);


    if (items.length == 0) { navigation.goBack() }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const sendOrderToDatabase = async (orderData) => {
        const url = `${IP}/api/orders`; // Node Server (Our backend, put the IP address as ur local IPV4 address)
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
                Alert.alert('Something failed while placing your order, please try again.')
                // Handle error scenarios if needed
            }
        } catch (error) {
            console.error("Error occurred while sending order:", error);
            Alert.alert('Something failed while placing your order, please try again.')
            // Handle error scenarios if needed
        }
    };

    // Function to calculate GST for a restaurant
    const calculateGST = (subtotal, restaurantName) => {
        if (restaurantName === 'Roti Boti') {
            return (Math.round(subtotal * 0.05 * 100) / 100);
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

        let canPlaceOrder = true
        // Iterate over the FinalBasket array
        for (const BasketRestaurant of FinalBasket) {
            // Calculate the subtotal and GST for the current restaurant
            const subtotal = BasketRestaurant.restaurantTotal;
            const gst = calculateGST(subtotal, BasketRestaurant.name);

            // Calculate the total amount with GST and delivery charges
            const totalAmount = (subtotal + gst + deliveryCharges[BasketRestaurant.name]).toFixed(2);

            if (BasketRestaurant.name === 'The Food Village' && totalAmount < 150 && OrderTypeOption === 'Delivery') {
                Alert.alert(
                    'Unable to place order. The Food Village requires an order of more than ₹150 for delivery.'
                )
                setShowSpinner(false)
                canPlaceOrder = false
            }

            // Extract item names and prices from the BasketRestaurant items
            const orderItems = BasketRestaurant.items.map(item => ({
                name: item.name,
                price: item.Price,
                quantity: item.quantity,
                customizations: item.hasOwnProperty('customizations') ? item.customizations : {}
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

        if (canPlaceOrder === false) {
            return
        }


        let itemsCheck = await checkUnavailableItems()
        let timingsCheck = await checkRestaurantClosed()

        if (itemsCheck === 'The following items were removed from your cart as they became unavailable:\n' && timingsCheck === 'The following restaurants are closed:\n') {
            // Now, you have an array of order objects, each representing an order for a different restaurant
            // Call the sendOrderToDatabase function to send the orders to the API
            for (const orderData of orders) {
                sendOrderToDatabase(orderData);
            }
            for (const item of items) {
                dispatch(removeFromCart({ id: item.id, name: item.name, Price: item.Price, image: item.image, Restaurant: item.Restaurant, Veg_NonVeg: item.Veg_NonVeg, quantity: 0 }))
            }
            navigation.navigate('LiveOrders', { actualUser });
        }
        else if (itemsCheck !== 'The following items were removed from your cart as they became unavailable:\n' && timingsCheck === 'The following restaurants are closed:\n') {
            Alert.alert(itemsCheck)
            setShowSpinner(false)
        }
        else if (itemsCheck === 'The following items were removed from your cart as they became unavailable:\n' && timingsCheck !== 'The following restaurants are closed:\n') {
            Alert.alert(timingsCheck)
            setShowSpinner(false)
        }
        else if (itemsCheck !== 'The following items were removed from your cart as they became unavailable:\n' && timingsCheck !== '\nThe following restaurants are closed:\n') {
            Alert.alert(itemsCheck)
            Alert.alert(timingsCheck)
            setShowSpinner(false)
        }

    };

    function calculateBasketTotal()
    {
        var res = 0.0
        FinalBasket.map((BasketRestaurant) => {
                if(BasketRestaurant.name == 'Roti Boti')
                {
                    // console.log(((Math.round(BasketRestaurant.restaurantTotal * (1.18) * 100) / 100) + (Math.round(deliveryCharges[BasketRestaurant.name] * 100) / 100)).toFixed(2))
                    res+=parseFloat(((Math.round(BasketRestaurant.restaurantTotal * (1.18) * 100) / 100) + (Math.round(deliveryCharges[BasketRestaurant.name] * 100) / 100)).toFixed(2))
                }
                else
                {
                    // console.log(((Math.round(BasketRestaurant.restaurantTotal * (1.18) * 100) / 100) + (Math.round(deliveryCharges[BasketRestaurant.name] * 100) / 100)).toFixed(2))
                    res+=parseFloat(((Math.round(BasketRestaurant.restaurantTotal * 100) / 100) + (Math.round(deliveryCharges[BasketRestaurant.name] * 100) / 100)).toFixed(2))
                }
            }
        )
        return res;
}

    return (
        <View className="flex-1 pt-14" style={[colorScheme == 'light' ? { backgroundColor: '#F2F2F2' } : { backgroundColor: '#0c0c0f' }]}>

            {!FinalBasketReady &&
                <VStack className='pt-8 items-center space-y-6'>
                    <Skeleton h='2' rounded='full' w='20%'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                    <Skeleton h='24' rounded='md' w='24'
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
                                                                console.log(item.option)
                                                                if(item.option=='Delivery'){
                                                                    setPaymentOption('Pay On Delivery')
                                                                }
                                                                else{
                                                                    setPaymentOption('Pay At Outlet')
                                                                }
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
                                                            console.log(item.option)
                                                            if(item.option=='Delivery'){
                                                                setPaymentOption('Pay On Delivery')
                                                            }
                                                            else{
                                                                setPaymentOption('Pay At Outlet')
                                                            }
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
                                                                if(item.option=='Delivery'){
                                                                    setPaymentOption('Pay On Delivery')
                                                                }
                                                                else{
                                                                    setPaymentOption('Pay At Outlet')
                                                                }
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
                                                            if(item.option=='Delivery'){
                                                                setPaymentOption('Pay On Delivery')
                                                            }
                                                            else{
                                                                setPaymentOption('Pay At Outlet')
                                                            }
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
                                        // setIsPaymentOpen(!isPaymentOpen)
                                        // if (isLocationOpen) {
                                        //     setIsLocationOpen(false)
                                        // }
                                        // if (isOrderTypeOpen) {
                                        //     setIsOrderTypeOpen(false)
                                        // }
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
                                onPress={() => {
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
                                                    (₹{calculateBasketTotal()})
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
                                            <Image source={{ uri: urlFor(BasketRestaurant.image).url() }} style={{ width: 100, height: 100, borderRadius: 5 }} />
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
                                                        {dish.hasOwnProperty('customizations') ?
                                                            <>
                                                                <HStack className='items-center w-11/12 justify-between py-2 rounded-lg' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>

                                                                    <VStack style={{ marginLeft: '2%' }} className='w-7/12'>
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
                                                                                ₹{(dish.Price).toFixed(2) * dish.quantity} (₹{(dish.Price).toFixed(2)}x{dish.quantity})
                                                                            </Text>
                                                                            :
                                                                            <Text className='pl-4 text-sm font-normal' allowFontScaling={false}
                                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                            >
                                                                                ₹{(dish.Price).toFixed(2)}
                                                                            </Text>
                                                                        }

                                                                        <VStack className='py-1 pl-4'>
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

                                                                    {

                                                                        <Text allowFontScaling={false} className='text-xs font-normal w-24 text-center'
                                                                            style={[colorScheme == 'light' ? { color: 'rgb(156, 163, 175)' } : { color: 'rgb(107, 114, 128)' }]}
                                                                        >
                                                                            Customizable from outlet screen
                                                                        </Text>

                                                                    }

                                                                </HStack>
                                                            </>
                                                            :
                                                            <>
                                                                <HStack className='items-center justify-between py-2 rounded-lg' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>

                                                                    <VStack style={{ marginLeft: '2%' }} className='w-7/12'>
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
                                                                                ₹{(dish.Price).toFixed(2) * dish.quantity} (₹{(dish.Price).toFixed(2)}x{dish.quantity})
                                                                            </Text>
                                                                            :
                                                                            <Text className='pl-4 text-sm font-normal' allowFontScaling={false}
                                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                            >
                                                                                ₹{(dish.Price).toFixed(2)}
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
                                                        }
                                                        {/* <DishRow name={dish.name} Price={dish.Price} Veg_NonVeg={dish.Veg_NonVeg} key={dish._id} id={dish._id} Restaurant={dish.Restaurant} delivery='Yes'/> */}
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
                                                    {colorScheme == 'light' && BasketRestaurant.name == 'Shuddh Desi Dhaba' &&
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
                                                            {(BasketRestaurant.name == 'Roti Boti') ?
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
                                    {userColor &&
                                        <Avatar bg={userColor}
                                            style={styles.userPic}
                                            source={{
                                                uri: `https://api.multiavatar.com/${actualUser.name}.png?apikey=Bvjs0QyHcCxZNe`
                                            }}>
                                            <Text className='' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                                {actualUser.given_name[0]}{actualUser.family_name[0]}
                                            </Text>
                                        </Avatar>
                                    }
                                </View>
                                <View className='flex-col space-y-1 pl-0.5'>
                                    <Text allowFontScaling={false} style={colorScheme == 'light' ? styles.LightnameText : styles.DarknameText}>
                                        {actualUser.given_name} {actualUser.family_name}
                                    </Text>

                                    {/* user.phone */}
                                    <View className='flex-row items-center space-x-1 '>
                                        <Text allowFontScaling={false} style={colorScheme == 'light' ? styles.LightphoneText : styles.DarkphoneText}>{actualUser.phone}</Text>
                                    </View>
                                    <Text className='font-medium text-xs w-10/12'
                                        allowFontScaling={false} style={[colorScheme == 'light' ? { color: 'gray' } : { color: 'gray' }]}
                                    >
                                        The delivery bhaiya will call you on this number
                                    </Text>
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
                                                    {(BasketRestaurant.name == 'Roti Boti') ?
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
                                                ₹{calculateBasketTotal()}
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
                                                    {(BasketRestaurant.name == 'Roti Boti') ?
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
                                    You will not have the option to cancel the order through the app once placed.
                                    You can directly call the outlet to ask them to decline the order from their end if do wish to cancel.
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
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    DarknameEmailPhotoContainer: {
        width: '91.666667%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 10,
        backgroundColor: '#262626',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
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
        borderWidth: 1,
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
        borderTopWidth: 1,
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
        borderRadius: 6,
        borderWidth: 1,
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
        borderRadius: 6,
        borderTopWidth: 1,
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
        borderBottomWidth: 1,
        borderColor: 'rgb(229, 231, 235)',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    DarkDropdownItem: {
        borderBottomWidth: 1,
        borderColor: 'rgb(75, 85, 99)',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    LightDropdownItemEnd: {
        borderBottomWidth: 1,
        borderColor: '#ffffff',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    DarkDropdownItemEnd: {
        borderBottomWidth: 1,
        borderColor: '#262626',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
});
