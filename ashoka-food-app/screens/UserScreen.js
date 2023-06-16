import React, { useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, StyleSheet, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, ChartBarIcon, DocumentTextIcon, PowerIcon, PhoneIcon } from 'react-native-heroicons/solid';
import Verified from '../assets/verified.png';

export default function UserScreen() {
  const { params: { user } } = useRoute();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      //   borderColor: 'gray',
      //   borderWidth: 1,
    },
    userPic: {
      width: 70,
      height: 70,
      borderRadius: 100,
    },
    nameEmailPhotoContainer: {
      width: '95%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginTop: 10,
      backgroundColor: 'white',
      borderTopLeftRadius: '20',
      borderTopRightRadius: '20',
      borderBottomRightRadius: '10',
      borderBottomLeftRadius: '10'
    },
    nameText: {
      fontWeight: 500,
      fontSize: 20,
      paddingBottom: 2
    },
    emailText: {
      fontSize: 12,
    },
    backButton: {
      width: "10%",
      marginLeft: 20,
      backgroundColor: 'white'
    },
    phoneText: {
      fontSize: 12,
    },
    userDetailsContainer: {
      width: '95%',
      justifyContent: 'center',
      paddingHorizontal: 10,
      marginTop: 10,
      backgroundColor: 'white',
      borderRadius: 10,
    },
    logoutContainer:
    {
      justifyContent: 'center',
      paddingHorizontal: 10,
      marginTop: 10,
      backgroundColor: 'white',
      borderRadius: 10,
      top: '50%'
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }} className="shadow">
      {/* Go back Button */}
      <TouchableOpacity onPress={navigation.goBack} className="p-2 bg-gray-100 rounded-full items-center" style={styles.backButton}>
        <ArrowLeftIcon size={20} color="black" />
      </TouchableOpacity>

      <View style={styles.container}>
        {/* First container of name, email, and photo */}
        <View style={styles.nameEmailPhotoContainer}>

          <View>
            {user.hasOwnProperty('picture') ? (
              <Image style={styles.userPic} source={{ uri: user.picture }} />
            ) : (
              <Image style={styles.userPic} source={{ uri: user.picture }} />
            )}
          </View>

          <View className='flex-col self-center justify-center space-y-1 mx-2 w-9/12'>
            <Text style={styles.nameText}>Hi, {user.given_name}</Text>

            {/* user.phone */}
            <View className='flex-row items-center space-x-1 '>
              <Text style={styles.phoneText}>+91 6969696969</Text>
              {user.verified_email == true &&
                <Image source={Verified} style={{ width: 20, height: 20 }} />
              }
            </View>

            <View className='flex-row items-center space-x-1 '>
              <Text style={styles.emailText}>{user.email}</Text>
              <Image source={Verified} style={{ width: 20, height: 20 }} />
            </View>
          </View>

        </View>


        {/* View Order */}
        <View style={styles.userDetailsContainer} className=''>


          <View className="py-3 mt-1 border-b-2 border-gray-200">
            <TouchableOpacity>
              <View className="flex-row gap-1 items-center">
                <DocumentTextIcon color="#ff6961" className="m-5" size={15} />
                <Text>Check Order History</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className="py-3 mt-1 border-b-2 border-gray-200">
            <TouchableOpacity>
              <View className="flex-row gap-1 items-center">
                <ChartBarIcon color="#87CEEB" className="m-5" size={15} />
                <Text>Check Spendings</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className="py-3 mt-1 pb-3 border-b-2 border-white">
            <TouchableOpacity>
              <View className="flex-row gap-1 items-center">
                <PhoneIcon color="#3DDC84" className="m-5" size={15} />
                <Text>Change Phone Number</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>

        {/* Log Out  */}
        <View style={styles.logoutContainer}>

          <View className="py-3 mt-1 pb-3 border-b-2 border-white">
            <TouchableOpacity>
              <View className="flex-row gap-1 items-center justify-center">
                <PowerIcon color="red" className="m-5" size={15} />
                <Text className='text-red-600'>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
}

