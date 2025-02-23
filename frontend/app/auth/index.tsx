import { StyleSheet, Button, View, TouchableOpacity, Text, ImageBackground, Image } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
const background = require("@/assets/images/onepiece_background.jpg");
const logo = require("@/assets/images/op_logo.png");

SplashScreen.preventAutoHideAsync();

export default function Auth() {

  const router = useRouter();

  const [loaded, error] = useFonts({
    'OnePieceTitle': require('@/assets/fonts/OnePieceTitle.ttf'),
    'OnePieceText': require('@/assets/fonts/OnePieceText.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const handlePress = () => {
    router.push("/main");
  }

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={background} 
        style={styles.backgroundImage}
        blurRadius={4}
      >
        <View style={styles.overlay}>
          <Image 
            source={logo} 
            style={styles.h1} 
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>FIND!</Text>

          <TouchableOpacity onPress={handlePress} style={styles.joinButton}>
            <Text style={styles.joinButtonText}>JOIN!</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // This creates the dim effect
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: {
    width: 350,
    height: 150,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10, // for Android
  },
  subtitle: {
    fontSize: 100,
    color: '#FFF',
    marginBottom: 50,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    fontFamily: "OnePieceTitle"
  },
  joinButton: {
    backgroundColor: '#FFD700', // Gold color
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#000',
    marginBottom: 20,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  joinButtonText: {
    fontSize: 24,
    color: '#000',
    fontFamily: "OnePieceText"
  },
  loginText: {
    fontSize: 18,
    color: '#FFF',
    textDecorationLine: 'underline',
  },
});