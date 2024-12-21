import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Image } from 'expo-image';
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import tickmark from "@/assets/images/tickmark.gif"

const signupAccountCreated6 = () => {
   const router = useRouter();

  return (
    <PageThemeView>
      <View style={{width: '100%', justifyContent:'center', alignItems:'center', marginTop: 100}}>
        <Image source={tickmark} style={{width: 300, height: 300}} />
        <Text style={{color:'white', fontWeight:'500', fontSize: 17, marginTop: -45}}>Account Created Successfully</Text>
        <View style={{width: 330, marginTop: 5}}>
        <Text style={{color:'grey', fontSize: 11, fontWeight:'400', textAlign:'center'}}>Your account is all set! Now you can customize your profile, set your preference, and dive into the world of sports.</Text>
        </View>
      </View>
      <View style={{marginTop: 40, justifyContent:'center', alignItems:'center'}}>
        <SignupButton onPress={() => router.push("/Signup/signupAccountCreated6")}>
          <Text style={{color:'white', fontSize: 15, fontWeight:'500'}}>Next</Text>
        </SignupButton>
      </View>
    </PageThemeView>
  )
}

export default signupAccountCreated6

const styles = StyleSheet.create({})