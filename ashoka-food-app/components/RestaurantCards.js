import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { StarIcon } from "react-native-heroicons/solid";
import { MapPinIcon } from "react-native-heroicons/outline";

const RestaurantCards = ({id, image, title, genre, rating, location, description}) => {
  return (
    <TouchableOpacity className="border-4 border-gray-300 mb-3 rounded-xl mx-4 items-center">
        <Image 
        // style={{
        //     alignSelf: 'center',
        //     height: 150,
        //     width: 150,
        //     marginTop: 10
        // }} 
        source= {image} className="h-36 w-48 mt-2" resizeMode='stretch'/>
        <View className ="px-3 pb-4">
          <Text className="font-bold text-lg p-2">{title}</Text>
          <View className="flex-row items-center space-x-1">
            <StarIcon color="green"/>
            <Text className="text-green-500">{rating} </Text>
            <Text className="italic">{genre}</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <MapPinIcon color="gray"/>
            <Text className="text-xs">{location}</Text>
          </View>
          <Text className="italic mt-1">"{description}"</Text>
          </View>
      
    </TouchableOpacity>
  )
}

export default RestaurantCards