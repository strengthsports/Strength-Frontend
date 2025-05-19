import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
  Vibration,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import {
  completeSignup,
  completeSignupPayload,
} from "~/reduxStore/slices/user/signupSlice";
import { vibrationPattern } from "~/constants/vibrationPattern";
import Toast from "react-native-toast-message";
import { string } from "zod";
import { setAuthState } from "~/reduxStore/slices/user/authSlice";
// import completeSignupPayload from "~/reduxStore/slices/profileSlice"

const signupSetPassword5 = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isAndroid = Platform.OS === "android";

  const { loading, email } = useSelector((state: RootState) => state.signup);

  const { username, address } = useSelector(
    (state: RootState) => state.onboarding
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const feedback = (message: string, type: "error" | "success" = "error") => {
    if (type === "error") {
      Vibration.vibrate(vibrationPattern);
      isAndroid
        ? ToastAndroid.show(message, ToastAndroid.SHORT)
        : Toast.show({
            type,
            text1: message,
            visibilityTime: 3000,
            autoHide: true,
          });
    } else {
      Toast.show({
        type,
        text1: message,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const handleNext = async () => {
    if (!password || !confirmPassword) {
      feedback("Please enter and confirm your password.", "error");
      return;
    }
    if (password !== confirmPassword) {
      feedback("Passwords do not match. Please try again.", "error");
      return;
    }
    // Check if password length is at least 8 characters
    if (password.length < 8) {
      feedback("Password must be at least 8 characters long.", "error");
      return;
    }
    const completeSignupPayload: completeSignupPayload = {
      email: email || "",
      username: username || "",
      password: password || null,
      address: address || {},
    };
    console.log("final payload data", completeSignupPayload);
    try {
      const result = await dispatch(
        completeSignup(completeSignupPayload)
      ).unwrap();

      // dispatch(setAuthState());
      feedback(result.message, "success");
      router.replace("/Signup/signupAccountCreated6");
    } catch (error) {
      console.error("Signup error:", error);
      feedback("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <PageThemeView>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 80 }}>
          <Logo />
        </View>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></View>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              gap: 20,
            }}
          >
            <View style={{ marginTop: 55 }}>
              <TextScallingFalse
                style={{ color: "white", fontSize: 23, fontWeight: "500" }}
              >
                You'll need a password
              </TextScallingFalse>
              <TextScallingFalse
                style={{ color: "white", fontSize: 12, fontWeight: "400" }}
              >
                Make sure it's 8 characters or more.
              </TextScallingFalse>
            </View>
            <View>
              <TextScallingFalse
                style={{ color: "white", fontSize: 14, fontWeight: "400" }}
              >
                Create a password
              </TextScallingFalse>
              <TextInputSection
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            </View>

            <View>
              <TextScallingFalse
                style={{ color: "white", fontSize: 14, fontWeight: "400" }}
              >
                Confirm password
              </TextScallingFalse>
              <TextInputSection
                placeholder="Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            </View>
          </View>
          <View style={{ width: "81%", alignItems: "flex-end" }}>
            <View style={{ marginTop: 6, flexDirection: "row" }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={toggleShowPassword}
              >
                <TextScallingFalse style={{ color: "#12956B", fontSize: 13 }}>
                  {showPassword ? "Hide" : "Show"} Password
                </TextScallingFalse>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginTop: 40 }}>
            {loading ? (
              <ActivityIndicator size={"small"} />
            ) : (
              <SignupButton onPress={handleNext}>
                <TextScallingFalse
                  style={{ color: "white", fontSize: 15, fontWeight: "600" }}
                >
                  Next
                </TextScallingFalse>
              </SignupButton>
            )}
          </View>
        </View>
      </ScrollView>
    </PageThemeView>
  );
};

export default signupSetPassword5;

const styles = StyleSheet.create({});
