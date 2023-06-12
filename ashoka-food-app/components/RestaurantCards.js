import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { StarIcon, ClockIcon, MapPinIcon, BoltIcon } from "react-native-heroicons/solid";
import {  } from "react-native-heroicons/outline";
import {useNavigation} from "@react-navigation/native";

const RestaurantCards = ({id, image, title, genre, timing, location, description}) => {

  const navigation = useNavigation();
  return (
    <View className='shadow'>
      <TouchableOpacity onPress={()=>{
          navigation.navigate('Restaurant', {
            id, image, title, genre, timing, location, description
          })
      }} className="bg-white mb-3 rounded-xl mx-4 ">

        <View className='flex-row place-items-start'>

          <Image source= {image} className="h-20 w-20 ml-2 rounded-full my-2" resizeMode='stretch'/>

          <View className ="px-3 ">
            <Text className="font-semibold text-md pt-2 pb-1 pl-4">
              {title}
            </Text>

            <View className="flex-row items-center space-x-1">
              <ClockIcon size={14} color="black" opacity={1}/>
              <Text className="text-xs text-gray-600">{timing}, </Text>
              <Text className="text-xs text-gray-600">{genre}</Text>
            </View>

            <View className="flex-row items-center space-x-1">
              <MapPinIcon size={14} color="black" opacity={1}/>
              <Text className="text-xs text-gray-600">{location}</Text>
            </View>

            <View className="flex-row items-center space-x-1">
              <BoltIcon size={14} color="black" opacity={1}/>
              <Text className="text-xs text-gray-600">{description}</Text>
            </View>
          </View>

        </View>
        
      </TouchableOpacity>
    </View>
  )
}

export default RestaurantCards