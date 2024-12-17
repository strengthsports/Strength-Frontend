import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemedText } from "@/components/ThemedText";

export default function notification () {
  return (
    <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}}>
      <ThemedText type='default'>notification</ThemedText>
    </View>
  )
}


const styles = StyleSheet.create({})