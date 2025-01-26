import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Redirect, useRouter } from "expo-router";
import LoginScreen from "./(auth)/login";
import "../global.css";
import { verifyInstallation } from "nativewind";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import SportsChoice from "./onboarding/sportsChoice1";
import { useEffect } from "react";
import { initializeAuth } from "~/reduxStore/slices/user/authSlice";
import * as SplashScreen from "expo-splash-screen";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Index() {
  verifyInstallation();
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, status } = useSelector((state: RootState) => state.auth);
  console.log("islogin -", isLoggedIn);
  // console.log('status -', status)
  useEffect(() => {
    // Dispatch the async thunk to initialize authentication
    dispatch(initializeAuth());
  }, [dispatch]);

  // useEffect(() => {
  //   // Hide the splash screen only when authentication is initialized
  //   if (status === 1 ) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [status]);

  // if (status === 0) {
  //   // Optional: Add a placeholder while auth is initializing
  //   return null;
  // }

  if (isLoggedIn) {
    return <Redirect href="/(app)/(tabs)/home" />;
  } else {
    return <LoginScreen />;
  }
}
