import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'
import logoImage from "@/assets/images/logo2.png"

const Logo = () => {
  return (
    <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
    <Image source={logoImage} style={{width: 40, height: 40}}/>
    <Text style={{color:'white', fontSize: 14, fontWeight:'600', marginTop: -4}}>Strength</Text>
    </View>
  )
}

export default Logo

const styles = StyleSheet.create({})