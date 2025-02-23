import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  const [loaded, error] = useFonts({
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{
        headerTransparent: true,
        headerTintColor: "black",
        headerShadowVisible: true,
        headerTitle: "",
        drawerLabelStyle: {
          fontFamily: 'OnePieceText',
          fontSize: 16
        }
      }}>
        <Drawer.Screen
          name="exit"
          options={{
            drawerLabel: "Exit"
          }}
        />
        <Drawer.Screen
          name="index"
          options={{
            drawerItemStyle: { display: 'none' }  // This hides the index route from drawer
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}