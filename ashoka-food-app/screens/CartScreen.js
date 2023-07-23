import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useMemo, useState, useLayoutEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { selectRestaurant } from "../reduxslices/restaurantSlice";
import { addToCart, removeFromCart, selectCartItems, selectCartTotal } from "../reduxslices/cartslice";
import { XCircleIcon } from "react-native-heroicons/solid";
import { SafeAreaView, StyleSheet, StatusBar, Image } from "react-native";
import { urlFor } from "../sanity";
import AshokaLogo from '../assets/ASHOKAWHITELOGO.png';

const BasketScreen = () => {
    const { params: { actualUser, Basket } } = useRoute();
    console.log(Basket)
    const restaurant = useSelector(selectRestaurant);
    const navigation = useNavigation();
    const items = useSelector(selectCartItems);
    const [groupedItemsInBasket, setGroupedItemsInBasket] = useState([]);
    const dispatch = useDispatch();

    useMemo(() => {
        const groupedItems = items.reduce((results, item) => {
            (results[item.Restaurant] = results[item.Restaurant] || []).push(item);
            return results;
        }, {});
        setGroupedItemsInBasket(groupedItems);
    }, [items]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const sendOrderToDatabase = async (groupedItems, restaurantName) => {
        const url = ""; // Node Server

        const orderData = {
            phone: actualUser.phone,
            email: actualUser.email,
            name: actualUser.name,
            groupedItemsInBasket: groupedItems,
            restaurant: restaurantName,
            orderDate: new Date().toISOString(), // Adding the date and time of the order
        };
        console.log(orderData);

        // try {
        //   const response = await fetch(url, {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(orderData),
        //   });

        //   if (response.ok) {
        //     console.log("Order sent successfully!");
        //     // Perform any actions after a successful order submission if needed
        //   } else {
        //     console.error("Failed to send order!");
        //     // Handle error scenarios if needed
        //   }
        // } catch (error) {
        //   console.error("Error occurred while sending order:", error);
        //   // Handle error scenarios if needed
        // }
    };

    return (
        <SafeAreaView style={styles.container} className="flex-1 bg-white">
            <View className="flex-1 bg-gray-100">
                <View className="p-5 border-b border-[#3E5896] bg-white shadow-xs">
                    <Image
                        source={AshokaLogo}
                        className="h-10 w-10 bg-gray-300 p-4 rounded-full"
                    />
                    <View>
                        <Text className="text-lg font-bold text-center">Cart</Text>
                        <Text className="text-gray-400 text-center">
                            {restaurant.title}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={navigation.goBack}
                        className="rounded-full bg-gray100 absolute top-3 right-5"
                    >
                        <XCircleIcon color="#3E5896" height={50} width={50} />
                    </TouchableOpacity>
                </View>

                {Object.entries(groupedItemsInBasket).map(([restaurantName, items]) => {
                    const orderTotal = items.reduce((total, item) => {
                        return total + parseFloat(item.Price);
                    }, 0);

                    const deliveryFee = orderTotal > 500.0 ? 5.0 : 2.0;
                    const totalAmount = orderTotal + deliveryFee;

                    return (
                        <ScrollView key={restaurantName} className="divide-y divide-gray-200">
                            <ScrollView className="divide-y divide-gray-200">
                                {items.map((item, index) => (
                                    <View
                                        key={`${restaurantName}-${index}`}
                                        className="flex-row items-center space-x-3 bg-white py-2 px-5"
                                    >
                                        <Text className="flex-1">{item.name}</Text>
                                        <Text className="text-gray-400">₹{item.Price}</Text>
                                        <TouchableOpacity>
                                            <Text
                                                className="text-[#3E5896] text-xs"
                                                onPress={() => dispatch(removeFromCart({ id: item.id }))}
                                            >
                                                Remove
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>

                            <View className="p-5 bg-white space-y-4">
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-400">Subtotal</Text>
                                    <Text className="text-gray-400">₹{orderTotal.toFixed(2)}</Text>
                                </View>

                                <View className="flex-row justify-between">
                                    <Text className="text-gray-400">Delivery Fee</Text>
                                    <Text className="text-gray-400">₹{deliveryFee.toFixed(2)}</Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text>Order Total</Text>
                                    <Text className="font-extrabold">₹{totalAmount.toFixed(2)}</Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => sendOrderToDatabase(items, restaurantName)}
                                    className="rounded-lg bg-[#3E5896] p-4"
                                >
                                    <Text className="text-center text-white text-lg font-bold">
                                        Place Order
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    );
                })}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
});

export default BasketScreen;
