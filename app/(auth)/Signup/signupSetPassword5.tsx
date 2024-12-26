import { StyleSheet, TouchableOpacity, View, Text} from 'react-native'
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";


const signupSetPassword5 = () => {
  const router = useRouter();
   const [password, setPassword] = useState('');

   const handlePassword = () => {
    //function for handling password
   }

   const [showPassword, setShowPassword] = useState(false)
     const toggleShowPassword = () => {
       setShowPassword(prevState => !prevState)
     };


  return (
    <PageThemeView>
      <View style={{marginTop: 80}}>
      <Logo />
      </View>
      <View style={{width: '100%', justifyContent:'center', alignItems:'center'}}>
      <View style={{ width: '81.5%', marginTop: 55}}>
      <TextScallingFalse style={{color:'white', fontSize: 23, fontWeight:'500'}}>You'll need a password</TextScallingFalse>
      <TextScallingFalse style={{color:'white', fontSize: 12, fontWeight:'400'}}>Make sure it's 8 character or more.</TextScallingFalse>
      </View>
      </View>
      <View style={{width: '100%', justifyContent:'center', alignItems:'center'}}>
        <View style={{marginTop: 21}}>
          <TextScallingFalse style={{color:'white', fontSize: 14, fontWeight:'400'}}>Create a password</TextScallingFalse>
          <TextInputSection 
           placeholder="Password"
           secureTextEntry={!showPassword}
           onChangeText={handlePassword}
           autoCapitalize="none"
           />

          <TextScallingFalse style={{color:'white', fontSize: 14, fontWeight:'400', marginTop: 20}}>Confirm password</TextScallingFalse>
          <TextInputSection 
           placeholder="Password"
           secureTextEntry={!showPassword}
           onChangeText={handlePassword}
           autoCapitalize="none"
           />
           <TouchableOpacity activeOpacity={0.5} onPress={toggleShowPassword} style={{marginTop: 6, marginLeft: '58%', width: '27%', alignItems: 'flex-end',}}>
            <TextScallingFalse style={{color:'#12956B', fontSize: 13, textAlign: 'right'}}>{showPassword ? 'Hide' : 'Show'} Password</TextScallingFalse>
            </TouchableOpacity>
        </View>
        <View style={{marginTop: 40}}>
          <SignupButton onPress={() => router.push("/Signup/signupAccountCreated6")}>
            <TextScallingFalse style={{color:'white', fontSize: 15, fontWeight:'500'}}>Next</TextScallingFalse>
            </SignupButton>
        </View>
      </View>
    </PageThemeView>
  )
}

export default signupSetPassword5

const styles = StyleSheet.create({})