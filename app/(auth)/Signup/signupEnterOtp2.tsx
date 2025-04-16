import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import {
  resendOtp,
  verifyOTPSignup,
} from "~/reduxStore/slices/user/signupSlice";
import { z } from "zod";
import Toast from "react-native-toast-message";
import { otpSchema, resendOtpSchema } from "@/schemas/signupSchema";
import { vibrationPattern } from "~/constants/vibrationPattern";

const SignupEnterOtp2 = () => {
  const router = useRouter();
  const isAndroid = Platform.OS === "android";
  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, error, userId, email } = useSelector(
    (state: RootState) => state.signup
  );

  const [OTP, setOTP] = useState<string>(""); // Explicitly typed as string

  // console.log("Response before:", userId, OTP);
  const feedback = (errorMsg: string, type: "error" | "success" = "error") => {
    if (type === "error") {
      Vibration.vibrate(vibrationPattern);
    }

    isAndroid
      ? ToastAndroid.show(errorMsg, ToastAndroid.LONG)
      : Toast.show({
          type,
          text1: errorMsg,
          visibilityTime: 3000,
          autoHide: true,
        });
  };

  const handleResendOtp = async () => {
    try {
      const resendOTPPayload = resendOtpSchema.parse({ userId, email });

      const response = await dispatch(
        resendOtp({
          _id: resendOTPPayload.userId,
          email: resendOTPPayload.email,
        })
      ).unwrap();

      feedback(response.message || "OTP sent successfully!", "success");
      console.log("backend response for resendotp - ", response.message);

      // handleNextScreen(); // Navigate to the next screen on success
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const validationError = err.errors[0]?.message || "Invalid input.";
        console.log("zod error - ", validationError);
        feedback(validationError);
      } else {
        feedback(err || "Verification failed. Please try again.");
        console.log("backend error - ", err);
      }
    }
  };

  const handleOTPAndNextScreen = async () => {
    try {
      const OTPPayload = otpSchema.parse({ OTP, userId });

      const response = await dispatch(
        verifyOTPSignup({ _id: OTPPayload.userId, otp: OTPPayload.OTP })
      ).unwrap();

      feedback(response.message || "OTP verified successfully!", "success");
      router.push("/Signup/signupEnterUsername3"); // Navigate to the next screen

      // handleNextScreen(); // Navigate to the next screen on success
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const validationError = err.errors[0]?.message || "Invalid input.";
        feedback(validationError);
      } else {
        feedback(err || "Verification failed. Please try again.");
      }
    }
  };

  console.log("otp-",OTP)

  return (
    <PageThemeView>
      <View style={{ marginTop: 80 }}>
        <View>
          <Logo />
        </View>
        <View
          style={{
            marginTop: 55,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View>
            <TextScallingFalse
              style={{ color: "white", fontSize: 23, fontWeight: "500" }}
            >
              Enter the verification code
            </TextScallingFalse>
            <View style={{ width: "81%" }}>
              <TextScallingFalse style={{ fontSize: 12, color: "white" }}>
                We sent the verification code to {email}
                <TextScallingFalse
                  onPress={() => router.back()}
                  style={{ fontSize: 13, color: "#12956B" }}
                >
                  {" "}
                  Edit email
                </TextScallingFalse>
              </TextScallingFalse>
            </View>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <View>
            <TextScallingFalse
              style={{ fontSize: 13, fontWeight: "400", color: "white" }}
            >
              6 digit code
            </TextScallingFalse>
            <TextInputSection
              placeholder="Email"
              value={OTP}
              onChangeText={setOTP}
              keyboardType="numeric" // Optional: Ensure proper keyboard type
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity
            onPress={handleResendOtp}
            activeOpacity={0.5}
            style={{ marginTop: 35 }}
          >
            <TextScallingFalse
              style={{ color: "white", fontSize: 14, fontWeight: "400" }}
            >
              Resend code
            </TextScallingFalse>
          </TouchableOpacity>
          <View style={{ marginTop: 50 }}>
            <SignupButton onPress={handleOTPAndNextScreen}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <TextScallingFalse
                  style={{ color: "white", fontSize: 15, fontWeight: "600" }}
                >
                  Next
                </TextScallingFalse>
              )}
            </SignupButton>
          </View>
        </View>
      </View>
    </PageThemeView>
  );
};

export default SignupEnterOtp2;
