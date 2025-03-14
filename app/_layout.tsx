import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import "../global.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/reduxStore";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/configs/toastConfig";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

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
    <GestureHandlerRootView>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <PersistGate loading={null} persistor={persistor}>
          <Provider store={store}>
            <PaperProvider>
              {/* <Slot /> */}
              <Stack
                screenOptions={{ headerShown: false, animation: "fade" }}
              />
              <StatusBar backgroundColor="black" />
              <Toast config={toastConfig} />
            </PaperProvider>
          </Provider>
        </PersistGate>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
