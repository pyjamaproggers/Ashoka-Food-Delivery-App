import React, { useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, ChartBarIcon, DocumentTextIcon, PowerIcon  } from 'react-native-heroicons/solid';

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
      width: 100,
      height: 100,
      borderRadius: 100,
    },
    nameEmailPhotoContainer: {
      width: '95%',
      height: "17%",
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginTop: 10,
      backgroundColor: 'white',
      borderTopLeftRadius: '30 15',
      borderTopRightRadius: '15 30',
      borderBottomRightRadius: '30 15',
      borderBottomLeftRadius: '15 30'
    },
    nameText: {
      fontWeight: 500,
      fontSize: 20,
    },
    emailText: {
      fontSize: '12%',
    },
    backButton:{
        width:"10%",
        marginLeft:20,
        backgroundColor: 'white'
    },
    phoneText:{
      fontSize: '12%',
    },
    viewOrderSpendingContainer: {
        width: '95%',
        height: "10%",
        justifyContent:'center',
        paddingHorizontal: 20,
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 10,
      },
      logoutContainer:
      {
        width: '95%',
        height: "5%",
        justifyContent:'center',
        paddingHorizontal: 20,
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 10,
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

          <View className='flex-col self-center justify-center space-y-2 mx-2'>
            <Text style={styles.nameText}>Hi, {user.given_name}</Text>
            
            {/* user.phone */}
            <Text style={styles.phoneText}>+91 6969696969</Text> 

            <Text style={styles.emailText}>{user.email}</Text>
          </View>


        </View>
        {/* View Order */}
        <View style={styles.viewOrderSpendingContainer}>
            
            <View className="pb-5">
                <View className="flex-row gap-1">
                        <DocumentTextIcon  color="gray" className="m-5" size={15}/>
                        <Text>Check Order History</Text>
                    </View>
            </View>
            
            
            <View>
                <TouchableOpacity>
                    <View className="flex-row gap-1">
                        <ChartBarIcon color="gray" className="m-5" size={15}/>
                        <Text>Check Monthly Spending</Text>
                    </View>
                </TouchableOpacity>
            </View>  
            
        </View>

        {/* Log Out  */}
        <View style={styles.logoutContainer}>
                <TouchableOpacity>
                    <View className="flex-row gap-1">
                        <PowerIcon color="gray" className="m-5" size={15}/>
                        <Text>Log out</Text>
                    </View>
                </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

