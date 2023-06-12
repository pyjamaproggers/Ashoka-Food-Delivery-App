import { View, Text, Image, TextInput, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import AshokaLogo from '../assets/ASHOKAWHITELOGO.png';
import Categories from './Categories';
import {
  UserIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsVerticalIcon,
} from "react-native-heroicons/outline" 
import Restaurants from './Restaurants';

const HomeScreen = () => {

const navigation = useNavigation();

useLayoutEffect(()=>{
    navigation.setOptions({
        headerShown: false,
    })
}, [])
  return (
    <SafeAreaView className="bg-white pt-5">

      <View className="flex-row pb-3 items-center mx-4 space-x-2 ">
        <Image
          source={AshokaLogo}
          className="h-7 w-7 bg-gray-300 p-4 rounded-full"
        />
        <View className="flex-1">
          <Text className="font-normal text-gray-400 text-xs pl-0.5">Deliver to</Text>
          <Text className="font-semibold text-lg">
            Current Location
            <ChevronDownIcon size={20} color="#f87c7c" />
          </Text>
        </View>
        <UserIcon size={35} color="#f87c7c" />
      </View>

      {/* search */}
      <View className="flex-row item-center space-x-2 pb-2 mx-4">
        <View className="flex-row space-x-2 flex-1 bg-white p-3 border border-gray-200 shadow-sm rounded-xl">
          <MagnifyingGlassIcon color="#f87c7c" size={20} />
          <TextInput
            placeholder="Search for a dish or place"
            keyboardType="default"
          />
        </View>

      </View>

      {/* Body */}

      <ScrollView className="bg-white"
      contentContainerStyle={{
        paddingBottom:100,
      }}>
        <Restaurants/>

      </ScrollView>

  </SafeAreaView>
  )
}
export default HomeScreen