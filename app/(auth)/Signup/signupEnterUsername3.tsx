import {
  StyleSheet,
  View,
  ToastAndroid,
  Platform,
  Vibration,
} from "react-native";
import React, { useState } from "react";
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
import { ActivityIndicator } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

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

  const [isLoading, setIsLoading] = useState(false);
  const handleNext = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
      return;
    }

    // 👇 Await is valid now
    const result = await checkUsernameAvailability(username);

    if (!result.ok || result.data?.exists) {
      feedback("This username is already taken. Try another one.");
      setIsLoading(false);
      return;
    }
    // Navigate to the next screen if validation passes
    setIsLoading(false);
    router.replace("/Signup/signupEnterLocation4");
  };

  return (
    <PageThemeView>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 80 }}>
          <View>
            <Logo />
          </View>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={{ gap: 30 }}>
            <View style={{ marginTop: 55 }}>
              <TextScallingFalse
                style={{ color: "white", fontSize: 23, fontWeight: "500" }}
              >
                What should we call you?
              </TextScallingFalse>
              <View>
                <TextScallingFalse
                  style={{ color: "white", fontSize: 12, fontWeight: "400" }}
                >
                  Your @username is unique. You can always change it later.
                </TextScallingFalse>
              </View>
            </View>
            <View>
              <TextScallingFalse
                style={{ color: "white", fontSize: 14, fontWeight: "400" }}
              >
                Username
              </TextScallingFalse>
              <TextInputSection
                placeholder="Enter your username"
                value={username}
                onChangeText={(text) => {
                  const normalized = text.toLowerCase().replace(/\s/g, ""); // remove spaces and make lowercase
                  if (normalized.length <= 20) {
                    handleUsername(normalized);
                  }
                }}
                autoCapitalize="none"
              />

              <TextScallingFalse className="text-gray-500 text-sm mt-1 p-1">
                {username.length} / 20
              </TextScallingFalse>
            </View>
          </View>

          <View style={{ marginTop: 55 }}>
            {isLoading ? (
              <ActivityIndicator size={"small"} />
            ) : (
              <SignupButton disabled={false} onPress={handleNext}>
                <TextScallingFalse
                  style={{ color: "white", fontSize: 15, fontWeight: "500" }}
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

export default signupEnterUsername3;
