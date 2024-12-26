import { StyleSheet, View } from 'react-native'
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";


const signupEnterUsername = () => {
    const [username, setUsername] = useState('');
    const router = useRouter();

    const handleUsername = () => {
   //function for handling username
    }

  return (
    <PageThemeView>
    <View style={{marginTop: 80}}>
     <View>
     <Logo/>
     </View>
      </View>
      <View style={{alignItems:'center', justifyContent:'center'}}>
      <View style={{ marginTop: 55}}>
        <TextScallingFalse style={{color:'white', fontSize: 23, fontWeight:'500'}}>What should we call you?</TextScallingFalse>
        <View style={{width: '83%'}}>
        <TextScallingFalse style={{color:'white', fontSize: 12, fontWeight:'400'}}>Your @username is unique. You can always change it latter.</TextScallingFalse>
        </View>
      </View>
        <View style={{marginTop: 20}}>
        <TextScallingFalse style={{color:'white', fontSize: 14, fontWeight:'400'}}>Username</TextScallingFalse>
        <TextInputSection 
             placeholder="Email"
             value={username}
             onChangeText={handleUsername}
             autoCapitalize="none"  />
        </View>
        <View style={{marginTop: 55}}>
        <SignupButton onPress={() => router.push("/Signup/signupEnterLocation4")}>
            <TextScallingFalse style={{color:'white', fontSize: 15, fontWeight:'500'}}>Next</TextScallingFalse>
        </SignupButton>
        </View>
      </View>
    </PageThemeView>
  )
}

export default signupEnterUsername

const styles = StyleSheet.create({})