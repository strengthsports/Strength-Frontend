import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'
import logoImage from "@/assets/images/logoheader.png"
import TextScallingFalse from "@/components/CentralText"

const Logo = () => {
  return (
    <View style={{justifyContent:'center', alignItems:'center'}}>
    <Image source={logoImage} style={{width: 50, height: 50}}/>
    {/* <TextScallingFalse style={{color:'white', fontSize: 14, fontWeight:'600', marginTop: -4}}>Strength</TextScallingFalse> */}
    </View>
  )
}

export default Logo

const styles = StyleSheet.create({})