import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useState } from "react";
import { useRouter } from "expo-router";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import { useLocalSearchParams } from "expo-router";

const Forgot_Password_OTP = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [otp, setOtp] = useState("");

  const email = params?.email;
  const id = params?.id;

  const handleVerificationCode = async () => {
    try {
      console.log(id);
      console.log(typeof otp);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/forgot-password-verifyOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: id,
            otp: otp,
          }),
        },
      );
      const data = await response.json();
      console.log(data);
      if (data.statusCode == 200) {
        router.push({
          pathname: "/Forgot_password/Forgot_Password_SetPassword",
          params: { email },
        });
      }
    } catch (error) {
      console.log(error);
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
              <TextScallingFalse
                style={{ color: "white", fontSize: 15, fontWeight: "600" }}
              >
                Next
              </TextScallingFalse>
            </SignupButton>
          </View>
        </View>
      </View>
    </PageThemeView>
  );
};

export default Forgot_Password_OTP;

const styles = StyleSheet.create({});
