// /screens/LoginScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  Vibration,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import "../../global.css";
import TextScallingFalse from "@/components/CentralText";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import logo from "@/assets/images/logo2.png";
import banner from "@/assets/images/banner-gif.gif";
import google from "@/assets/images/google.png";
import PageThemeView from "@/components/PageThemeView";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import { loginUser, resetAuthState } from "~/reduxStore/slices/user/authSlice";
import { z } from "zod";
import loginSchema from "@/schemas/loginSchema";

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const { status, error,  } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const isAndroid = Platform.OS === "android";

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prevState) => !prevState);

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
  // const e = 'anirbandutta@gmail.com';
  // const p = 'ANIRBAN@1234';

  const handleLogin = async () => {
    try {
      const loginData = loginSchema.parse({ email, password });

      // Reset state and start loading
      dispatch(resetAuthState());
      setLoading(true);

      // Dispatch login action
      const response = await dispatch(loginUser(loginData)).unwrap();

      // Feedback on success
      feedback(response.message || "Login successful!", "success");

      // router.push("/(app)/(main)/teams/InitiateCreateTeam");

      router.push("/(app)/(tabs)/home");

    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const validationError = err.errors[0]?.message || "Invalid input.";
        feedback(validationError);
      } else {
        feedback(err);
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };
  return (
    <PageThemeView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ width: "100%", paddingHorizontal: 25 }}>
          <View style={{ flexDirection: "row", marginTop: 30, gap: 7 }}>
            <Image style={{ width: 45, height: 45 }} source={logo} />
            <Text
              style={{
                color: "white",
                fontSize: 26,
                fontWeight: "500",
                marginTop: 3,
              }}
            >
              Strength
            </Text>
          </View>
        </View>

        <View style={{ width: "100%", height: "31%", marginTop: 20 }}>
          <Image source={banner} style={{ width: "100%", height: "100%" }} />
        </View>

        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 15,
          }}
        >
          <View style={{ width: "84%" }}>
            <TextScallingFalse
              style={{
                color: "white",
                fontSize: 35,
                fontWeight: "500",
                width: "80%",
              }}
            >
              Step Into the World of Sports
            </TextScallingFalse>
          </View>
        </View>

        <View style={{ width: "100%", alignItems: "center" }}>
          <View>
            <TextScallingFalse
              style={{ color: "white", fontSize: 13, fontWeight: "400" }}
            >
              Email or username
            </TextScallingFalse>
            <TextInputSection
              placeholder="example@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
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
            <SignupButton onPress={handleLogin}>
              <TextScallingFalse
                style={{ color: "white", fontSize: 14.5, fontWeight: "500" }}
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
              borderColor: "white",
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              borderRadius: 40,
            }}
          >
            <TextScallingFalse
              style={{ color: "white", fontSize: 14.5, fontWeight: "500" }}
            >
              New to Strength? Join now
            </TextScallingFalse>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
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
            <TextScallingFalse
              style={{ color: "white", fontSize: 14.5, fontWeight: "500" }}
            >
              or continue with
            </TextScallingFalse>
            <Image
              source={google}
              style={{ width: 12, height: 12, marginTop: 3.5 }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </PageThemeView>
  );
};

export default LoginScreen;
