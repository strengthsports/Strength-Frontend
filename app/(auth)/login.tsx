// /screens/LoginScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  Vibration,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import "../../global.css";
import TextScallingFalse from "@/components/CentralText";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import logo from "@/assets/images/strengthlogin.png";
import banner from "@/assets/images/banner-gif.gif";
import google from "@/assets/images/google.png";
import PageThemeView from "@/components/PageThemeView";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import {
  initializeAuth,
  loginUser,
  resetAuthState,
} from "~/reduxStore/slices/user/authSlice";
import { z } from "zod";
import loginSchema from "@/schemas/loginSchema";
import { Colors } from "~/constants/Colors";
import messaging from "@react-native-firebase/messaging";
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { loginWithGoogle } from "~/reduxStore/slices/user/authSlice";
import { setEmail } from "~/reduxStore/slices/user/signupSlice";

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const { status, error,  } = useSelector((state: RootState) => state.auth);

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false); // New state to track signing in status

  const router = useRouter();
  const isAndroid = Platform.OS === "android";

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prevState) => !prevState);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    });
  }, []);
  console.log(process.env.EXPO_PUBLIC_WEB_CLIENT_ID);

  const handleGoogleSignIn = async () => {
    try {
      if (isSigningIn) return;
      setIsSigningIn(true);

      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      console.log("Google Sign-In configured");
      const userInfo = (await GoogleSignin.signIn()) as any;
      const { idToken, user } = userInfo.data;

      // console.log("Google Sign-In user info:", userInfo);
      const { email, name, photo } = user;
      console.log("Google Sign-In user details:", {
        email,
        name,
        photo,
        idToken,
      });
      setLoading(true);

      if (email && idToken) {
        const user = {
          email,
          name,
          photo,
          idToken,
        };

        const response = await dispatch(loginWithGoogle(user)).unwrap();

        console.log("Response from Google login:", response);
        if (response?.newUser === false) {
          // ✅ User exists — continue as usual
          dispatch(initializeAuth());
          feedback("Login successful!", "success");
          router.replace("/(app)/(tabs)/home");
        } else {
          console.log("else hit");
          dispatch(setEmail(response?.email));
          // 🚀 User does not exist — redirect to signup screen with Google data
          router.push("/Signup/signupEnterUsername3");
        }
      } else {
        console.log(
          "Sign in was canceled by the user or failed with an error."
        );
      }
    } catch (error) {
      // console.log("Google Sign-In error:", error);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert("Sign in is already in progress.");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Google Play Services are not available.");
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            Alert.alert("Sign in was canceled by the user.");
        }
      } else {
        console.error("Google Sign-In error:", error);
        feedback(
          "An error occurred during Google Sign-In. Please try again.",
          "error"
        );
      }
    } finally {
      setIsSigningIn(false); // Reset the signing state whether success or failure
      setLoading(false); // Also reset loading state
    }
  };

  const feedback = (errorMsg: string, type: "error" | "success" = "error") => {
    const vibrationPattern = [0, 50, 80, 50];

    if (type === "error") {
      Vibration.vibrate(vibrationPattern);
    }

    isAndroid
      ? ToastAndroid.show(errorMsg, ToastAndroid.SHORT)
      : Toast.show({
        type,
        text1: errorMsg,
        visibilityTime: 3000,
        autoHide: true,
      });
  };

  const handleLogin = async () => {
    try {
      const loginData = id.includes("@")
        ? loginSchema.parse({ email: id, password })
        : loginSchema.parse({ username: id, password });

      // Reset state and start loading
      dispatch(resetAuthState());
      setLoading(true);

      // Dispatch login action

      const response = await dispatch(loginUser(loginData)).unwrap();
      await dispatch(initializeAuth());

      // Feedback on success
      feedback(response.message || "Login successful!", "success");

      router.replace("/(app)/(tabs)/home");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err instanceof z.ZodError) {
        const validationError = err.errors[0]?.message || "Invalid input.";
        feedback(validationError);
      } else {
        feedback(err || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };
  return (
    <PageThemeView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{ flexGrow: 1}}
        style={{ flex: 1 }}
      >
        <View
          style={{ width: "100%", paddingHorizontal: 20, paddingVertical: 8 }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: Platform.OS === 'ios' ? '' : "2%",
              gap: 7,
              alignItems: "center",
            }}
          >
            <Image style={{ width: 142, height: 35 }} source={logo} />
            {/* <TextScallingFalse
              style={{
                color: "white",
                fontSize: 24,
                fontWeight: "500",
              }}
            >
              Strength
            </TextScallingFalse> */}
          </View>
        </View>

        <View style={{ width: "100%", aspectRatio: 16 / 10, marginTop: "2%" }}>
          <Image source={banner} style={{ width: "100%", height: "100%" }} />
        </View>

        <View style={{ width: "100%", alignItems: "center" }}>
          <View style={{ width:'86%'}}>
          <TextScallingFalse
            style={{
              color: "white",
              fontSize: 32,
              fontWeight: "500",
              paddingVertical: 18,
            }}
          >
            Step Into the World of Sports
          </TextScallingFalse>
          </View>
          <View>
            <TextScallingFalse
              style={{ color: "white", fontSize: 13, fontWeight: "400" }}
            >
              Email or username
            </TextScallingFalse>
            <TextInputSection
              placeholder=""
              value={id}
              onChangeText={setId}
              autoCapitalize="none"
              cursorColor={Colors.themeColor}
            />
            <TextScallingFalse
              style={{
                color: "white",
                fontSize: 13,
                fontWeight: "400",
                marginTop: 10,
              }}
            >
              Password
            </TextScallingFalse>
            <TextInputSection
              placeholder="secured@pass"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              customStyle={{ paddingEnd: 55 }}
              cursorColor={Colors.themeColor}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={toggleShowPassword}
              style={{ position: "absolute", top: 112, left: 288 }}
            >
              <TextScallingFalse
                style={{ color: "#12956B", fontSize: 13, fontWeight: "400" }}
              >
                {showPassword ? "Hide" : "Show"}
              </TextScallingFalse>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                router.push("/Forgot_password/Forgot_Password_Enter_Email")
              }
              activeOpacity={0.5}
              style={{ marginTop: 9 }}
            >
              <TextScallingFalse
                style={{ color: "#12956B", fontSize: 13.5, fontWeight: "400" }}
              >
                Forgot password?
              </TextScallingFalse>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 27, width: "100%", alignItems: "center" }}>
          {loading ? (
            <ActivityIndicator
              size={"small"}
              style={{ paddingVertical: 11.3 }}
              color={"#12956B"}
            />
          ) : (
            <SignupButton disabled={loading} onPress={handleLogin}>
              <TextScallingFalse
                style={{ color: "white", fontSize: 14.5, fontWeight: "700" }}
              >
                Sign in
              </TextScallingFalse>
            </SignupButton>
          )}

          <TouchableOpacity
            onPress={() => router.push("/option")}
            activeOpacity={0.5}
            style={{
              width: 335,
              height: 42,
              borderWidth: 1,
              borderColor:'#EAEAEA',
              justifyContent: "center",
              alignItems: "center",
              marginTop: 14,
              borderRadius: 40,
            }}
          >
            <TextScallingFalse
              style={{ color: "white", fontSize: 14.5, fontWeight: "400" }}
            >
              New to{" "}
              <TextScallingFalse className="font-normal">
                Strength
              </TextScallingFalse>
              ?{" "}
              <TextScallingFalse className="text-white">
                Join now
              </TextScallingFalse>
            </TextScallingFalse>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={handleGoogleSignIn}
            disabled={isSigningIn}
            style={{
              width: 335,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 3,
              borderRadius: 40,
              gap: 10,
              flexDirection: "row",
            }}
          >
            <Image
              source={google}
              style={{ width: 15, height: 15, marginTop: 3.5 }}
            />
            <TextScallingFalse
              style={{ color: "white", fontSize: 16, fontWeight: "500" }}
            >
              continue with Google
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </PageThemeView>
  );
};

export default LoginScreen;
