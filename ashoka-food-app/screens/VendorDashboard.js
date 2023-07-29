import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, Linking, useColorScheme, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import Accordion from 'react-native-collapsible/Accordion';
import { Button as NativeBaseButton, HStack, VStack, Checkbox, Modal, Select, Radio, Button } from 'native-base';
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
import { ExclamationCircleIcon } from "react-native-heroicons/solid";

function VendorDashboard() {
    const route = useRoute();
    const { selectedRestaurant } = route.params;
    const navigation = useNavigation();
    const [openOrders, setOpenOrders] = useState([]);
    const [closedOrders, setClosedOrders] = useState([]);
    const [activeOpenSections, setActiveOpenSection] = useState([]);
    const [activeClosedSections, setActiveClosedSection] = useState([]);
    const [showCompleted, setShowCompleted] = useState();
    const [Refreshing, setRefreshing] = useState()
    const [showDeclineModal, setShowDeclineModal] = useState(false)
    const [declineReason, setDeclineReason] = useState('')
    const [declineItems, setDeclineItems] = useState([])


    const colorScheme = useColorScheme();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

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
                const response = await fetch(`http://172.20.10.2:8800/api/orders/${_id}/status`, {
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
                    const response = await fetch(`http://172.20.10.2:8800/api/orders/${_id}/status`, {
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
                    const response = await fetch(`http://172.20.10.2:8800/api/orders/${_id}/status`, {
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
            // const response = await fetch(`http://10.77.1.70:8800/api/orders/${selectedRestaurant}`);
            const response = await fetch(`http://172.20.10.2:8800/api/orders/${selectedRestaurant}`);
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
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [selectedRestaurant]);

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
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
                        <ArrowLeftIcon size={20} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
                    </TouchableOpacity>
                    <Text className='text-lg font-medium' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>{selectedRestaurant}</Text>
                </View>

                <HStack className='w-max space-evenly self-center space-x-2'>
                    <NativeBaseButton className='self-center' style={[showCompleted ? [colorScheme == 'light' ? Styles.LightInactiveBTN : Styles.DarkInactiveBTN] : [colorScheme == 'light' ? Styles.LightActiveBTN : Styles.DarkActiveBTN]]} variant='subtle'
                        onPress={() => {
                            setShowCompleted(false)
                        }}
                    >
                        <HStack className='items-center space-x-2'>
                            <Text allowFontScaling={false} className='font-medium text-blue-800' style={[showCompleted ? { color: 'gray' } : { color: '#7c3aed' }]}>
                                Ongoing/ चालू
                            </Text>
                        </HStack>
                    </NativeBaseButton>
                    <NativeBaseButton className='self-center' style={[showCompleted ? [colorScheme == 'light' ? Styles.LightActiveBTN : Styles.DarkActiveBTN] : [colorScheme == 'light' ? Styles.LightInactiveBTN : Styles.DarkInactiveBTN]]} variant='subtle'
                        onPress={() => {
                            setShowCompleted(true)
                        }}
                    >
                        <HStack className='items-center space-x-2'>
                            <Text allowFontScaling={false} className='font-medium text-blue-800' style={[showCompleted ? { color: '#7c3aed' } : { color: 'gray' }]}>
                                Completed / हो गये
                            </Text>
                        </HStack>
                    </NativeBaseButton>
                </HStack>

                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={Refreshing}
                            onRefresh={() => {
                                fetchOrders()
                            }}
                        />
                    }
                >
                    {openOrders && !showCompleted &&
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
                    {closedOrders && showCompleted &&
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

                </ScrollView>

            </View>
        </SafeAreaView>
    );
}

export default VendorDashboard;
