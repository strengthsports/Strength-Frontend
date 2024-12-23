import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useRouter } from "expo-router";
import User from "@/assets/images/card.png"
import page from "@/assets/images/page.png"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import PageThemeView from "@/components/PageThemeView";
import TextScallingFalse from "@/components/CentralText";
import Logo from "@/components/logo";

const option = () => {
  const router = useRouter();


  return (
    <PageThemeView>
      <View style={{gap : 130}}>
      <View style={{ width:'100%', alignItems:'center', marginTop: 60, flexDirection:'row', paddingHorizontal: '3.6%', gap: '35.6%'}}>
      <TouchableOpacity onPress={() => router.push("/login")} activeOpacity={0.5}>
      <MaterialIcons name="keyboard-backspace" size={30} color="white" />
      </TouchableOpacity>
      <Logo/>
      </View>
      

      <View style={{width: '100%', justifyContent:'center', alignItems:'center', gap: 50}}>
        <TouchableOpacity onPress={() => router.push("/Signup/signupEmail1")} activeOpacity={0.5} style={{backgroundColor:'white', width: '71%', height: 90, borderRadius: 5, flexDirection:'row', alignItems:'center', justifyContent:'center', gap: 45}}>
          <Image source={User}  style={{width: 45, height: 45}}/>
          <TextScallingFalse style={{color:'black', fontSize: 18}}>Join as a user</TextScallingFalse>
        </TouchableOpacity>
        <View style={{backgroundColor:'grey', width: '71%', height: 90, borderRadius: 5, flexDirection:'row', alignItems:'center', justifyContent:'center', gap: 45}}>
          <Image source={page}  style={{width: 45, height: 45, marginTop: 5}}/>
          <View>
          <TextScallingFalse style={{color:'black', fontSize: 18}}>Create a page</TextScallingFalse>
          <TextScallingFalse style={{fontSize: 11, fontWeight: '300', marginTop: -1.5, color: 'black', textAlign:'center'}}>Coming soon</TextScallingFalse>
          </View>
        </View>
      </View>


      <View style={{ flexDirection: 'row', width:'100%', justifyContent:'center'}}>
    <TextScallingFalse style={{color: 'white', fontSize: 13, fontWeight: '500'}} allowFontScaling={false}>Already on Strength?</TextScallingFalse>

    <TouchableOpacity onPress={() => router.push("/login")} activeOpacity={0.5} style={{marginLeft: 5}}><TextScallingFalse style={{fontSize: 13, fontWeight: '500', color: '#12956B',}}>Sign in</TextScallingFalse></TouchableOpacity>
    </View>
    </View>
    </PageThemeView>
  )
}

export default option

const styles = StyleSheet.create({})