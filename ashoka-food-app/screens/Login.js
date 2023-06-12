import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useNavigation } from '@react-navigation/native';
import { IOS, WEB, EXPO } from '@dotenv'
import AshokaLogo from '../assets/ashokauniversity.png';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const navigation = useNavigation();
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS,
    webClientId: WEB,
    expoClientId: EXPO
  });

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
      setUserInfo(user);
      navigation.navigate('Home', { user })
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={AshokaLogo} style={styles.image} />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
        <Text style={styles.buttonText}>Sign in with your Ashoka Email ID</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop:50
  },
  imageContainer: {
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    top:50
  },
  image: {
    width: "100%",
    resizeMode: "contain",
  },
  button: {
    backgroundColor: "#3E5896", // Ashoka University primary color
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
