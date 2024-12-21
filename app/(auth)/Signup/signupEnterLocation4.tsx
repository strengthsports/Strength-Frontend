import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Logo from "@/components/logo";
import PageThemeView from "@/components/PageThemeView";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import { MaterialIcons } from '@expo/vector-icons';

const signupEnterLocation4 = () => {
        const {location, setLocation} = useState('');
        const router = useRouter();
    
        const handleLocation = () => {
       //function for handling location
        }

  return (
    <PageThemeView>
    <View style={{marginTop: 110}}>
     <View style={{marginLeft:'0.8%'}}>
     <Logo/>
     </View>
      </View>
      <View style={{alignItems:'center', justifyContent:'center'}}>
      <View style={{ marginTop: 55}}>
        <TextScallingFalse style={{color:'white', fontSize: 23, fontWeight:'500'}}>What's your location?</TextScallingFalse>
        <View style={{width: '83%'}}>
        <TextScallingFalse style={{color:'white', fontSize: 12, fontWeight:'400'}}>See sports- player, events, tournaments, clubs and news as per your location.</TextScallingFalse>
        </View>
      </View>
        <View style={{marginTop: 20}}>
        <TextScallingFalse style={{color:'white', fontSize: 14, fontWeight:'400'}}>Location</TextScallingFalse>
        <TextInputSection 
             placeholder="Email"
             value={location}
             onChangeText={handleLocation}
             autoCapitalize="none"  />
        </View>
        <TouchableOpacity activeOpacity={0.7} style={{width: 200, borderWidth: 0.5, justifyContent:'center', alignItems:'center', borderColor:'grey', height: 35, borderRadius: 20, marginTop: 35, flexDirection:'row'}}>
          <TextScallingFalse style={{color:'grey', fontSize: 12, fontWeight:'400'}}>Use my current location</TextScallingFalse>
          <MaterialIcons style={{marginLeft: 5}} name="location-pin" size={17} color="grey" />
        </TouchableOpacity>
        <View style={{marginTop: 45}}>
        <SignupButton onPress={() => router.push("/(auth)/Signup/signupSetPassword5")}>
            <TextScallingFalse style={{color:'white', fontSize: 15, fontWeight:'500'}}>Next</TextScallingFalse>
        </SignupButton>
        </View>
      </View>
    </PageThemeView>
  )
}

export default signupEnterLocation4

const styles = StyleSheet.create({})