import { StyleSheet, TouchableOpacity, View, Text, Platform, Vibration, ToastAndroid } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import { completeSignup } from "~/reduxStore/slices/signupSlice";
import { vibrationPattern } from "~/constants/vibrationPattern";
import Toast from "react-native-toast-message";

const signupSetPassword5 = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isAndroid = Platform.OS === "android";

  const email = useSelector((state: RootState) => state.signup.email);
  console.log("email:", email)

  const { username, address } = useSelector((state: RootState) => state.profile);

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
    const payload = {
      email,
      username,
      password,
      address,
    };
    console.log(payload);
    try {
      const result = await dispatch(completeSignup(payload)).unwrap();
      feedback(result.message, "success");
      router.push("/Signup/signupAccountCreated6");
    } catch (error) {
      console.error("Signup error:", error);
      feedback("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <PageThemeView>
      <View style={{ marginTop: 80 }}>
        <Logo />
      </View>
      <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
        <View style={{ width: "81.5%", marginTop: 55 }}>
          <TextScallingFalse style={{ color: "white", fontSize: 23, fontWeight: "500" }}>
            You'll need a password
          </TextScallingFalse>
          <TextScallingFalse style={{ color: "white", fontSize: 12, fontWeight: "400" }}>
            Make sure it's 8 characters or more.
          </TextScallingFalse>
        </View>
      </View>
      <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
        <View style={{ marginTop: 21, justifyContent: "center", alignItems: "center", gap: 20 }}>
          <View>
            <TextScallingFalse style={{ color: "white", fontSize: 14, fontWeight: "400" }}>
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
            <TextScallingFalse style={{ color: "white", fontSize: 14, fontWeight: "400" }}>
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
            <TouchableOpacity activeOpacity={0.5} onPress={toggleShowPassword}>
              <TextScallingFalse style={{ color: "#12956B", fontSize: 13 }}>
                {showPassword ? "Hide" : "Show"} Password
              </TextScallingFalse>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 40 }}>
          <SignupButton onPress={handleNext}>
            <TextScallingFalse style={{ color: "white", fontSize: 15, fontWeight: "500" }}>
              Next
            </TextScallingFalse>
          </SignupButton>
        </View>
      </View>
    </PageThemeView>
  );
};

export default signupSetPassword5;

const styles = StyleSheet.create({});
