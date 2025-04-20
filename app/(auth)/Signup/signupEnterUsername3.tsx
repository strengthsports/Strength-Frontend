import {
  StyleSheet,
  View,
  ToastAndroid,
  Platform,
  Vibration,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import { AppDispatch, RootState } from "@/reduxStore";
import { setUsername } from "~/reduxStore/slices/user/onboardingSlice";
import Toast from "react-native-toast-message";
import { usernameSchema } from "~/schemas/profileSchema";
import { vibrationPattern } from "~/constants/vibrationPattern";
import { checkUsernameAvailability } from "~/utils/usernameCheck";

const signupEnterUsername3 = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Get username from Redux store
  const username =
    useSelector((state: RootState) => state.onboarding.username) || "";

  // Feedback function for error/success messages
  const feedback = (errorMsg: string, type: "error" | "success" = "error") => {
    if (type === "error") {
      Vibration.vibrate(vibrationPattern);
    }

    Platform.OS === "android"
      ? ToastAndroid.show(errorMsg, ToastAndroid.LONG)
      : Toast.show({
        type,
        text1: errorMsg,
        visibilityTime: 3000,
        autoHide: true,
      });
  };

  const handleUsername = (value: string) => {
    dispatch(setUsername(value)); // Update Redux store with the username
  };

  const handleNext = async () => {
    const validation = usernameSchema.safeParse({ username });
  
    if (!validation.success) {
      const errorMessage =
        validation.error.errors[0]?.message ||
        "Invalid username. Please try again.";
  
      console.log(
        "Username validation error:",
        validation.error.errors[0]?.message
      );
  
      feedback(errorMessage);
      return;
    }
  
    // 👇 Await is valid now
    const result = await checkUsernameAvailability(username);
  
    if (!result.ok || result.data?.exists) {
      feedback("This username is already taken. Try another one.");
      return;
    }
  
    // Navigate to the next screen if validation passes
    router.push("/Signup/signupEnterLocation4");
  };
  

  return (
    <PageThemeView>
      <View style={{ marginTop: 80 }}>
        <View>
          <Logo />
        </View>
      </View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <View style={{ marginTop: 55 }}>
          <TextScallingFalse
            style={{ color: "white", fontSize: 23, fontWeight: "500" }}
          >
            What should we call you?
          </TextScallingFalse>
          <View style={{ width: "83%" }}>
            <TextScallingFalse
              style={{ color: "white", fontSize: 12, fontWeight: "400" }}
            >
              Your @username is unique. You can always change it later.
            </TextScallingFalse>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <TextScallingFalse
            style={{ color: "white", fontSize: 14, fontWeight: "400" }}
          >
            Username
          </TextScallingFalse>
          <TextInputSection
            placeholder="Enter your username"
            value={username}
            onChangeText={(text) => {
              if (text.length <= 20) {
                handleUsername(text); // Update state if within limit
              }
            }}
            autoCapitalize="none"
          />
          <TextScallingFalse className="text-gray-500 text-sm mt-1 p-1">
            {username.length} / 20
          </TextScallingFalse>
        </View>
        <View style={{ marginTop: 55 }}>
          <SignupButton disabled={false} onPress={handleNext}>
            <TextScallingFalse
              style={{ color: "white", fontSize: 15, fontWeight: "500" }}
            >
              Next
            </TextScallingFalse>
          </SignupButton>
        </View>
      </View>
    </PageThemeView>
  );
};

export default signupEnterUsername3;
