import "react-native-get-random-values";
import { Redirect } from "expo-router";
import LoginScreen from "./(auth)/login";
import "../global.css";
import { verifyInstallation } from "nativewind";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import { useEffect, useState } from "react";
import { initializeAuth } from "~/reduxStore/slices/user/authSlice";
import * as SplashScreen from "expo-splash-screen";

// Prevent the splash screen from auto-hidin
SplashScreen.preventAutoHideAsync();
if (!__DEV__) {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}
export default function Index() {
  verifyInstallation();

  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [authInitialized, setAuthInitialized] = useState(false);
  useEffect(() => {
  dispatch(initializeAuth()).then(() => {
    setAuthInitialized(true);
  });
}, [dispatch]);

  console.log("islogin -", isLoggedIn);
  useEffect(() => {
    // Dispatch the async thunk to initialize authentication
    dispatch(initializeAuth());
  }, [dispatch]);
  
  if (!authInitialized) {
  return null; // or splash screen, or loading indicator
}
  if (isLoggedIn) {
    return <Redirect href="/(app)/(tabs)/home" />;
  } else {
    return <Redirect href="/login" />;
  }
}
