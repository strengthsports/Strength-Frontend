import { StyleSheet, View, ToastAndroid, Platform, Vibration } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import { AppDispatch, RootState } from "@/reduxStore";
import { setUsername } from "@/reduxStore/slices/profileSlice";
import Toast from "react-native-toast-message";
import { usernameSchema } from "~/schemas/profileSchema";

const signupEnterUsername3 = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Get username from Redux store
  const username = useSelector((state: RootState) => state.profile.username) || "";

  // Feedback function for error/success messages
  const feedback = (errorMsg: string, type: "error" | "success" = "error") => {
    const vibrationPattern = [0, 50, 80, 50];

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

const handleNext = () => {
  const validation = usernameSchema.safeParse({ username });
  if (!validation.success) {
    const errorMessage = validation.error.errors[0]?.message || "Invalid username. Please try again.";

    console.log("Username validation error:", validation.error.errors[0]?.message);

    feedback(errorMessage);
    return;
  }
  // Navigate to the next screen if validation passes
  router.push("/Signup/signupEnterLocation4");
  console.log("Correct format - ",username);
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
            onChangeText={handleUsername}
            autoCapitalize="none"
          />
        </View>
        <View style={{ marginTop: 55 }}>
          <SignupButton onPress={handleNext}>
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
