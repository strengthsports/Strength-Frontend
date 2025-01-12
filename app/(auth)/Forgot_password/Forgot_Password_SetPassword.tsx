import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
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
import { setNewPassword } from "~/reduxStore/slices/user/forgotPasswordSlice";
import Toast from "react-native-toast-message";

const Forgot_Password_SetPassword = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state

  const email = Array.isArray(params?.email) ? params.email[0] : params?.email;

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handlePassword = async () => {
    if (createPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Passwords do not match.",
      });
      return;
    }

    setLoading(true); // Start loader

    try {
      const resultAction = await dispatch(
        setNewPassword({ email, newPassword: createPassword })
      );

      if (setNewPassword.fulfilled.match(resultAction)) {
        router.push("/Forgot_password/PasswordChanged_Successfully");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to update password. Please try again.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update password. Please try again.",
      });
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <PageThemeView>
      <View style={{ marginTop: 80 }}>
        <Logo />
      </View>

      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ width: "81.5%", marginTop: 55 }}>
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
      </View>

      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            marginTop: 21,
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* Create Password Input */}
          <View>
            <TextScallingFalse
              style={{ color: "white", fontSize: 14, fontWeight: "400" }}
            >
              Create a password
            </TextScallingFalse>
            <TextInputSection
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={createPassword}
              onChangeText={setCreatePassword}
              autoCapitalize="none"
            />
          </View>

          {/* Confirm Password Input */}
          <View>
            <TextScallingFalse
              style={{ color: "white", fontSize: 14, fontWeight: "400" }}
            >
              Confirm password
            </TextScallingFalse>
            <TextInputSection
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Toggle Show/Hide Password */}
        <View style={{ width: "81%", alignItems: "flex-end" }}>
          <TouchableOpacity activeOpacity={0.5} onPress={toggleShowPassword}>
            <TextScallingFalse style={{ color: "#12956B", fontSize: 13 }}>
              {showPassword ? "Hide" : "Show"} Password
            </TextScallingFalse>
          </TouchableOpacity>
        </View>

        {/* Submit Button or Loader */}
        <View style={{ marginTop: 40 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#12956B" />
          ) : (
            <SignupButton onPress={handlePassword}>
              <TextScallingFalse
                style={{ color: "white", fontSize: 15, fontWeight: "500" }}
              >
                Next
              </TextScallingFalse>
            </SignupButton>
          )}
        </View>
      </View>
      <Toast />
    </PageThemeView>
  );
};

export default Forgot_Password_SetPassword;

const styles = StyleSheet.create({});
