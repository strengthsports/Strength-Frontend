import "react-native-get-random-values";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Dimensions, StatusBar, View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import "../global.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/reduxStore";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/configs/toastConfig";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import * as NavigationBar from "expo-navigation-bar";
import { Drawer } from "expo-router/drawer";
import CustomDrawer2 from "~/components/ui/CustomDrawer2";
import { getToken } from "~/utils/secureStore";
import { Stack } from "expo-router";

SplashScreen.preventAutoHideAsync();
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    Inter: require("../assets/fonts/Inter-Regular.ttf"),
    Montserrat: require("../assets/fonts/Montserrat-Bold.ttf"),
  });
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts and token simultaneously
        const storedToken = await getToken("accessToken");
        setToken(storedToken);
        console.log(storedToken);
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("black");
  }, []);

  if (!loaded || !isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DarkTheme}>
        <PersistGate loading={null} persistor={persistor}>
          <Provider store={store}>
            <PaperProvider>
              {token ? (
                <Drawer
                  screenOptions={{
                    headerShown: false,
                    drawerStyle: {
                      width: SCREEN_WIDTH * 0.69,
                      backgroundColor: "#000",
                    },
                  }}
                  drawerContent={(props) => <CustomDrawer2 />}
                />
              ) : (
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                />
              )}
              <StatusBar barStyle="light-content" backgroundColor="black" />
              <Toast config={toastConfig} />
            </PaperProvider>
          </Provider>
        </PersistGate>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
