import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useRouter } from "expo-router";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";

const signupEnterOtp2 = () => {
  const router = useRouter();

  const handleVerificationCode = () => {
  //otp function here
  }

  return (
    <PageThemeView>
      <View style={{marginTop: 110}}>
      <View style={{marginLeft:'0.8%'}}>
      <Logo/>
      </View>
      <View style={{ marginLeft: 30, marginTop: 55}}>
        <TextScallingFalse style={{color:'white', fontSize: 23, fontWeight:'500'}}>Enter the verification code</TextScallingFalse>
        <View style={{width: '93%'}}>
        <TextScallingFalse style={{fontSize: 12, color:'white'}}>We sent the verification code to- ExampleEmail@gmail.com <TextScallingFalse style={{fontSize: 13, color:'#12956B'}}>Edit mail</TextScallingFalse></TextScallingFalse>
        </View>
      </View>
      <View style={{width: '100%', justifyContent:'center', alignItems:'center', marginTop: 25}}>
      <View>
      <TextScallingFalse style={{fontSize: 13, fontWeight:'400', color:'white'}}>6 digit code</TextScallingFalse>
      <TextInputSection
       placeholder="Email"
       onChangeText={handleVerificationCode}
       keyboardType="email-address" // Optional: Ensure proper keyboard type
       autoCapitalize="none"  />
       </View>
       <TouchableOpacity activeOpacity={0.5} style={{marginTop:35}}>
        <TextScallingFalse style={{color:'white', fontSize: 14, fontWeight:'400'}}>Resend code</TextScallingFalse>
        </TouchableOpacity>
        <View style={{marginTop: 50}}>
          <SignupButton onPress={() => router.push("/Signup/signupEnterUsername3")}>
            <TextScallingFalse style={{color:'white', fontSize: 15, fontWeight:'600'}}>Next</TextScallingFalse>
          </SignupButton>
        </View>
       </View>
      </View>
    </PageThemeView>
  )
}

export default signupEnterOtp2

const styles = StyleSheet.create({})