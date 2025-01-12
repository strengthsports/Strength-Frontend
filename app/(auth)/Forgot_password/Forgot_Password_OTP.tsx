import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
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
import { verifyOtp } from "~/reduxStore/slices/user/forgotPasswordSlice";
import Toast from "react-native-toast-message";

const Forgot_Password_OTP = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading
  const dispatch = useDispatch<AppDispatch>();

  const email = params?.email;
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

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
      const resultAction = await dispatch(verifyOtp({ id, otp }));
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
                We sent the verification code to- ExampleEmail@gmail.com{" "}
                <TextScallingFalse style={{ fontSize: 13, color: "#12956B" }}>
                  Edit mail
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
              value={otp}
              onChangeText={setOtp}
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity activeOpacity={0.5} style={{ marginTop: 35 }}>
            <TextScallingFalse
              style={{ color: "white", fontSize: 14, fontWeight: "400" }}
            >
              Resend code
            </TextScallingFalse>
          </TouchableOpacity>
          <View style={{ marginTop: 50 }}>
            <SignupButton onPress={handleVerificationCode}>
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
