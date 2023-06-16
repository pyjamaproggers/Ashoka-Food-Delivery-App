import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useNavigation, useRoute } from '@react-navigation/native';
import { IOS, WEB, EXPO } from '@dotenv'
import AshokaLogo from '../assets/ashokauniversity.png';
import { ArrowRightIcon } from 'react-native-heroicons/outline';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loggedOut, setLoggedOut] = useState(0);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS,
    webClientId: WEB,
    expoClientId: EXPO
  });

  const {
    params: { logout:logoutParam, phone:phone},
  } = useRoute();
  console.log(phone)
  console.log("LOGOUT = "+logoutParam)
  if (logoutParam === 1 && loggedOut === 0) {
    console.log("LOGOUT TIME");
    (async () => {
      try {
        await AsyncStorage.removeItem("@user");
        setUser(null);
        setLoggedOut(1);
        navigation.navigate("Login", { logout: 0 });
      } catch (error) {
        console.log("Logout error:", error);
      }
    })();
  }

  if (phone) {
    console.log(phone + " received at top level!");
  
    const updateUserPhone = async () => {
      let actualUser = await AsyncStorage.getItem("@user");
      actualUser = JSON.parse(actualUser); // Parse the JSON string into an object
      actualUser.phone = phone;
      console.log(actualUser);
      AsyncStorage.setItem("@user", JSON.stringify(actualUser));
      console.log("Phone number added now: " + JSON.stringify(actualUser));
      navigation.navigate('Home', { actualUser });
    };
  
    updateUserPhone(); // Call the async function to update user phone number
  }

  async function handleSigninWithGoogle()
  {
    const userCheck = await AsyncStorage.getItem("@user");
    if(!userCheck)
    {
      console.log("No User...")
      if(response?.type === "success")
      {
        await getUserInfo(response.authentication.accessToken);
      }
      
    }
    else{
      const actualUser = JSON.parse(userCheck);
      console.log("There is user... and it is= " +typeof(actualUser))
      setUser(actualUser);
      setLoggedOut(0);
      if(actualUser.phone)
      {
        console.log("There is user and PHONE")
        navigation.navigate('Home', { actualUser })
      }
      else if(!actualUser.phone && phone)
      {
        console.log(phone+" received!");
        console.log("Before adding phone"+typeof(actualUser))
        actualUser['phone']=phone;
        console.log("AFTER adding phone"+typeof(actualUser))
        AsyncStorage.setItem("@user",JSON.stringify(actualUser))
        console.log("Phone number added noww: "+actualUser)
        navigation.navigate('Home', { actualUser })
      }
      else if(!actualUser.phone && !phone)
      {
        console.log("Time to get Phone")
        navigation.navigate('PhoneAuth', { actualUser })
      }
      
    }
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const getUserInfo = async (token) => {
    if(!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const actualUser = await response.json();
      setUser(actualUser);
      setLoggedOut(0);
      const storageUser = JSON.stringify(actualUser)
      AsyncStorage.setItem("@user", storageUser);
      console.log("User set to "+ actualUser);
      navigation.navigate('PhoneAuth', { actualUser })
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(()=>{
    handleSigninWithGoogle();
  }, [response])

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={AshokaLogo} style={styles.image} />
      </View>
      {user === null ? 
      <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
        <Text style={styles.buttonText}>Sign in with Ashoka email</Text>
      </TouchableOpacity>
      :
      <View className='items-center' style={styles.welcomeContainer} >
        <Image source={{uri: user.picture}}/>
        <Text style={styles.welcomeText} className='pb-12'>Succesfully signed in as {user.name}!</Text>
        <TouchableOpacity style={styles.button} className="flex-row" 
        onPress={()=>{
          setLoggedOut(0);
          navigation.navigate('PhoneAuth', { user })
        }}
        >
          <Text style={styles.buttonText} className='pr-2 '>
            Verify Phone Number
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
