import { Platform, StyleSheet, Text, ToastAndroid, TouchableOpacity, Vibration, View } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from "expo-router";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/reduxStore';
import { verifyOTPSignup } from '@/reduxStore/slices/signupSlice';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import { otpSchema } from '@/schemas/signupSchema';

const SignupEnterOtp2 = () => {
  const router = useRouter();
  console.log('Redux State:', useSelector((state: RootState) => state.signup));

  const dispatch = useDispatch<AppDispatch>()
  const { loading, success, error, userId } = useSelector((state: RootState) => state.signup);
  const isAndroid = Platform.OS === "android";

  const [OTP, setOTP] = useState<string>(""); // Explicitly typed as string
  // console.log('OTP', OTP)
  // console.log('type', typeof OTP)

  console.log("Response before:", userId, OTP);
  const feedback = (errorMsg: string, type: "error" | "success" = "error") => {
    const vibrationPattern = [0, 50, 80, 50];
    
    if (type === "error") {
      Vibration.vibrate(vibrationPattern);
    }
  
    Platform.OS === "android"
      ? ToastAndroid.show(errorMsg, ToastAndroid.LONG)
      : Toast.show({
          type,
          text1: errorMsg,
          visibilityTime: 3000,
          autoHide: true,
        });
  };

  
  const handleVerificationCode = async () => {
    try {
      const verificationData = otpSchema.parse({ OTP, userId });
  
      const response = await dispatch(
        verifyOTPSignup({ _id: verificationData.userId, otp: verificationData.OTP })
      ).unwrap();
  
      feedback(response.message || "OTP verified successfully!", "success");
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
  const handleNextScreen = async () => {
    router.push("/Signup/signupEnterUsername3"); // Navigate to the next screen
  };



  return (
    <PageThemeView>
      <View style={{marginTop: 80}}>
      <View>
      <Logo/>
      </View>
      <View style={{marginTop: 55, width:'100%', justifyContent:'center', alignItems:'center'}}>
        <View>
        <TextScallingFalse style={{color:'white', fontSize: 23, fontWeight:'500'}}>Enter the verification code</TextScallingFalse>
        <View style={{width: '81%'}}>
        <TextScallingFalse style={{fontSize: 12, color:'white'}}>We sent the verification code to- ExampleEmail@gmail.com <TextScallingFalse style={{fontSize: 13, color:'#12956B'}}>Edit mail</TextScallingFalse></TextScallingFalse>
        </View>
        </View>
      </View>
      <View style={{width: '100%', justifyContent:'center', alignItems:'center', marginTop: 25}}>
      <View>
      <TextScallingFalse style={{fontSize: 13, fontWeight:'400', color:'white'}}>6 digit code</TextScallingFalse>
      <TextInputSection
       placeholder="Email"
       value={OTP}
       onChangeText={setOTP}
       keyboardType="email-address" // Optional: Ensure proper keyboard type
       autoCapitalize="none"  />
       </View>
       <TouchableOpacity activeOpacity={0.5} style={{marginTop:35}}>
        <TextScallingFalse style={{color:'white', fontSize: 14, fontWeight:'400'}}>Resend code</TextScallingFalse>
        <TouchableOpacity onPress={handleVerificationCode} >  
          <TextScallingFalse style={{color:'white', fontSize: 14, fontWeight:'400', paddingVertical:20}}>Varify code</TextScallingFalse>
        </TouchableOpacity>
        </TouchableOpacity>
        <View style={{marginTop: 50}}>
          <SignupButton onPress={handleNextScreen}>
            <TextScallingFalse style={{color:'white', fontSize: 15, fontWeight:'600'}}>Next</TextScallingFalse>
          </SignupButton>
        </View>
       </View>
      </View>
    </PageThemeView>
  )
}

export default SignupEnterOtp2