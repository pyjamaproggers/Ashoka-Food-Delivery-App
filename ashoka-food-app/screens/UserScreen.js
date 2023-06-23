import React, { useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, StyleSheet, Touchable, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, ChartBarIcon, DocumentTextIcon, PowerIcon, PhoneIcon } from 'react-native-heroicons/solid';
import Verified from '../assets/verified.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styles from '../components/Styles';

export default function UserScreen() {
  const { params: { actualUser } } = useRoute();

  const colorScheme = useColorScheme();

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
    LightnameEmailPhotoContainer: {
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
    DarknameEmailPhotoContainer: {
      width: '95%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginTop: 10,
      backgroundColor: '#262626',
      borderTopLeftRadius: '20',
      borderTopRightRadius: '20',
      borderBottomRightRadius: '10',
      borderBottomLeftRadius: '10'
    },
    LightnameText: {
      fontWeight: 500,
      fontSize: 20,
      paddingBottom: 2,
      color: 'black'
    },
    DarknameText: {
      fontWeight: 500,
      fontSize: 20,
      paddingBottom: 2,
      color: 'white'
    },
    LightemailText: {
      fontSize: '12%',
      color: 'black'
    },
    DarkemailText: {
      fontSize: '12%',
      color: 'white'
    },
    LightbackButton: {
      width: "10%",
      marginLeft: 20,
      backgroundColor: 'white'
    },
    DarkbackButton: {
      width: "10%",
      marginLeft: 20,
      backgroundColor: '#262626'
    },
    LightphoneText: {
      fontSize: '12%',
      color: 'black'
    },
    DarkphoneText: {
      fontSize: '12%',
      color: 'white'
    },
    LightuserDetailsContainer: {
      width: '95%',
      justifyContent: 'center',
      paddingHorizontal: 10,
      marginTop: 10,
      backgroundColor: 'white',
      borderRadius: 10,
    },
    DarkuserDetailsContainer: {
      width: '95%',
      justifyContent: 'center',
      paddingHorizontal: 10,
      marginTop: 10,
      backgroundColor: '#262626',
      borderRadius: 10,
    },
    LightlogoutContainer: {
      justifyContent: 'center',
      paddingHorizontal: 10,
      marginTop: 10,
      backgroundColor: 'white',
      borderRadius: 10,
      top: '50%'
    },
    DarklogoutContainer: {
      justifyContent: 'center',
      paddingHorizontal: 10,
      marginTop: 10,
      backgroundColor: '#262626',
      borderRadius: 10,
      top: '50%'
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    console.log(actualUser)
  }, []);

  const navigation = useNavigation();

  return (
    <SafeAreaView className="shadow" style={[colorScheme=='light'? {backgroundColor: '#F2F2F2', flex: 1} : {backgroundColor: '#0c0c0f', flex: 1}]}>
      {/* Go back Button */}
      <TouchableOpacity onPress={navigation.goBack} className="p-2 bg-white rounded-full items-center" style={[colorScheme=='light'?styles.LightbackButton:styles.DarkbackButton]}>
        <ArrowLeftIcon size={20} style={[colorScheme=='light'?{color: 'black'}:{color: 'white'}]} />
      </TouchableOpacity>

      <View style={styles.container}>
        {/* First container of name, email, and photo */}
        <View style={colorScheme=='light'? styles.LightnameEmailPhotoContainer: styles.DarknameEmailPhotoContainer}>

          <View>
            {actualUser.hasOwnProperty('picture') ? (
              <Image style={styles.userPic} source={{ uri: actualUser.picture }} />
            ) : (
              <Image style={styles.userPic} source={userPic} />
            )}
          </View>

          <View className='flex-col self-center justify-center space-y-1 mx-2'>
            <Text style={colorScheme=='light'? styles.LightnameText: styles.DarknameText}>Hi, {actualUser.given_name}</Text>

            {/* user.phone */}
            <View className='flex-row items-center space-x-1 '>
              <Text style={colorScheme=='light'? styles.LightphoneText: styles.DarkphoneText}>{actualUser.phone}</Text>
              <Image source={Verified} style={{ width: 20, height: 20 }} />
            </View>

            <View className='flex-row items-center space-x-1 '>
              <Text style={colorScheme=='light'? styles.LightemailText: styles.DarkemailText}>{actualUser.email}</Text>
              {actualUser.verified_email == true &&
                <Image source={Verified} style={{ width: 20, height: 20 }} />
              }
            </View>
          </View>

        </View>


        {/* View Order */}
        <View style={colorScheme=='light'? styles.LightuserDetailsContainer : styles.DarkuserDetailsContainer} className=''>


          <View className="py-4" style={[colorScheme=='light'?Styles.LightUserDetailsBorder: Styles.DarkUserDetailsBorder]}>
            <TouchableOpacity>
              <View className="flex-row gap-1 items-center">
                <DocumentTextIcon color="#ff6961" className="m-5" size={15} />
                <Text style={[colorScheme=='light'? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>Check Order History</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className="py-4" style={[colorScheme=='light'?Styles.LightUserDetailsBorder: Styles.DarkUserDetailsBorder]}>
            <TouchableOpacity>
              <View className="flex-row gap-1 items-center">
                <ChartBarIcon color="#87CEEB" className="m-5" size={15} />
                <Text style={[colorScheme=='light'? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>Check Spendings</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className="py-4" style={[colorScheme=='light'?Styles.LightUserDetailsBorderLast: Styles.DarkUserDetailsBorderLast]}>
            <TouchableOpacity>
              <View className="flex-row gap-1 items-center">
                <PhoneIcon color="#3DDC84" className="m-5" size={15} />
                <Text style={[colorScheme=='light'? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>Change Phone Number</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>

        {/* Log Out  */}
        <View style={colorScheme=='light'? styles.LightlogoutContainer : styles.DarklogoutContainer}>

          <View className="py-3 mt-1 pb-3" style={[colorScheme=='light'?Styles.LightUserDetailsBorderLast: Styles.DarkUserDetailsBorderLast]}>
            <TouchableOpacity onPress={() => navigation.navigate("Login", { logout: 1 })}>
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

