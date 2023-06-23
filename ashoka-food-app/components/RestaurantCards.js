import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { StarIcon, ClockIcon, MapPinIcon, BoltIcon } from "react-native-heroicons/solid";
import {  } from "react-native-heroicons/outline";
import {useNavigation} from "@react-navigation/native";

const RestaurantCards = ({id, image, title, genre, timing, location, description, dishes}) => {

  const navigation = useNavigation();
  return (
    <View className='shadow'>
      <TouchableOpacity onPress={()=>{
          navigation.navigate('Restaurant', {
            id, image, title, genre, timing, location, description, dishes
          })
      }} className="mb-3 rounded-xl mx-4 " style={{backgroundColor: 'white'}}>

        <View className='flex-row place-items-start w-24 h-24'>

          <Image source= {image} className="h-full w-full" resizeMode='stretch' style={styles.restaurantImage}/>

          <View className ="px-3 flex-column">
            <Text className="font-semibold text-lg pt-1 pb-1 pl-0.5">
              {title}
            </Text>

            <View className="flex-row items-center space-x-1 mb-1 w-60">
              <ClockIcon size={14} color="#F04C0F" opacity={1}/>
              <Text className="flex-row text-xs text-gray-600">{timing}, {genre}</Text>
            </View>

            <View className="flex-row items-center space-x-1 mb-1">
              <MapPinIcon size={14} color="#2989D6" opacity={1}/>
              <Text className="text-xs text-gray-600">{location}</Text>
            </View>

            <View className="flex-row items-center space-x-1 mb-1">
              <BoltIcon size={14} color="#FDD023" opacity={1}/>
              <Text className="text-xs text-gray-600">{description}</Text>
            </View>
          </View>

        </View>
        
      </TouchableOpacity>
    </View>
  )
}

export default RestaurantCards

const styles=StyleSheet.create({
  restaurantImage:{
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12
  }
})