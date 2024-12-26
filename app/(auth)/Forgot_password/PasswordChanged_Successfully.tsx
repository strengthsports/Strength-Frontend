import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Image } from 'expo-image';
import PageThemeView from "@/components/PageThemeView";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import tickmark from "@/assets/images/tickmark.gif"

const PasswordChanged_Successfully = () => {
   const router = useRouter();

  return (
    <PageThemeView>
      <View style={{width: '100%', justifyContent:'center', alignItems:'center', marginTop: 70}}>
        <Image source={tickmark} style={{width: '78%', height: 300}} />
        <TextScallingFalse style={{color:'white', fontWeight:'500', fontSize: 17, marginTop: -45}}>Password Changed Successfully</TextScallingFalse>
        <View style={{width: '80%', marginTop: 5}}>
        <TextScallingFalse style={{color:'grey', fontSize: 11, fontWeight:'400', textAlign:'center'}}>Your account password is changed, Now you can customize your profile, set your preference, and dive into the world of sports.</TextScallingFalse>
        </View>
      </View>
      <View style={{marginTop: 40, justifyContent:'center', alignItems:'center'}}>
        <SignupButton onPress={() => router.push("/(auth)/login")}>
          <TextScallingFalse style={{color:'white', fontSize: 16, fontWeight:'600'}}>Next</TextScallingFalse>
        </SignupButton>
      </View>
    </PageThemeView>
  )
}

export default PasswordChanged_Successfully

const styles = StyleSheet.create({})