import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";

const Forgot_Password_Enter_Email = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleNext = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.message || "Something went wrong");
        alert(errorData.message || "Failed to send email. Please try again.");
        return;
      }
      const data = await response.json();
      const responseData=JSON.stringify(data)
      console.log(
        "Verification email sent successfully: " + JSON.stringify(data),
      );
      const id = data.data.userId;
      console.log(id);
      router.push({
        pathname: "/Forgot_password/Forgot_Password_OTP",
        params: { email,id },
      });
    } catch (error) {
      console.error("Network error:", error);
      alert(
        "A network error occurred. Please check your connection and try again.",
      );
    }
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
            style={{ color: "white", fontSize: 24, fontWeight: "500" }}
          >
            Forgot password?
          </TextScallingFalse>
          <View style={{ width: "83%" }}>
            <TextScallingFalse
              style={{ color: "white", fontSize: 12, fontWeight: "400" }}
            >
              We'll send a verification code to this email if it matches an
              existing Strength account.
            </TextScallingFalse>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <TextScallingFalse
            style={{ color: "white", fontSize: 14, fontWeight: "400" }}
          >
            Email
          </TextScallingFalse>
          <TextInputSection
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
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

export default Forgot_Password_Enter_Email;

const styles = StyleSheet.create({});
