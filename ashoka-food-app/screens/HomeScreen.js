import React, { useLayoutEffect, useState } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AshokaLogo from '../assets/ASHOKAWHITELOGO.png';
import userPic from '../assets/userAvatar.png'
import {
  UserIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsVerticalIcon,
  ChevronUpIcon
} from 'react-native-heroicons/outline';
import Restaurants from './Restaurants';

const HomeScreen = () => {
  const navigation = useNavigation();

  const [DeliveryLocation, setDeliveryLocation] = useState('RH1')
  const [isOpen, setIsOpen] = useState(false)

  const Locations=[
    {location: 'RH1'},
    {location: 'RH2'},
    {location: 'RH3'},
    {location: 'RH4'},
    {location: 'RH5'},
    {location: 'Library AC04'},
  ]

  const {
    params: { user },
  } = useRoute();
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className="bg-white pt-5">
      <View className="flex-row pb-3 items-center mx-4 space-x-2 z-50">

        <Image source={AshokaLogo} className="h-7 w-7 bg-gray-300 p-4 rounded-full" />
        <View className="flex-1">
          <Text className="font-normal text-gray-400 text-xs pl-2">Deliver to</Text>

          {/* Dropdown Menu */}

          <TouchableOpacity 
            className=' h-10 rounded-lg border border-gray-200 shadow-sm mt-1 flex-row justify-between items-center px-2'
            onPress={()=>{
              setIsOpen(!isOpen)
            }}
          >
            <Text className='text-md'>{DeliveryLocation}</Text>
            {isOpen? 
              <ChevronUpIcon size={20} color="#f87c7c" />
            :
              <ChevronDownIcon size={20} color="#f87c7c" />
            }
          </TouchableOpacity>
          {isOpen===true && 
            <View className='w-full h-36 border border-gray-200 shadow-sm rounded-md bg-white absolute ' style={styles.dropdownArea}>
                <FlatList data={Locations} renderItem={({item,index})=>{
                  return(
                      <TouchableOpacity 
                        onPress={()=>{
                          setDeliveryLocation(item.location)
                          setIsOpen(false)
                        }}
                        className='border-b border-gray-200 pl-2 py-3'
                      >
                        <Text>
                          {item.location}
                        </Text>
                      </TouchableOpacity>
                  )
                }}/>
            </View>
          }

        </View>

        <View className='flex-end'>
          <TouchableOpacity>
            {user.picture.length!==0?
              <Image style={styles.userPic} source={{uri:user.picture}} />
            :
              <Image style={styles.userPic} source={userPic}/>
            }
          </TouchableOpacity>
        </View>

      </View>

      {/* search */}
      <View className="flex-row item-center space-x-2 pb-2 mx-4 ">
        <View className="flex-row space-x-2 flex-1 bg-white p-3 border border-gray-200 shadow-sm rounded-xl">
          <MagnifyingGlassIcon color="#f87c7c" size={20} />
          <TextInput placeholder="Search for a dish or place" keyboardType="default" />
        </View>
      </View>


      <ScrollView
        className='bg-white'
        contentContainerStyle={{
          paddingBottom: 150
        }}
      >
      {/* Body */}
      <Restaurants />

      </ScrollView>

    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  dropdownArea:{
    top: '100%',
  },
  userPic:{
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: 'center'
  }
})