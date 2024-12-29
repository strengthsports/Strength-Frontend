import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import { useLocalSearchParams } from "expo-router";
const Forgot_Password_SetPassword = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [createPassword, setcreatePassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const email = params?.email;
  const handlePassword = async () => {
    if (createPassword != confirmPassword) {
      alert("Passwords do not match");
    } else {
      try {
        console.log(email);
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/set-newpassword`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, newpassword: createPassword }),
          },
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error:", errorData.message || "Something went wrong");
          alert(errorData.message || "Failed to send email. Please try again.");
          return;
        }
        console.log("Password changed successfully");
        router.push("/Forgot_password/PasswordChanged_Successfully");
      } catch (error) {
        console.error("Network error:", error);
        alert(
          "A network error occurred. Please check your connection and try again.",
        );
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
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
            Make sure it's 8 character or more.
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
              onChangeText={setcreatePassword}
              autoCapitalize="none"
            />
          </View>

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
              onChangeText={setconfirmPassword}
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
          <SignupButton onPress={handlePassword}>
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

export default Forgot_Password_SetPassword;

const styles = StyleSheet.create({});
