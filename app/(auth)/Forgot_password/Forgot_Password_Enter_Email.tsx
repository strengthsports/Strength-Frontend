import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import { forgotPassword } from "~/reduxStore/slices/user/forgotPasswordSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/reduxStore";
import Toast from "react-native-toast-message"; // Import Toast
import BackIcon from "~/components/SvgIcons/Common_Icons/BackIcon";

const Forgot_Password_Enter_Email = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleNext = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Please enter your email.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const resultAction = await dispatch(forgotPassword(email));

      if (forgotPassword.fulfilled.match(resultAction)) {
        // On success, navigate to OTP page with email and userId
        router.push({
          pathname: "/Forgot_password/Forgot_Password_OTP",
          params: { email },
        });
        // Show success toast
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Verification code has been sent to your email.",
          position: "top",
          visibilityTime: 3000,
        });
      } else {
        console.error("Error:", resultAction.payload);
        // Trigger error toast if the result action failed
        Toast.show({
          type: "error",
          text1: resultAction.payload || "An error occurred.",
          position: "top",
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error("Network error:", error);
      // Trigger error toast on network error
      Toast.show({
        type: "error",
        text1: "A network error occurred. Please try again.",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false); // Reset loading state once the operation is complete
    }
  };

  return (
    <PageThemeView>
        <View style={{marginTop: 80, flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal: 25}}>
          <TouchableOpacity onPress={()=>router.back()} activeOpacity={0.4} style={{width: 50, height: 30}}>
          <BackIcon />
          </TouchableOpacity>
          <Logo />
          <View style={{width: 45}} />
        </View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>

        <View style={{ marginTop: 20, gap: 20, paddingHorizontal: 30}}>
        <View style={{ marginTop: 55, width:'100%'}}>
          <TextScallingFalse
            style={{ color: "white", fontSize: 24, fontWeight: "500" }}
          >
            Forgot password?
          </TextScallingFalse>
          <View>
            <TextScallingFalse
              style={{ color: "white", fontSize: 12, fontWeight: "400"}}
            >
              We'll send a verification code to this email if it matches an
              existing Strength account.
            </TextScallingFalse>
          </View>
        </View>
        <View>
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
        </View>

        <View style={{ marginTop: 55 }}>
          <SignupButton onPress={handleNext} disabled={false}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" /> // Loader when loading is true
            ) : (
              <TextScallingFalse
                style={{ color: "white", fontSize: 15, fontWeight: "500" }}
              >
                Next
              </TextScallingFalse>
            )}
          </SignupButton>
        </View>
      </View>

      {/* Include Toast component here */}
      <Toast />
    </PageThemeView>
  );
};

export default Forgot_Password_Enter_Email;

const styles = StyleSheet.create({});
