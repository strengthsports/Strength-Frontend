import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons';

const PostButton = () => {
  return (
    <TouchableOpacity activeOpacity={0.5} style={{width: 24, height: 24, borderRadius: 5.5, borderWidth: 1.7, borderColor: 'white', alignItems:'center', justifyContent:'center'}}>
      <MaterialIcons name="add" size={17} color="white" />
    </TouchableOpacity>
  )
}

export default PostButton

const styles = StyleSheet.create({})