import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useNavigation} from '@react-navigation/native';
import { IOS, WEB, EXPO } from '@dotenv'

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const navigation = useNavigation();
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId : IOS,
    webClientId : WEB,
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
      navigation.navigate('Home', {user})
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <View style={styles.container}>
      {userInfo === null ? (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
      ) : (
        <Text style={styles.text}>Welcome {userInfo.name}!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});



