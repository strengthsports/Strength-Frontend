import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import "../global.css";
import { Provider } from "react-redux";
import store from "@/reduxStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        {/* Configure Stack Navigator */}
        <Stack
          screenOptions={{
            headerShown: false, // Disable headers globally
            animation: "none",  // Disable default animations globally
          }}
        >
          {/* Default screens */}
          <Stack.Screen name="(tabs)" />

          {/* Modal configuration */}
          <Stack.Screen
           name="(auth)/Signup/[modal]/index"
           options={{
           presentation: "modal",
           headerShown: false,
           animation: "slide_from_bottom",
           gestureEnabled: true,
           }} />

        </Stack>
        <StatusBar style="auto" />
      </Provider>
    </ThemeProvider>
  );
}
