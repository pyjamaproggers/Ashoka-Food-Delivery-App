import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useNavigation } from '@react-navigation/native';
import { IOS, WEB, EXPO } from '@dotenv'
import AshokaLogo from '../assets/ashokauniversity.png';
import { ArrowRightIcon } from 'react-native-heroicons/outline';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const navigation = useNavigation();
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS,
    webClientId: WEB,
    expoClientId: EXPO
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      setToken(response.authentication.accessToken);
      getUserInfo();
    }
  }, [response, token]);

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      setUser(user);
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={AshokaLogo} style={styles.image} />
      </View>
      {user === null ? 
      <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
        <Text style={styles.buttonText}>Sign in with your Ashoka Email ID</Text>
      </TouchableOpacity>
      :
      <View className='items-center' style={styles.welcomeContainer} >
        <Text style={styles.welcomeText} className='pb-12'>Welcome, {user.name}!</Text>
        <TouchableOpacity style={styles.button} className="flex-row" 
          onPress={()=>{
            console.log(user);
            navigation.navigate('Home', { user })
          }}
        >
          <Text style={styles.buttonText} className='pr-2 '>
            Take me to the food
          </Text>
          <ArrowRightIcon size={20} color='white' />
        </TouchableOpacity>
      </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: '60%'
  },
  imageContainer: {
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    resizeMode: "contain",
  },
  button: {
    backgroundColor: "#3E5896", // Ashoka University primary color
    padding: 10,
    borderRadius: 5,
    top: '-5%',
    alignItems: 'center'
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  welcomeText: {
    top: '-5%',
    fontSize: 24
  },
  welcomeContainer: {
    top: '-4%'
  }
});
