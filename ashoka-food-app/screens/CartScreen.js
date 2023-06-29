import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useMemo, useState, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { selectRestaurant } from "../reduxslices/restaurantSlice";
import { addToCart, removeFromCart, selectCartItems, selectCartTotal} from "../reduxslices/cartslice";
import { XCircleIcon } from "react-native-heroicons/solid";
import { SafeAreaView, StyleSheet, StatusBar, Image } from "react-native";
import { urlFor } from "../sanity";
import AshokaLogo from '../assets/ASHOKAWHITELOGO.png';

const BasketScreen = () => {
  const restaurant = useSelector(selectRestaurant);
  const navigation = useNavigation();
  const items = useSelector(selectCartItems);
  const [groupedItemsInBasket, setGroupedItemsInBasker] = useState([]);
  const dispatch = useDispatch();
  const cartTotal = parseFloat(useSelector(selectCartTotal))
  const deliveryFee = cartTotal > 500.00 ? 5.00 : 2.00
  const totalAmount = cartTotal+deliveryFee
  useMemo(() => {
    const groupedItems = items.reduce((results, item) => {
      (results[items.id] = results[items.id] || []).push(item);
      return results;
    }, {});
    setGroupedItemsInBasker(groupedItems);
  }, [items]);

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    })
}, [])

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
        <View className="flex-row items-center space-x-4 px-4 py-3 bg-white my-5">
          <Image
            source={{
              uri: "https://links.papareact.com/wru",
            }}
            className="h-7 w-7 bg-gray-300 p-4 rounded-full"
          />
          <Text className="flex-1">Delivery in 10-20 mins</Text>
          <TouchableOpacity>
            <Text className="text-[#3E5896]">Change</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="divide-y divide-gray-200">
        <ScrollView className="divide-y divide-gray-200">
          {Object.entries(groupedItemsInBasket).map(([key, items]) => (
            items.map((item, index) => (
              <View
                key={`${key}-${index}`}
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
            ))
          ))}
        </ScrollView>

    </ScrollView>


        <View className="p-5 bg-white space-y-4">
          <View className="flex-row justify-between">
            <Text className="text-gray-400">Subtotal</Text>
                <Text className="text-gray-400">₹{cartTotal}</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-400">Delivery Fee</Text>
                <Text className="text-gray-400">₹{deliveryFee}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text>Order Total</Text>
                <Text className="font-extrabold">₹{totalAmount}</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Preparing")}
            className="rounded-lg bg-[#3E5896] p-4"
          >
            <Text className="text-center text-white text-lg font-bold">
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
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

