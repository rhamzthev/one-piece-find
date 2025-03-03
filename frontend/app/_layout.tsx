import { OnePieceProvider } from '@/context/OnePieceContext';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <OnePieceProvider>
      <Stack>
        <Stack.Screen 
          name="main" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="collect" 
          options={{ headerShown: false }} 
        />
      </Stack>
    </OnePieceProvider>
  );
}
