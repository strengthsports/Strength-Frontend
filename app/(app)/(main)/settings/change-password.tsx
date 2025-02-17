import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import TextScallingFalse from "~/components/CentralText";
import PageThemeView from "~/components/PageThemeView";
import SignupButton from "~/components/SignupButton";
import TextInputSection from "~/components/TextInputSection";
import { useChangePasswordMutation } from "~/reduxStore/api/profile/profileApi.changePassword";
import Toast from "react-native-toast-message";
import { ToastAndroid } from "react-native";
import { BackHandler } from "react-native";

function ChangePassword() {
  const router = useRouter();
  const userEmail = useSelector((state: any) => state.auth.user?.email);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const isAndroid = Platform.OS === "android";

  useEffect(() => {
    const onBackPress = () => {
      router.push("/(app)/(main)/settings?accountSettingsModal=true");
      // Return true to indicate we've handled the back press
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [router]);

  const feedback = (errorMsg: string, type: "error" | "success" = "error") => {
    isAndroid
      ? ToastAndroid.show(errorMsg, ToastAndroid.SHORT)
      : Toast.show({
          type,
          text1: errorMsg,
          visibilityTime: 3000,
          autoHide: true,
        });
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      feedback("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      feedback("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      feedback("New passwords do not match");
      return;
    }

    try {
      const response = await changePassword({
        oldpassword: oldPassword,
        newpassword: newPassword,
        email: userEmail,
      }).unwrap();

      // Feedback on success
      feedback(response.message || "Password changed successfully!", "success");
      router.push("/(app)/(main)/settings?accountSettingsModal=true");
    } catch (err: any) {
      // setErrorMessage(err.data?.message || "Password change failed");
      feedback(err.data?.message || "Password change failed!");
    }
  };

  const handleForgotPassword = () => {
    router.push("/(auth)/Forgot_password/Forgot_Password_Enter_Email");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageThemeView>
        <View style={styles.TopBarView}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              router.push("/(app)/(main)/settings?accountSettingsModal=true")
            }
          >
            <AntDesign name="arrowleft" size={28} color="white" />
          </TouchableOpacity>
          <TextScallingFalse style={styles.TitleText}>
            Password
          </TextScallingFalse>
          <View style={{ width: 29, height: 8 }} />
        </View>

        <View style={{ height: 30 }} />

        <View style={styles.HeaderContainer}>
          <TextScallingFalse style={styles.HeaderTitle}>
            Change Password
          </TextScallingFalse>
          <TextScallingFalse style={styles.HeaderSubtitle}>
            Make sure it's 8 character or more
          </TextScallingFalse>
        </View>

        <View style={styles.FormContainer}>
          <View style={styles.InputGroup}>
            <TextScallingFalse style={styles.PasswordTextHeading}>
              Enter old password
            </TextScallingFalse>
            <TextInputSection
              placeholder="Enter old password"
              placeholderTextColor="grey"
              secureTextEntry={!showPassword}
              value={oldPassword}
              onChangeText={setOldPassword}
            />
          </View>

          <View style={styles.InputGroup}>
            <TextScallingFalse style={styles.PasswordTextHeading}>
              Enter new password
            </TextScallingFalse>
            <TextInputSection
              placeholder="Enter new password"
              placeholderTextColor="grey"
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          <View style={styles.InputGroup}>
            <TextScallingFalse style={styles.PasswordTextHeading}>
              Confirm new password
            </TextScallingFalse>
            <TextInputSection
              placeholder="Confirm new password"
              placeholderTextColor="grey"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <View style={styles.ButtonRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowPassword(!showPassword)}
            >
              <TextScallingFalse style={styles.ShowAndForgetButton}>
                {showPassword ? "Hide Password" : "Show Password"}
              </TextScallingFalse>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleForgotPassword}
            >
              <TextScallingFalse style={styles.ShowAndForgetButton}>
                Forget password?
              </TextScallingFalse>
            </TouchableOpacity>
          </View>

          <View style={styles.SubmitButtonContainer}>
            <SignupButton onPress={handleChangePassword} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <TextScallingFalse style={styles.ButtonText}>
                  Next
                </TextScallingFalse>
              )}
            </SignupButton>
          </View>
        </View>
      </PageThemeView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  TopBarView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  TitleText: {
    color: "white",
    fontSize: 20,
    fontWeight: "300",
  },
  HeaderContainer: {
    width: "85%",
    paddingVertical: 25,
    marginHorizontal: "auto",
  },
  HeaderTitle: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
  HeaderSubtitle: {
    fontSize: 13,
    color: "white",
    marginTop: 5,
  },
  FormContainer: {
    width: "100%",
    alignItems: "center",
    gap: 20,
    paddingBottom: 30,
  },
  InputGroup: {
    width: "85%",
    marginHorizontal: "auto",
  },
  PasswordTextHeading: {
    color: "white",
    fontSize: 14,
    marginBottom: 8,
    paddingLeft: 5,
  },
  ButtonRow: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 40,
    justifyContent: "space-between",
    marginTop: 15,
  },
  ShowAndForgetButton: {
    color: "#12956B",
    fontSize: 13,
    fontWeight: "500",
  },
  SubmitButtonContainer: {
    width: "100%",
    paddingVertical: 30,
    alignItems: "center",
  },
  ButtonText: {
    color: "white",
    fontSize: 14.5,
    fontWeight: "500",
  },
  ErrorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
});

export default ChangePassword;
