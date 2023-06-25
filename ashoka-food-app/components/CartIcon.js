import { useNavigation } from '@react-navigation/native'
import { View, TouchableOpacity, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { addToCart, removeFromCart, selectCartItems, selectCartTotal } from "../reduxslices/cartslice";

export default function CartIcon() {
  const items = useSelector(selectCartItems)
  const cartTotal = useSelector(selectCartTotal)
  const navigation = useNavigation()

  if (items.length === 0) return null

  return (
    <View className="absolute bottom-10 w-full z-50">
      <TouchableOpacity
        onPress={() => navigation.navigate('Cart')}
        className="mx-5 bg-[#3E5896] p-4 rounded-lg flex-row items-center space-x-1"
      >
        <Text className="text-white font-extrabold text-lg bg-[#3E5896] py-1 px-2">
          {items.length}
        </Text>
        <Text className="flex-1 text-white font-extrabold text-lg text-center">
          View Cart
        </Text>
            <Text className="text-lg text-white font-extrabold"></Text>
      </TouchableOpacity>
    </View>
  )
}