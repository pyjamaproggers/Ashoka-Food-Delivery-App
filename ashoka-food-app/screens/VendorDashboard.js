import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, Linking, useColorScheme, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import Accordion from 'react-native-collapsible/Accordion';
import { Button as NativeBaseButton, HStack, VStack, Checkbox, Modal, Select, Radio, Slide, Alert } from 'native-base';
import Styles from '../components/Styles';
import ChevronUp from '../assets/chevronupicon.png';
import ChevronDown from '../assets/chevrondownicon.png';
import Delivery from '../assets/deliverybhaiya.png';
import Chef from '../assets/chef.png';
import Siren from '../assets/siren.png';
import Tick from '../assets/verified.png';
import FoodReady from '../assets/foodready.png';
import { ScrollView } from 'react-native';
import Phone from '../assets/phoneicon.png';
import TickCross from '../assets/tickcross.png';
import Cross from '../assets/cross.png';
import Cross2 from '../assets/cross2.png'
import { ExclamationCircleIcon, XCircleIcon } from "react-native-heroicons/solid";
import { XMarkIcon } from "react-native-heroicons/outline";
import Search from '../assets/searchicon.png'
import client from '../sanity'
import VegIcon from '../assets/vegicon.png';
import NonVegIcon from '../assets/nonvegicon.png';
import { useNetInfo } from "@react-native-community/netinfo";
import io from 'socket.io-client';

function VendorDashboard() {
    const route = useRoute();
    const { selectedRestaurant } = route.params;
    const navigation = useNavigation();
    const netInfo = useNetInfo()

    const [openOrders, setOpenOrders] = useState([]);
    const [closedOrders, setClosedOrders] = useState([]);

    const [activeOpenSections, setActiveOpenSection] = useState([]);
    const [activeClosedSections, setActiveClosedSection] = useState([]);

    const [showClosed, setShowClosed] = useState(false);
    const [showOpen, setShowOpen] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    const [Refreshing, setRefreshing] = useState()
    const [Fetching, setFetching] = useState()

    const [showDeclineModal, setShowDeclineModal] = useState(false)
    const [declineReason, setDeclineReason] = useState('')
    const [declineItems, setDeclineItems] = useState([])

    const [SearchedText, setSearchedText] = useState('')
    const [Menu, setMenu] = useState([])
    const [SearchedMenu, setSearchedMenu] = useState([])
    const [checkedItems, setCheckedItems] = useState([])
    const [unavailableItems, setUnavailableItems] = useState([])
    const [fetchedUnavailableItems, setFetchedUnavailableItems] = useState([])
    const [socket, setSocket] = useState(null);
    const [latestOrder, setLatestOrder] = useState(null);

    const colorScheme = useColorScheme();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const connectToSocket = () => {
        const socket = io('http://10.77.1.70:8800', {
        });

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        socket.on('newOrder', (order) => {
            console.log('New order received:', order);
            if(order.Restaurant===selectedRestaurant)
            {
                setLatestOrder(order);
            }
        });

        socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        setSocket(socket);
    };

    useEffect(() => {
        if (latestOrder) {
            fetchOrders();
        }
    }, [latestOrder]);

    const changeStatus = async (_id, orderStatus) => {
        try {
            // console.log(`http://10.77.1.70:8800/api/orders/${_id}/status`)
            // const response = await fetch(`http://10.77.1.70:8800/api/orders/${_id}/status`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ status: orderStatus }),
            // });
            if (orderStatus != 'Declined') {
                const response = await fetch(`http://10.77.1.70:8800/api/orders/${_id}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: orderStatus }),
                });
                if (response.ok) {
                    fetchOrders()
                }

                if (!response.ok) {
                    Alert.alert(
                        'Something went wrong. Try Again. '
                    );
                }

            }

            if (orderStatus == 'Declined') {
                if (declineReason == 'Closing Time') {
                    const response = await fetch(`http://10.77.1.70:8800/api/orders/${_id}/status`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            status: orderStatus + ': ' + `${declineReason}`
                        }),
                    });
                    if (response.ok) {
                        fetchOrders()
                    }

                    if (!response.ok) {
                        Alert.alert(
                            'Something went wrong. Try Again. '
                        );
                    }
                }
                else {
                    const response = await fetch(`http://10.77.1.70:8800/api/orders/${_id}/status`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            status: orderStatus + ' because ' + `${declineReason}` + ' - ' + `${declineItems}`
                        }),
                    });
                    if (response.ok) {
                        fetchOrders()
                    }

                    if (!response.ok) {
                        Alert.alert(
                            'Something went wrong. Try Again. '
                        );
                    }
                }

            }

            // Update the local state with the new order status
            // const updatedOrders = orders.map(order => {
            //     if (order._id === _id) {
            //         return {
            //             ...order,
            //             orderStatus: orderStatus,
            //         };
            //     }
            //     return order;
            // });
            // setOrders(updatedOrders);

        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const fetchOrders = async () => {
        setRefreshing(true)
        try {
            const response = await fetch(`http://10.77.1.70:8800/api/orders/${selectedRestaurant}`);
            // const response = await fetch(`http://172.20.10.2:8800/api/orders/${selectedRestaurant}`);
            const data = await response.json();
            var tempClosedOrders = []
            var tempOpenOrders = []
            data.map((order, index) => {
                if (order.orderStatus == 'completed' || order.orderStatus.includes('Declined')) {
                    tempClosedOrders.push(order)
                }
                else {
                    tempOpenOrders.push(order)
                }
            })
            setOpenOrders(tempOpenOrders.reverse())
            setClosedOrders(tempClosedOrders)
            setRefreshing(false)
        } catch (error) {
            console.error('Error fetching orders:', error);
            setRefreshing(false)
        }
    };

    const fetchUnavailableItems = async (tempCheckedItems) => {
        setRefreshing(true)
        try {
            const response = await fetch(`http://10.77.1.70:8800/api/orders/${selectedRestaurant}`);
            // const response = await fetch(`http://172.20.10.2:8800/api/items/${selectedRestaurant}`);
            const data = await response.json();
            var TempFetchedUnavailableItems = []
            if (data) {
                data.map((item, index) => {
                    TempFetchedUnavailableItems.push(item.name)
                })
                setFetchedUnavailableItems(TempFetchedUnavailableItems)
                setUnavailableItems(TempFetchedUnavailableItems)
                var finalCheckedItems = tempCheckedItems.filter(x => TempFetchedUnavailableItems.indexOf(x) === -1);
                setCheckedItems(finalCheckedItems)
            }
            else {
                setCheckedItems(tempCheckedItems)
            }
            setRefreshing(false)
        } catch (error) {
            console.error('Error fetching orders:', error);
            setRefreshing(false)
        }
    }

    const updateCheckedItems = (UncheckedItems) => {
        console.log(UncheckedItems)
        var finalCheckedItems = checkedItems.filter(x => UncheckedItems.indexOf(x) === -1);
        setCheckedItems(finalCheckedItems)
    }

    const fetchDishes = (query) => {
        // setFetching(true)

        client
            .fetch(query)
            .then((data) => {
                var Dishes = []
                var tempCheckedItems = []
                var i
                for (i = 0; i < data.length; i++) {
                    if (data[i].name == selectedRestaurant) {
                        Dishes = [...new Set(data[i].dishes)]
                    }
                }
                for (i = 0; i < Dishes.length; i++) {
                    tempCheckedItems.push(Dishes[i].name)
                }
                setMenu(Dishes)
                fetchUnavailableItems(tempCheckedItems);
                // setFetching(false)
            })
            .catch((error) => {
                console.log('Error:', error); // Log any errors that occur
            });

    }

    const updateMenu = async (unavailableItems) => {
        // console.log(unavailableItems)
        // console.log(selectedRestaurant)

        var itemsToAdd = []
        var itemsToRemove = []

        for (i = 0; i < unavailableItems.length; i++) {
            if (fetchedUnavailableItems.includes(unavailableItems[i]) == false) {
                itemsToAdd.push(unavailableItems[i])
            }
        }

        for (i = 0; i < fetchedUnavailableItems.length; i++) {
            if (unavailableItems.includes(fetchedUnavailableItems[i]) == false) {
                itemsToRemove.push(fetchedUnavailableItems[i])
            }
        }
        // console.log('*ASBASKASOU*')
        // console.log(itemsToAdd)
        // console.log(itemsToRemove)

        for (const item of itemsToAdd) {
            // const url = "http://172.20.10.2:8800/api/items";
            const url = "http://10.77.1.70:8800/api/items";
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: item,
                        restaurant: selectedRestaurant
                    }),
                });
            } catch (error) {
                console.error("Error while executing updateOrder")
            }
        }

        for (const item of itemsToRemove) {
            // const url = "http://172.20.10.2:8800/api/items";
            const url = "http://10.77.1.70:8800/api/items";
            try {
                const response = await fetch(url, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: item,
                        restaurant: selectedRestaurant
                    }),
                });
            } catch (error) {
                console.error("Error while executing updateOrder")
            }
        }

        fetchUnavailableItems(checkedItems);
    }

    const segregateDishes = (searched) => {
        var TempSearchedMenu = []
        Menu.map((item, index) => {
            if (item.name.includes(searched)) {
                TempSearchedMenu.push(item)
            }
        })
        console.log('*******')
        console.log(TempSearchedMenu)
        setSearchedMenu(TempSearchedMenu)
    }

    const query = `*[_type == "restaurant"]
        {description, location, delivery,
        name, image, genre, timing, Veg_NonVeg, CostForTwo, RestaurantPhone,
        dishes[]->{name, Veg_NonVeg, Price, image, Menu_category, Restaurant ,_id}}`;

    useEffect(() => {
        fetchOrders();
        fetchDishes(query);
    }, [selectedRestaurant]);

    useEffect(() => {
        connectToSocket();
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    const _renderHeader = (section, _, isActive) => {
        return (
            <HStack className='mt-3 shadow-sm items-center justify-between px-3'
                style={[colorScheme == 'light' ? [isActive == true ? Styles.LightActiveAccordionButton : Styles.LightInactiveAccordionButton] : [isActive == true ? Styles.DarkActiveAccordionButton : Styles.DarkInactiveAccordionButton]]}
            >
                <HStack className='items-center space-x-3'>
                    {section.orderStatus == 'placed' &&
                        <ExclamationCircleIcon size={20} />
                    }
                    {section.orderStatus == 'accepted' &&
                        <Image
                            style={{ width: 20, height: 20, resizeMode: "contain" }}
                            source={Siren}
                        />
                    }
                    {section.orderStatus == 'preparing' &&
                        <Image
                            style={{ width: 20, height: 20, resizeMode: "contain" }}
                            source={Chef}
                        />
                    }
                    {section.orderStatus == 'out for delivery' &&
                        <Image
                            style={{ width: 20, height: 20, resizeMode: "contain" }}
                            source={Delivery}
                        />
                    }
                    {section.orderStatus == 'ready' &&
                        <Image
                            style={{ width: 20, height: 20, resizeMode: "contain" }}
                            source={FoodReady}
                        />
                    }
                    {section.orderStatus == 'completed' &&
                        <Image
                            style={{ width: 20, height: 20, resizeMode: "contain" }}
                            source={Tick}
                        />
                    }
                    {section.orderStatus.includes('Declined') &&
                        <Image
                            style={{ width: 20, height: 20, resizeMode: "contain" }}
                            source={Cross}
                        />
                    }
                    <VStack className='space-y-1 py-2'>
                        <Text className='font-bold text-lg'
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            {section.name}
                        </Text>
                        <Text className='font-medium text-base'
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            {section.orderDate}
                        </Text>
                    </VStack>

                </HStack>
                {isActive ?
                    <Image
                        style={{ width: 12, height: 12, resizeMode: "contain" }}
                        source={ChevronUp}
                    />
                    :
                    <Image
                        style={{ width: 12, height: 12, resizeMode: "contain" }}
                        source={ChevronDown}
                    />
                }
            </HStack>
        );
    }
    const _renderContent = (section) => {
        {
            return (
                <>
                    <VStack className='space-y-1 px-2 pt-1 pb-2 shadow-sm'
                        style={[colorScheme == 'light' ? { backgroundColor: '#ffffff', borderBottomRightRadius: 10, borderBottomLeftRadius: 10 } : { backgroundColor: '#262626', borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }]}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                Linking.openURL(`tel:${section.phone}`)
                            }}
                        >
                            <NativeBaseButton className='w-3/6 self-center my-1' colorScheme='blue' variant='subtle' style={{ borderRadius: 7.5 }}>
                                <HStack className='items-center space-x-2'>
                                    <Text className='font-medium text-blue-800'>
                                        Call / फ़ोन कॉल
                                    </Text>
                                    <Image
                                        style={{ width: 20, height: 20, resizeMode: "contain", }}
                                        source={Phone}
                                    />
                                </HStack>
                            </NativeBaseButton>
                        </TouchableOpacity>
                        <Text className='font-semibold text-lg'
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            Items / खाना :
                        </Text>
                        {section.orderItems.map((item, index) => (
                            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text className='font-semibold text-base' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                >
                                    {item.name} x{item.quantity}
                                </Text>
                                <Text className='font-semibold text-base' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                >
                                    ₹{item.price} (x{item.quantity})
                                </Text>
                            </View>
                        ))}
                        <Text className='font-normal text-base pt-1 '
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            Type / किस प्रकार का : {section.orderType}
                        </Text>
                        {section.orderType == 'Delivery' &&
                            <Text className='font-normal text-base'
                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                            >
                                Location / जगह : {section.deliveryLocation}
                            </Text>
                        }
                        <Text className='font-normal text-base '
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            Amount / देय राशि : ₹{section.orderAmount}
                        </Text>
                        <Text className='font-normal text-base '
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            Payment / भुगतान ज़रिया : {section.payment}
                        </Text>
                        <Text className='font-normal text-base'
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            Instructions / निर्देश : '{section.orderInstructions}'
                        </Text>
                        {section.orderStatus == 'placed' && // orderStatus == placed
                            <VStack>
                                <Text className='self-center py-1 font-medium text-base'
                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                >
                                    Status / स्थिति : Order Placed
                                </Text>
                                <HStack className='w-full justify-evenly px-3 py-1'>
                                    <NativeBaseButton isDisabled={showDeclineModal} colorScheme='green' variant='subtle' style={{ borderRadius: 7.5 }} onPress={() => changeStatus(section._id, "accepted")}>
                                        Accept/स्वीकार
                                    </NativeBaseButton>
                                    <NativeBaseButton colorScheme='red' variant='subtle' style={{ borderRadius: 7.5 }} onPress={() => setShowDeclineModal(!showDeclineModal)}>
                                        Decline/अस्वीकार
                                    </NativeBaseButton>
                                </HStack>

                                {showDeclineModal &&
                                    <VStack className='w-full justify-end my-1'>
                                        <Text className='text-base font-medium self-center'
                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                        >
                                            Reason / वजह
                                        </Text>
                                        <View className='w-9/12 self-center pt-1'>
                                            <Radio.Group value={declineReason} onChange={nextValue => {
                                                setDeclineReason(nextValue);
                                            }}>
                                                <Radio size='sm' colorScheme='danger' value="Closing Time" my={2}
                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                >
                                                    <Text className='text-md font-medium'
                                                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                    >
                                                        Closing Time / दुकान बंद
                                                    </Text>
                                                </Radio>
                                                <Radio size='sm' colorScheme='danger' value="Item(s) Unavailable" my={2}
                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                >
                                                    <Text className='text-md font-medium'
                                                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                    >
                                                        Item(s) Unavailable / चीज ख़तम
                                                    </Text>
                                                </Radio>
                                            </Radio.Group>
                                        </View>
                                        {declineReason == 'Closing Time' &&
                                            <View className='w-4/6 self-center mt-2'>
                                                <NativeBaseButton colorScheme='red' variant='subtle' style={{ borderRadius: 7.5 }}
                                                    onPress={() => changeStatus(section._id, "Declined")}
                                                >
                                                    Decline/अस्वीकार
                                                </NativeBaseButton>
                                            </View>
                                        }
                                        {declineReason == 'Item(s) Unavailable' &&
                                            <View className='w-4/6 self-center py-2'>
                                                <VStack>
                                                    <Text className='text-base font-medium self-center'
                                                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                    >
                                                        Select Items
                                                    </Text>
                                                    <Checkbox.Group onChange={setDeclineItems} value={declineItems}>
                                                        {section.orderItems.map((item, index) => (
                                                            <Checkbox colorScheme="danger" value={item.name} my={2}
                                                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                size='sm'
                                                            >
                                                                <Text className='text-md font-medium'
                                                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                                >
                                                                    {item.name}
                                                                </Text>
                                                            </Checkbox>
                                                        ))}
                                                    </Checkbox.Group>
                                                    {declineItems.length > 0 &&
                                                        <View className='w-4/6 self-center mt-2'>
                                                            <NativeBaseButton colorScheme='red' variant='subtle' style={{ borderRadius: 7.5 }}
                                                                onPress={() => changeStatus(section._id, "Declined")}
                                                            >
                                                                Decline/अस्वीकार
                                                            </NativeBaseButton>
                                                        </View>
                                                    }
                                                </VStack>
                                            </View>
                                        }
                                    </VStack>
                                }

                            </VStack>
                        }
                        {section.orderStatus.includes('Declined') && //change to -> orderStatus ==  declined by restaurant
                            <VStack>
                                <Text className='self-center py-1 font-medium text-base'
                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                >
                                    Status / स्थिति : {section.orderStatus.slice(0, 8)}
                                </Text>
                                <Text className='self-center py-1 font-medium text-base'
                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                >
                                    Reason / वजाह : {section.orderStatus.slice(17)}
                                </Text>
                            </VStack>
                        }
                        {section.orderStatus == 'accepted' && //change to -> orderStatus ==  accepted by restaurant
                            <VStack>

                                <Text className='self-center py-1 font-medium text-base'>
                                    Status / स्थिति : Accepted
                                </Text>

                                <HStack className='w-full justify-evenly px-3 py-1'>
                                    <NativeBaseButton isDisabled={true} colorScheme='green' variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Accept/स्वीकार
                                    </NativeBaseButton>
                                    <NativeBaseButton isDisabled={true} colorScheme='red' variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Decline/अस्वीकार
                                    </NativeBaseButton>
                                </HStack>



                                <HStack className='w-full justify-evenly px-3 py-1'>
                                    <NativeBaseButton colorScheme='yellow' variant='subtle' style={{ borderRadius: 7.5 }} onPress={() => changeStatus(section._id, "preparing")}>
                                        Preparing/बना रहे हैं
                                    </NativeBaseButton>
                                </HStack>
                            </VStack>
                        }
                        {section.orderStatus == 'preparing' && section.orderType == 'Delivery' && // change to -> orderStatus ==  preparing
                            <VStack>

                                <Text className='self-center py-1 font-medium text-base'>
                                    Status / स्थिति : Preparing / बना रहे हैं
                                </Text>

                                <HStack className='w-full justify-evenly px-3 py-1'>
                                    <NativeBaseButton isDisabled={true} colorScheme='green' variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Accept/स्वीकार
                                    </NativeBaseButton>
                                    <NativeBaseButton isDisabled={true} colorScheme='red' variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Decline/अस्वीकार
                                    </NativeBaseButton>
                                </HStack>

                                <HStack className='w-full justify-evenly px-3 py-1'>
                                    <NativeBaseButton colorScheme='yellow' isDisabled={true} variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Preparing/बना रहे हैं
                                    </NativeBaseButton>
                                </HStack>

                                <HStack className='w-full justify-evenly px-3 py-1'>
                                    <NativeBaseButton colorScheme='blue' variant='subtle' style={{ borderRadius: 7.5 }} onPress={() => changeStatus(section._id, "out for delivery")}>
                                        Out For Delivery/डिलिवरी रस्ते मेई
                                    </NativeBaseButton>
                                </HStack>
                            </VStack>
                        }

                        {section.orderStatus == 'preparing' && section.orderType == 'Dine In' && // change to-> orderStatus ==  preparing
                            <VStack>

                                <Text className='self-center py-1 font-medium text-base'>
                                    Status / स्थिति : Preparing / बना रहे हैं
                                </Text>

                                <HStack className='w-full justify-evenly px-3 py-1'>
                                    <NativeBaseButton isDisabled={true} colorScheme='green' variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Accept/स्वीकार
                                    </NativeBaseButton>
                                    <NativeBaseButton isDisabled={true} colorScheme='red' variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Decline/अस्वीकार
                                    </NativeBaseButton>
                                </HStack>

                                <HStack className='w-full justify-evenly px-3 py-1'>
                                    <NativeBaseButton colorScheme='yellow' isDisabled={true} variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Preparing/बना रहे हैं
                                    </NativeBaseButton>
                                </HStack>

                                <HStack className='w-full justify-evenly px-3 py-1'>
                                    <NativeBaseButton colorScheme='blue' variant='subtle' style={{ borderRadius: 7.5 }} onPress={() => changeStatus(section._id, "ready")}>
                                        Ready/तैयार
                                    </NativeBaseButton>
                                </HStack>
                            </VStack>
                        }

                        {section.orderStatus == 'out for delivery' && section.orderType == 'Delivery' && // change to -> orderStatus ==  out for delivery
                            <VStack>

                                <Text className='self-center py-1 font-medium text-base'>
                                    Status / स्थिति : Preparing / बना रहे हैं
                                </Text>

                                <HStack className='w-full justify-evenly px-3 py-1'>
                                    <NativeBaseButton isDisabled={true} colorScheme='green' variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Accept/स्वीकार
                                    </NativeBaseButton>
                                    <NativeBaseButton isDisabled={true} colorScheme='red' variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Decline/अस्वीकार
                                    </NativeBaseButton>
                                </HStack>

                                <HStack className='w-full justify-evenly px-3 py-1'>
                                    <NativeBaseButton colorScheme='yellow' isDisabled={true} variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Preparing/बना रहे हैं
                                    </NativeBaseButton>
                                </HStack>

                                <HStack className='w-full justify-evenly px-3 py-1'>
                                    <NativeBaseButton colorScheme='blue' isDisabled={true} variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Out For Delivery/डिलिवरी रस्ते मेई
                                    </NativeBaseButton>
                                </HStack>

                                <HStack className='w-full justify-evenly px-3 py-0.5'>
                                    <NativeBaseButton colorScheme='green' variant='subtle' style={{ borderRadius: 7.5 }} onPress={() => changeStatus(section._id, "completed")}>
                                        Completed/पुरा होगया
                                    </NativeBaseButton>
                                </HStack>
                            </VStack>
                        }

                        {section.orderStatus == 'ready' && section.orderType == 'Dine In' && // change to-> orderStatus ==  ready
                            <VStack>

                                <Text className='self-center py-1 font-medium text-base'>
                                    Status / स्थिति : Preparing / बना रहे हैं
                                </Text>

                                <HStack className='w-full justify-evenly px-3 py-1'>
                                    <NativeBaseButton isDisabled={true} colorScheme='green' variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Accept/स्वीकार
                                    </NativeBaseButton>
                                    <NativeBaseButton isDisabled={true} colorScheme='red' variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Decline/अस्वीकार
                                    </NativeBaseButton>
                                </HStack>

                                <HStack className='w-full justify-evenly px-3 py-1'>
                                    <NativeBaseButton colorScheme='yellow' isDisabled={true} variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Preparing/बना रहे हैं
                                    </NativeBaseButton>
                                </HStack>

                                <HStack className='w-full justify-evenly px-3 py-1'>
                                    <NativeBaseButton colorScheme='blue' isDisabled={true} variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Ready/तैयार
                                    </NativeBaseButton>
                                </HStack>

                                <HStack className='w-full justify-evenly px-3 py-0.5'>
                                    <NativeBaseButton colorScheme='green' variant='subtle' style={{ borderRadius: 7.5 }} onPress={() => changeStatus(section._id, "completed")}>
                                        Completed/पुरा होगया
                                    </NativeBaseButton>
                                </HStack>
                            </VStack>
                        }
                    </VStack>
                </>
            )
        }
    };

    const setOpenSections = (sections) => {
        setActiveOpenSection(sections.includes(undefined) ? [] : sections);
    };
    const setClosedSections = (sections) => {
        setActiveClosedSection(sections.includes(undefined) ? [] : sections);
    };

    return (
        <SafeAreaView style={[colorScheme == 'light' ? { flex: 1, backgroundColor: '#f2f2f2' } : { flex: 1, backgroundColor: '#000000' }]}>
            <View style={{ flex: 1, padding: 16 }}>


                <Slide in={!netInfo.isConnected} placement="top">
                    <Alert justifyContent="center" status="error" safeAreaTop={10}>
                        <Text className='text-base pt-2 font-semibold '>
                            No Internet
                        </Text>
                    </Alert>
                </Slide>


                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => {navigation.goBack();if(socket) {
                socket.disconnect();}}} style={{ width: 56 }}>
                        <ArrowLeftIcon size={20} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
                    </TouchableOpacity>
                    <Text className='text-lg font-medium' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>{selectedRestaurant}</Text>
                    <NativeBaseButton className='self-center' style={[(!showOpen && showMenu && !showClosed) ? [colorScheme == 'light' ? Styles.LightActiveGreenBTN : Styles.DarkActiveGreenBTN] : [colorScheme == 'light' ? Styles.LightInactiveBTN : Styles.DarkInactiveBTN]]} variant='subtle'
                        onPress={() => {
                            updateMenu(unavailableItems)
                        }}
                        isDisabled={fetchedUnavailableItems === unavailableItems}
                    >
                        <HStack className='items-center space-x-2'>
                            <Text allowFontScaling={false} className='font-medium' style={[showMenu ? { color: '#16a34a' } : { color: 'gray' }]}>
                                Save
                            </Text>
                        </HStack>
                    </NativeBaseButton>

                </View>

                <HStack className='w-max justify-between items-center space-x-2'>

                    <NativeBaseButton className='w-4/12 justify-self-start' style={[(showOpen && !showMenu && !showClosed) ? [colorScheme == 'light' ? Styles.LightActivePurpleBTN : Styles.DarkActivePurpleBTN] : [colorScheme == 'light' ? Styles.LightInactiveBTN : Styles.DarkInactiveBTN]]} variant='subtle'
                        onPress={() => {
                            setShowClosed(false)
                            setShowOpen(true)
                            setShowMenu(false)
                        }}
                    >
                        <VStack className='items-center justify-center text-center'>
                            <Text allowFontScaling={false} className='font-medium text-blue-800' style={[showOpen ? { color: '#7c3aed' } : { color: 'gray' }]}>
                                Ongoing
                            </Text>
                            <Text allowFontScaling={false} className='font-medium ' style={[showOpen ? { color: '#7c3aed' } : { color: 'gray' }]}>
                                चालू
                            </Text>
                        </VStack>
                    </NativeBaseButton>

                    <NativeBaseButton className='w-3/12 self-center' style={[(!showOpen && showMenu && !showClosed) ? [colorScheme == 'light' ? Styles.LightActivePurpleBTN : Styles.DarkActivePurpleBTN] : [colorScheme == 'light' ? Styles.LightInactiveBTN : Styles.DarkInactiveBTN]]} variant='subtle'
                        onPress={() => {
                            setShowClosed(false)
                            setShowOpen(false)
                            setShowMenu(true)
                        }}
                    >
                        <VStack className='items-center justify-center text-center'>
                            <Text allowFontScaling={false} className='font-medium text-blue-800' style={[showMenu ? { color: '#7c3aed' } : { color: 'gray' }]}>
                                Menu
                            </Text>
                            <Text allowFontScaling={false} className='font-medium text-blue-800' style={[showMenu ? { color: '#7c3aed' } : { color: 'gray' }]}>
                                मेनू
                            </Text>
                        </VStack>
                    </NativeBaseButton>

                    <NativeBaseButton className='w-4/12 justify-self-end' style={[(!showOpen && !showMenu && showClosed) ? [colorScheme == 'light' ? Styles.LightActivePurpleBTN : Styles.DarkActivePurpleBTN] : [colorScheme == 'light' ? Styles.LightInactiveBTN : Styles.DarkInactiveBTN]]} variant='subtle'
                        onPress={() => {
                            setShowClosed(true)
                            setShowOpen(false)
                            setShowMenu(false)
                        }}
                    >
                        <VStack className='items-center space-x-2'>
                            <Text allowFontScaling={false} className='font-medium text-blue-800' style={[showClosed ? { color: '#7c3aed' } : { color: 'gray' }]}>
                                Completed
                            </Text>
                            <Text allowFontScaling={false} className='font-medium text-blue-800' style={[showClosed ? { color: '#7c3aed' } : { color: 'gray' }]}>
                                हो गये
                            </Text>
                        </VStack>
                    </NativeBaseButton>

                </HStack>

                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={Refreshing}
                            onRefresh={() => {
                                fetchOrders()
                                fetchDishes(query)
                            }}
                        />
                    }
                >
                    {openOrders && !showClosed &&
                        <View>
                            <Accordion
                                activeSections={activeOpenSections}
                                sections={openOrders}
                                touchableComponent={TouchableOpacity}
                                expandMultiple={true}
                                renderHeader={_renderHeader}
                                renderContent={_renderContent}
                                duration={100}
                                onChange={setOpenSections}
                            />
                        </View>
                    }
                    {closedOrders && showClosed &&
                        <View>
                            <Accordion
                                activeSections={activeClosedSections}
                                sections={closedOrders}
                                touchableComponent={TouchableOpacity}
                                expandMultiple={true}
                                renderHeader={_renderHeader}
                                renderContent={_renderContent}
                                duration={100}
                                onChange={setClosedSections}
                            />
                        </View>
                    }
                    {showMenu && Menu &&
                        <VStack className='pt-3 space-y-2'>
                            <View className="flex-row item-center ">
                                <View className="self-center flex-row flex-1 p-3 shadow-sm" style={[colorScheme == 'light' ? Styles.LightSearchBar : Styles.DarkSearchBar]}>
                                    <HStack>
                                        <Image
                                            style={{ width: 16, height: 16, resizeMode: "contain", }}
                                            source={Search}
                                        />
                                        {colorScheme == 'light' &&
                                            <TextInput placeholder="Dish name..." keyboardType="default" className='w-full'
                                                style={{ color: '#000', marginLeft: 8, marginRight: -8 }}
                                                onChangeText={(text) => {
                                                    if (text) {
                                                        segregateDishes(text)
                                                    }
                                                    else {
                                                        setSearchedMenu([])
                                                    }
                                                }}
                                                enterKeyHint='done'
                                            />
                                        }
                                        {colorScheme != 'light' &&
                                            <TextInput placeholder="Dish name..." keyboardType="default" className='w-full'
                                                style={{ color: '#fff', marginLeft: 8, marginRight: -8 }}
                                                onChangeText={(text) => {
                                                    if (text) {
                                                        segregateDishes(text)
                                                    }
                                                    else {
                                                        setSearchedMenu([])
                                                    }
                                                }}
                                                enterKeyHint='done'
                                            />
                                        }
                                    </HStack>
                                </View>
                            </View>

                            {(Menu && SearchedMenu.length == 0) &&
                                <Checkbox.Group onChange={setUnavailableItems} value={unavailableItems}>
                                    {Menu.map((item, index) => (
                                        <View className='w-full'>
                                            <Checkbox colorScheme="danger" value={item.name} my={2}
                                                size='md'
                                                style={[unavailableItems.includes(item.name) ? [colorScheme=='light'? {backgroundColor: '#fb7185', borderColor: '#fb7185'} : {backgroundColor: '#fda4af', borderColor: '#fda4af'} ] : {backgroundColor: '#86efac', borderColor: '#86efac'} ]}
                                                icon={<XMarkIcon style={{width: 16, height: 16, padding: 8, color: '#000'}}/>
                                                // <Image source={Cross2} style={{ width: 16, height: 16 }} />
                                            }
                                            >
                                                <HStack className='w-11/12 justify-between pr-2'>
                                                    <HStack className='space-x-2 items-center'>
                                                        {item.Veg_NonVeg === "Veg" ? (
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
                                                        <Text className='font-medium text-base'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                        >
                                                            {item.name}
                                                        </Text>
                                                    </HStack>
                                                    <Text className='text-base font-medium'
                                                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                    >
                                                        ₹{item.Price}
                                                    </Text>
                                                </HStack>
                                            </Checkbox>
                                        </View>
                                    ))}
                                </Checkbox.Group>
                            }

                            {(Menu && SearchedMenu.length > 0) &&
                                <Checkbox.Group onChange={setUnavailableItems} value={unavailableItems}>
                                    {SearchedMenu.map((item, index) => (
                                        <View className='w-full'>
                                            <Checkbox colorScheme="dark" value={item.name} my={2}
                                                size='lg'
                                                icon={<Image source={Cross} style={{ width: 20, height: 20 }} />}
                                            >
                                                <HStack className='w-11/12 justify-between pr-2'>
                                                    <HStack className='space-x-2 items-center'>
                                                        {item.Veg_NonVeg === "Veg" ? (
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
                                                        <Text className='font-medium text-base'
                                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                        >
                                                            {item.name}
                                                        </Text>
                                                    </HStack>
                                                    <Text className='text-base font-medium'
                                                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                                    >
                                                        ₹{item.Price}
                                                    </Text>
                                                </HStack>
                                            </Checkbox>
                                        </View>
                                    ))}
                                </Checkbox.Group>
                            }

                        </VStack>
                    }

                </ScrollView>

            </View>
        </SafeAreaView>
    );
}

export default VendorDashboard;