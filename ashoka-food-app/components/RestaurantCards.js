import { View, Text, Image, TouchableOpacity, StyleSheet, useColorScheme, } from 'react-native'
import React from 'react'
import { StarIcon, ClockIcon, MapPinIcon, BoltIcon } from "react-native-heroicons/solid";
import {  } from "react-native-heroicons/outline";
import {useNavigation} from "@react-navigation/native";
import { urlFor } from '../sanity';
import Styles from './Styles';

const RestaurantCards = ({id, image, title, genre, timing, location, description, dishes}) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  return (
    <View className='shadow'>
      <TouchableOpacity onPress={()=>{
          navigation.navigate('Restaurant', {
            id, image, title, genre, timing, location, description, dishes
          })
      }} className="mb-3 rounded-xl mx-4 " style={[colorScheme=='light'? Styles.LightBGSec : Styles.DarkBGSec]}>

        <View className='flex-row place-items-start w-24 h-24'>

          <Image source={{uri: urlFor(image).url()}} className="h-full w-full" resizeMode='stretch' style={styles.restaurantImage}/>

          <View className ="px-3 flex-column">
            <Text className="font-semibold text-lg pt-1 pb-1 pl-0.5" 
            style={[colorScheme=='light'? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
            >
              {title}
            </Text>

            <View className="flex-row items-center space-x-1 mb-1 w-60">
              <ClockIcon size={14} style={[colorScheme=='light'? {color: '#FF5436'} : {color: '#FF8975'}]} opacity={1}/>
              <Text className="flex-row text-xs text-gray-600"
                style={[colorScheme=='light'? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
              >
                {timing}, {genre}
              </Text>
            </View>

            <View className="flex-row items-center space-x-1 mb-1">
              <MapPinIcon size={14} style={[colorScheme=='light'? {color: '#008FFF'} : {color: '#45ADFD'}]} opacity={1}/>
              <Text className="text-xs text-gray-600" 
                style={[colorScheme=='light'? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
              >
                {location}
              </Text>
            </View>

            <View className="flex-row items-center space-x-1 mb-1">
              <BoltIcon size={14} style={[colorScheme=='light'? {color: '#FDD023'} : {color: '#F1C40F'}]} opacity={1}/>
              <Text className="text-xs text-gray-600" style={[colorScheme=='light'? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                {description}
              </Text>
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