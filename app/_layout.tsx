import "react-native-get-random-values";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Dimensions, StatusBar, View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "../global.css";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor, RootState } from "@/reduxStore";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/configs/toastConfig";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { Drawer } from "expo-router/drawer";
import CustomDrawer2 from "~/components/ui/CustomDrawer2";

SplashScreen.preventAutoHideAsync();
const { width: SCREEN_WIDTH } = Dimensions.get("window");

function AppContent() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("black");
    setAppIsReady(true);
  }, []);

  if (!appIsReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      ></View>
    );
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <PaperProvider>
        <AuthNavigation />
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <Toast config={toastConfig} />
      </PaperProvider>
    </ThemeProvider>
  );
}

function AuthNavigation() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  return isLoggedIn ? (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: SCREEN_WIDTH * 0.69,
          backgroundColor: "#000",
        },
        swipeEnabled: false,
      }}
      drawerContent={(props) => <CustomDrawer2 />}
    />
  ) : (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    Inter: require("../assets/fonts/Inter-Regular.ttf"),
    Montserrat: require("../assets/fonts/Montserrat-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContent />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
