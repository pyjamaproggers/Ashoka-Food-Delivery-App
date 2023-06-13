import React, { useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';

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
      width: 90,
      height: 100,
      borderRadius: 100,
    },
    nameEmailPhotoContainer: {
      width: '90%',
      height: 150,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginTop: 10,
      backgroundColor: 'white',
      borderRadius: 10,
    },
    nameText: {
      fontWeight: 'bold',
      paddingBottom: 2,
      fontSize: 20,
    },
    emailText: {
      fontSize: 10,
    },
    backButton:{
        width:"10%",
        marginLeft:20
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
            <Text style={styles.nameText}>{user.given_name}</Text>
            <Text style={styles.emailText}>{user.email}</Text>
          </View>
          <View>
            {user.picture.length !== 0 ? (
              <Image style={styles.userPic} source={{ uri: user.picture }} />
            ) : (
              <Image style={styles.userPic} source={{ uri: user.picture }} />
            )}
          </View>
        </View>
        {/* View Order */}
        <View></View>
      </View>
    </SafeAreaView>
  );
}
