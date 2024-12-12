import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const user = false; // Replace with actual auth logic.
  
  const AuthenticatedStack = () => (
    <Stack screenOptions={{ headerShown: false }}>

    </Stack>
  );

  const UnAuthenticatedStack = () => (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="unauthenticatedStack" />
      <Stack.Screen name="+not-found" />
    </Stack>
  )

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        {/* <Slot /> */}
        {/* {user ? <AuthenticatedStack /> : <UnAuthenticatedStack />} */}
        <StatusBar style="auto" />
      </Stack>

    </ThemeProvider>
  );
}

