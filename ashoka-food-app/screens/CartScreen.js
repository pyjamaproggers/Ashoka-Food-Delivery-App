import { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { XCircleIcon } from 'react-native-heroicons/solid'
import { selectRestaurant } from '../reduxslices/restaurantSlice'
import { addToCart, removeFromCart, selectCartItems, selectCartTotal} from "../reduxslices/cartslice";
// import { urlFor } from '../sanity'
import AshokaLogo from '../assets/ASHOKAWHITELOGO.png';

const CartScreen = () => {
  const navigation = useNavigation()
  const restaurant = useSelector(selectRestaurant)
  const items = useSelector(selectCartItems)
  const cartTotal = useSelector(selectCartTotal)
  const deliveryFee = cartTotal > 500 ? 5 : 10

  const dispatch = useDispatch()
  const [groupedItemsInCart, setGroupedItemsInCart] = useState([])
  const [loading, setLoading] = useState(false)

  if (cartTotal === 0) navigation.goBack()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [])

  useEffect(() => {
    const groupedItems = items.reduce((results, item) => {
      ;(results[item.id] = results[item.id] || []).push(item)
      return results
    }, {})

    setGroupedItemsInCart(groupedItems)
  }, [items])

  const buttonStyle = `rounded-lg p-4 ${
    loading ? 'bg-[#3E5896]' : 'bg-gray-400'
  }`

  return (
    <SafeAreaView>
      <View className="flex-1 bg-gray-100">
        <View className="p-5 border-b border-[#3E5896] bg-white shadow-xs">
          <View>
            <Text className="text-lg font-bold text-center">Cart</Text>
            <Text className="text-center text-gray-400">
              {restaurant.title}
            </Text>
          </View>
          <TouchableOpacity
            onPress={navigation.goBack}
            className="rounded-full bg-gray-100 absolute top-3 right-5"
          >
            <XCircleIcon color="#3E5896" height={50} width={50} />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center space-x-4 px-4 py-3 bg-white my-5">
          <Image
            source={AshokaLogo}
            className="h-7 w-7 bg-gray-300 p-4 rounded-full"
          />
          <Text className="flex-1">Delivery in 15-20 min</Text>
          <TouchableOpacity>
            <Text className="text-[#3E5896]">Change</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="divide-y divide-gray-200">
          {Object.entries(groupedItemsInCart).map(([key, items]) => (
            <View
              key={key}
              className="flex-row items-center space-x-3 bg-white py-2 px-5"
            >
              <Text className="text-[#3E5896]">{items.length} x</Text>
              {/* <Image
                source={{ uri: urlFor(items[0]?.image).url() }}
                className="h-12 w-12 rounded-full"
              /> */}
              <Text className="flex-1">{items[0]?.name}</Text>
                  <Text className="text-gray-600">{items[0].price}</Text>
              <TouchableOpacity>
                <Text
                  className="text-[#00CCBB] text-xs"
                  onPress={() => dispatch(removeFromCart({ id: key }))}
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
                <Text className="text-gray-400">₹{cartTotal}</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-400">Delivery Fee</Text>
                <Text className="text-gray-400">₹{deliveryFee}</Text>
          </View>

          <View className="flex-row justify-between">
            <Text>Order Total</Text>
                <Text className="font-extrabold">₹{cartTotal + deliveryFee}</Text>
          </View>

          <TouchableOpacity
            // onPress={}
            disabled={!loading}
            className={buttonStyle}
          >
            <Text className="text-center text-white text-lg font-bold">
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default CartScreen