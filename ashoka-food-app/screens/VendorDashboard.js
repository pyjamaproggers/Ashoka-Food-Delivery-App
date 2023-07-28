import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, Linking, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import Accordion from 'react-native-collapsible/Accordion';
import { Button as NativeBaseButton, HStack, VStack } from 'native-base';
import Styles from '../components/Styles';
import ChevronUp from '../assets/chevronupicon.png';
import ChevronDown from '../assets/chevrondownicon.png';
import Delivery from '../assets/deliverybhaiya.png';
import Chef from '../assets/chef.png';
import Siren from '../assets/siren.png';
import Tick from '../assets/verified.png';
import { ScrollView } from 'react-native';
import Phone from '../assets/phoneicon.png';

function VendorDashboard() {
    const route = useRoute();
    const { selectedRestaurant } = route.params;
    const navigation = useNavigation();
    const [orders, setOrders] = useState([]);
    const [activeSections, setActiveSection] = useState([]);
    const [showCompleted, setShowCompleted] = useState();

    const colorScheme = useColorScheme();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const changeStatus = async (_id, orderStatus) => {
      try {
        console.log(`http://10.77.1.70:8800/api/orders/${_id}/status`)
        const response = await fetch(`http://10.77.1.70:8800/api/orders/${_id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: orderStatus }), 
        });
    
        if (!response.ok) {
          throw new Error('Failed to update order status.');
        }
    
        // Update the local state with the new order status
        const updatedOrders = orders.map(order => {
          if (order._id === _id) {
            return {
              ...order,
              orderStatus: orderStatus,
            };
          }
          return order;
        });
        setOrders(updatedOrders);
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    };
    
    


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://10.77.1.70:8800/api/orders/${selectedRestaurant}`);
                // const response = await fetch(`http://192.168.15.44:8800/api/orders/${selectedRestaurant}`);
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [selectedRestaurant]);

    const _renderHeader = (section, _, isActive) => {
        return (
            <HStack className='mt-3 shadow-sm items-center justify-between px-3'
                style={[colorScheme == 'light' ? [isActive == true ? Styles.LightActiveAccordionButton : Styles.LightInactiveAccordionButton] : [isActive == true ? Styles.DarkActiveAccordionButton : Styles.DarkInactiveAccordionButton]]}
            >
                <HStack className='items-center space-x-3'>
                    {section.orderStatus == 'placed' &&
                        <Image
                            style={{ width: 20, height: 20, resizeMode: "contain" }}
                            source={Siren}
                        />
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
                            source={Tick}
                        />
                    }
                    <VStack className='space-y-1 py-2'>
                        <Text className='font-bold text-base'
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            {section.name}
                        </Text>
                        <Text className='font-medium text-md'
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            {section.phone}
                        </Text>
                        <Text className='font-medium text-md'
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
                    <VStack className='space-y-1 px-2 pt-1 pb-2'
                        style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}
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
                        <Text className='font-semibold text-base'
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            Items / खाना :
                        </Text>
                        {section.orderItems.map((item, index) => (
                            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text className='font-semibold text-md'>{item.name} x{item.quantity}</Text>
                                <Text className='font-semibold text-md'>Rs.{item.price} (x{item.quantity})</Text>
                            </View>
                        ))}
                        <Text className='font-normal text-md pt-1 '
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            Type / किस प्रकार का : {section.orderType}
                        </Text>
                        {section.orderType == 'Delivery' &&
                            <Text className='font-normal text-md'
                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                            >
                                Location / जगह : {section.deliveryLocation}
                            </Text>
                        }
                        <Text className='font-normal text-md '
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            Amount / देय राशि : {section.orderAmount}
                        </Text>
                        <Text className='font-normal text-md '
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            Payment / भुगतान ज़रिया : {section.payment}
                        </Text>
                        <Text className='font-normal text-md'
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            Instructions / निर्देश : '{section.orderInstructions}'
                        </Text>
                        {section.orderStatus == 'placed' && // orderStatus == placed
                            <HStack className='w-full justify-evenly px-3 py-1'>
                                <NativeBaseButton colorScheme='yellow' variant='subtle' style={{ borderRadius: 7.5 }} onPress={() => changeStatus(section._id, "accepted")}>
                                    Accept/स्वीकार
                                </NativeBaseButton>
                                <NativeBaseButton colorScheme='red' variant='subtle' style={{ borderRadius: 7.5 }} onPress={() => changeStatus(section._id, "declined")}>
                                    Decline/अस्वीकार
                                </NativeBaseButton>
                            </HStack>
                        }
                        {section.orderStatus == 'declined' && //change to -> orderStatus ==  declined by restaurant
                            <VStack>
                                <Text className='self-center py-1 font-medium text-md'>
                                    Currently / स्थिति : Declined
                                </Text>

                                <HStack className='w-full justify-evenly px-3 py-1'>
                                    <NativeBaseButton isDisabled={true} colorScheme='green' variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Accept/स्वीकार
                                    </NativeBaseButton>
                                    <NativeBaseButton isDisabled={true} colorScheme='red' variant='subtle' style={{ borderRadius: 7.5 }}>
                                        Decline/अस्वीकार
                                    </NativeBaseButton>
                                </HStack>
                            </VStack>
                        }
                        {section.orderStatus == 'accepted' && //change to -> orderStatus ==  accepted by restaurant
                            <VStack>

                                <Text className='self-center py-1 font-medium text-md'>
                                    Currently / स्थिति : Accepted
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

                                <Text className='self-center py-1 font-medium text-md'>
                                    Currently / स्थिति : Preparing / बना रहे हैं
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

                                <Text className='self-center py-1 font-medium text-md'>
                                    Currently / स्थिति : Preparing / बना रहे हैं
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

                                <Text className='self-center py-1 font-medium text-md'>
                                    Currently / स्थिति : Preparing / बना रहे हैं
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

                                <Text className='self-center py-1 font-medium text-md'>
                                    Currently / स्थिति : Preparing / बना रहे हैं
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

    const setSections = (sections) => {
        setActiveSection(sections.includes(undefined) ? [] : sections);
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
                    <TouchableOpacity
                        onPress={() => {
                            setShowCompleted(false)
                        }}
                    >
                        <NativeBaseButton className='self-center' colorScheme='violet' variant='subtle' style={{ borderRadius: 7.5 }}>
                            <HStack className='items-center space-x-2'>
                                <Text allowFontScaling={false} className='font-medium text-blue-800'>
                                    Ongoing/ चालू
                                </Text>
                            </HStack>
                        </NativeBaseButton>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setShowCompleted(true)
                        }}
                    >
                        <NativeBaseButton className='self-center' colorScheme='violet' variant='subtle' style={{ borderRadius: 7.5 }}>
                            <HStack className='items-center space-x-2'>
                                <Text allowFontScaling={false} className='font-medium text-blue-800'>
                                    Completed / हो गये
                                </Text>
                            </HStack>
                        </NativeBaseButton>
                    </TouchableOpacity>
                </HStack>
                <ScrollView>

                    <View>
                        <Accordion
                            activeSections={activeSections}
                            sections={orders}
                            touchableComponent={TouchableOpacity}
                            expandMultiple={true}
                            renderHeader={_renderHeader}
                            renderContent={_renderContent}
                            duration={100}
                            onChange={setSections}
                        />
                    </View>

                </ScrollView>

            </View>
        </SafeAreaView>
    );
}

export default VendorDashboard;
