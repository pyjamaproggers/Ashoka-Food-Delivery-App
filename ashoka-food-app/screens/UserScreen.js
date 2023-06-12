import React, { useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, ClockIcon, MapPinIcon, BoltIcon} from 'react-native-heroicons/solid';

export default function UserScreen() {
  const { params: { user } } = useRoute();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderColor: 'gray',
      borderWidth: 1,
    },
    userPic: {
      width: 90,
      height: 100,
      borderRadius: 100,
    },
    nameEmailPhotoContainer: {
      width: '90%',
      height: '15%',
      flexDirection: 'row',
      justifyContent: 'flex-start', // Updated to 'flex-start'
      alignItems: 'center',
      paddingHorizontal:"5%",
      paddingBottom:0,
      marginTop:"5%"
    },
    nameText: {
      fontWeight: 'bold',
      paddingBottom:"2%",
    },
    emailText: {
      fontSize: 10,
    },
    backButton: {
        position: 'absolute',
        left: 10,
      },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} className='shadow'>


        {/* Go back Button */}
        <View className="">
        <TouchableOpacity onPress={navigation.goBack} className="p-2 bg-gray-100 rounded-full" >
            <ArrowLeftIcon size={20} color="black"/>
        </TouchableOpacity>
        </View>

        {/* First container of name, email, and photo */}
      <View style={styles.nameEmailPhotoContainer} className="bg-white rounded-xl ">
        <View style={{ flex: 1 }}>
          <Text style={styles.nameText} className="text-xl">{user.given_name}</Text>
          <Text style={styles.emailText}>{user.email}</Text>
        </View>
        <View>
          {user.picture.length !== 0 ? (
            <Image style={styles.userPic} source={{ uri: user.picture }} />
          ) : (
            <Image style={styles.userPic} source={userPic} />
          )}
        </View>
      </View>
      {/* View Order */}
      <View>

      </View>
    </SafeAreaView>
  );
}
