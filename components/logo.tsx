import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'
import logoImage from "@/assets/images/logo2.png"
import Text1 from "@/components/Text"

const Logo = () => {
  return (
    <View style={{justifyContent:'center', alignItems:'center', marginLeft: 131}}>
    <Image source={logoImage} style={{width: 40, height: 40}}/>
    <Text1 style={{color:'white', fontSize: 14, fontWeight:'600', marginTop: -4}}>Strength</Text1>
    </View>
  )
}

export default Logo

const styles = StyleSheet.create({})