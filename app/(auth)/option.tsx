import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useRouter } from "expo-router";
import User from "@/assets/images/card.png"
import page from "@/assets/images/page.png"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import PageThemeView from "@/components/PageThemeView";
import Logo from "@/components/logo";

const option = () => {
  const router = useRouter();


  return (
    <View style={{width: '100%', height: '100%', backgroundColor:'black'}}>

      <View style={{ width:'100%', alignItems:'center', marginTop: 60, flexDirection:'row'}}>
      <TouchableOpacity onPress={() => router.push("/login")} activeOpacity={0.5} style={{marginLeft: 15, marginTop: -15}}>
      <MaterialIcons name="keyboard-backspace" size={30} color="white" />
      </TouchableOpacity>
      <Logo />
      </View>

      <View style={{width: '100%', justifyContent:'center', alignItems:'center', marginTop: 130}}>
        <TouchableOpacity onPress={() => router.push("/Signup/signupEmail1")} activeOpacity={0.5} style={{backgroundColor:'white', width: '71%', height: 90, borderRadius: 5, flexDirection:'row', alignItems:'center'}}>
          <Image source={User}  style={{width: 45, height: 45, marginLeft: 40}}/>
          <Text style={{color:'black', fontSize: 18, marginLeft: 40}}>Join as a user</Text>
        </TouchableOpacity>
        <View style={{backgroundColor:'grey', width: '71%', height: 90, borderRadius: 5, flexDirection:'row', alignItems:'center', marginTop: 50}}>
          <Image source={page}  style={{width: 45, height: 45, marginLeft: 40, marginTop: 5}}/>
          <View style={{ marginLeft: 40}}>
          <Text style={{color:'black', fontSize: 18}}>Create a page</Text>
          <Text style={{fontSize: 11, fontWeight: '300', marginTop: -1.5, color: 'black', textAlign:'center'}}>Coming soon</Text>
          </View>
        </View>
      </View>


      <View style={{ marginTop: 130, flexDirection: 'row', width:'100%', justifyContent:'center'}}>
    <Text style={{color: 'white', fontSize: 13, fontWeight: '500'}} allowFontScaling={false}>Already on Strength?</Text>

    <TouchableOpacity onPress={() => router.push("/login")} activeOpacity={0.5} style={{marginLeft: 5}}><Text style={{fontSize: 13, fontWeight: '500', color: '#12956B',}}>Sign in</Text></TouchableOpacity>
    </View>

    </View>
  )
}

export default option

const styles = StyleSheet.create({})