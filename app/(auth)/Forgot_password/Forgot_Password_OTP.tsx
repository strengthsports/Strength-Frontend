import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform, ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import { useLocalSearchParams } from "expo-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/reduxStore";
import { verifyOtp, resendOtpForPassword } from "~/reduxStore/slices/user/forgotPasswordSlice";
import Toast from "react-native-toast-message";

const Forgot_Password_OTP = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading
  const dispatch = useDispatch<AppDispatch>();
  const { email } = useLocalSearchParams();

  // const email = params?.email as string;
  console.log("email-", email)

  const handleVerificationCode = async () => {
    if (!otp) {
      Toast.show({
        type: "error",
        text1: "Please enter the verification code.",
      });
      return;
    }

    setLoading(true); // Set loading state to true when button is clicked

    try {
      const resultAction = await dispatch(verifyOtp({ email, otp }));
      if (verifyOtp.fulfilled.match(resultAction)) {
        // On success, navigate to set new password page
        router.push({
          pathname: "/Forgot_password/Forgot_Password_SetPassword",
          params: { email },
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: resultAction.payload,
        });
      }
    } catch (error) {
      console.error("Network error:", error);
      Toast.show({
        type: "error",
        text1: "Network error",
      });
    } finally {
      setLoading(false); // Reset loading state once the operation is complete
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleResendCode = async () => {
    if (!email) {
      console.warn("Email not found");
      return;
    }

    try {
      setIsLoading(true);

      const resultAction = await dispatch(resendOtpForPassword(email));

      if (resendOtpForPassword.fulfilled.match(resultAction)) {
        // ✅ TypeScript knows this is { payload: { message: string } }
        showToast(resultAction.payload.message || "OTP sent successfully!");
      } else {
        // ❌ Rejected path — payload is string (your error message)
        const errorMessage = resultAction.payload || "Failed to send OTP";
        showToast(errorMessage);
      }
    } catch (error) {
      showToast("Unexpected error occurred");
      console.error("Resend OTP error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      // Add iOS toast method here if needed
      console.log("Toast:", message);
    }
  };

  return (
    <PageThemeView>
      <View>
        <View style={{ marginTop: 80, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25 }}>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")} activeOpacity={0.4} style={{ width: 50, height: 30 }}>
            <View style={{ width: 45 }} />
          </TouchableOpacity>
          <Logo />
          <View style={{ width: 45 }} />
        </View>

        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20, 
          }}
        >
          <View style={{ gap: 27, paddingHorizontal: 20}}>
            <View
              style={{
                marginTop: 50,
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
                <View style={{}}>
                  <TextScallingFalse style={{ fontSize: 12, color: "white" }}>
                    We sent the verification code to- {email}{" "}
                  </TextScallingFalse>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/(auth)/Forgot_password/Forgot_Password_Enter_Email")} style={{ width: 80 }}>
                    <TextScallingFalse style={{ fontSize: 13, color: "#12956B" }}>
                      Edit Email
                    </TextScallingFalse>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View>
              <TextScallingFalse
                style={{ fontSize: 13, fontWeight: "400", color: "white" }}
              >
                6 digit code
              </TextScallingFalse>
              <TextInputSection
                placeholder="Email"
                value={otp}
                onChangeText={setOtp}
                autoCapitalize="none"
              />
            </View>
          </View>
          {
            isLoading ?
              <ActivityIndicator style={{ marginTop: 35 }} size="small" color="white" />
              :
              <TouchableOpacity onPress={handleResendCode} activeOpacity={0.5} style={{ marginTop: 35 }}>
                <TextScallingFalse
                  style={{ color: "white", fontSize: 14, fontWeight: "400" }}
                >
                  Resend code
                </TextScallingFalse>
              </TouchableOpacity>
          }
          <View style={{ marginTop: 50 }}>
            <SignupButton onPress={handleVerificationCode} disabled={false}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" /> // Loader when loading is true
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
      <Toast />
    </PageThemeView>
  );
};

export default Forgot_Password_OTP;

const styles = StyleSheet.create({});
