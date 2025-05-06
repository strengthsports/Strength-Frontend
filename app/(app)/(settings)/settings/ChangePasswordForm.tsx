import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import TextScallingFalse from "~/components/CentralText";
import PageThemeView from "~/components/PageThemeView";
import SignupButton from "~/components/SignupButton";
import TextInputSection from "~/components/TextInputSection";
import { useChangePasswordMutation } from "~/reduxStore/api/profile/profileApi.changePassword";
import Toast from "react-native-toast-message";
import { ToastAndroid } from "react-native";
import BackIcon from "~/components/SvgIcons/Common_Icons/BackIcon";

const ChangePasswordForm = ({ onSuccess, onCancel }: { onSuccess?: () => void, onCancel?: () => void }) => {
  const userEmail = useSelector((state: any) => state.auth.user?.email);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const isAndroid = Platform.OS === "android";

  const feedback = (msg: string, type: "error" | "success" = "error") => {
    isAndroid
      ? ToastAndroid.show(msg, ToastAndroid.SHORT)
      : Toast.show({
          type,
          text1: msg,
          visibilityTime: 3000,
        });
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword)
      return feedback("All fields are required");
    if (newPassword.length < 8)
      return feedback("Password must be at least 8 characters");
    if (newPassword !== confirmPassword)
      return feedback("New passwords do not match");

    try {
      const res = await changePassword({
        oldpassword: oldPassword,
        newpassword: newPassword,
        email: userEmail,
      }).unwrap();
      feedback(res.message || "Password changed!", "success");
      onSuccess?.();
    } catch (err: any) {
      feedback(err.data?.message || "Password change failed!");
    }
  };

  return (
    <PageThemeView>
        <View style={{width:'100%', height:'100%', zIndex: 100, position:'absolute'}}>
      <View style={styles.TopBarView}>
        <TouchableOpacity style={{width: 60, height: 30, justifyContent:'center'}} activeOpacity={0.5} onPress={onCancel}>
          <BackIcon />
        </TouchableOpacity>
        <TextScallingFalse style={styles.TitleText}>Password</TextScallingFalse>
        <View style={{ width: 60 }} />
      </View>

      <View style={{ height: 30 }} />

      <View style={styles.HeaderContainer}>
        <TextScallingFalse style={styles.HeaderTitle}>Change Password</TextScallingFalse>
        <TextScallingFalse style={styles.HeaderSubtitle}>Make sure it's 8 characters or more</TextScallingFalse>
      </View>

      <View style={styles.FormContainer}>
        {[{
          label: "Enter old password", value: oldPassword, setter: setOldPassword
        }, {
          label: "Enter new password", value: newPassword, setter: setNewPassword
        }, {
          label: "Confirm new password", value: confirmPassword, setter: setConfirmPassword
        }].map(({ label, value, setter }, index) => (
          <View key={index} style={styles.InputGroup}>
            <TextScallingFalse style={styles.PasswordTextHeading}>{label}</TextScallingFalse>
            <TextInputSection
              placeholder={label}
              placeholderTextColor="grey"
              secureTextEntry={!showPassword}
              value={value}
              onChangeText={setter}
            />
          </View>
        ))}

        <View style={styles.ButtonRow}>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <TextScallingFalse style={styles.ShowPasswordButton}>
              {showPassword ? "Hide Password" : "Show Password"}
            </TextScallingFalse>
          </TouchableOpacity>
        </View>

        <View style={styles.SubmitButtonContainer}>
          <SignupButton onPress={handleChangePassword} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <TextScallingFalse style={styles.ButtonText}>Next</TextScallingFalse>
            )}
          </SignupButton>
        </View>
      </View>
      </View>
    </PageThemeView>
  );
};

const styles = StyleSheet.create({
  // same as your existing styles
  TopBarView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
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
    marginBottom: 4,
    paddingLeft: 2,
  },
  ButtonRow: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 50,
    justifyContent: "flex-end",
  },
  ShowPasswordButton: {
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
});

export default ChangePasswordForm;
