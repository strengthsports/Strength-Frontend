import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import PageThemeView from '~/components/PageThemeView'
import { useRouter } from "expo-router";
import TextScallingFalse from '~/components/CentralText'
import BackIcon from '~/components/SvgIcons/Common_Icons/BackIcon'
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";

const feedback = () => {
  const router = useRouter();
   const user = useSelector((state: RootState) => state.profile.user);
  return (
    <PageThemeView>
      {/* Header */}
      <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: '20%', paddingVertical: 20 }}>
          <BackIcon />
        </TouchableOpacity>
        <TextScallingFalse style={{ color: 'white', fontSize: 20, fontWeight: '400' }}>Feedback</TextScallingFalse>
        <View style={{ width: '20%' }} />
      </View>

      <View style={{ width:'100%', height:'50%', justifyContent:'center'}}>
      <View style={{ alignItems: 'flex-end', paddingHorizontal: 25, gap: 13, borderBottomColor:'#404040', borderBottomWidth: 0.8, paddingVertical: 70}}>
        <View style={{ paddingHorizontal: 11 }}>
          <TextScallingFalse style={{ color: 'white', fontSize: 25, fontWeight: '700' }}>Hey @{user?.username}</TextScallingFalse>
        </View>
        <View style={styles.CaptionTextCover}>
          <TextScallingFalse style={styles.CaptionTexts}>Hope you are doing great!</TextScallingFalse>
        </View>
        <View style={{ flexDirection: 'row', gap: 7 }}>
          <View style={[styles.CaptionTextCover, { borderColor: 'orange', borderWidth: 1.8 }]}>
            <TextScallingFalse style={styles.CaptionTexts}>Your</TextScallingFalse>
          </View>
          <View style={[styles.CaptionTextCover, { backgroundColor: '#12965B', borderColor:'black', borderWidth: 1.8 }]}>
            <TextScallingFalse style={styles.CaptionTexts}>feedback will help</TextScallingFalse>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 7 }}>
          <View style={styles.CaptionTextCover}>
            <TextScallingFalse style={styles.CaptionTexts}>Us improve and</TextScallingFalse>
          </View>
          <View style={[styles.CaptionTextCover, { borderColor: '#12965B', borderWidth: 1.8 }]}>
            <TextScallingFalse style={styles.CaptionTexts}>Serve</TextScallingFalse>
          </View>
        </View>
        <View style={[styles.CaptionTextCover, { flexDirection:'row', paddingHorizontal: 10,alignItems:'center'}]}>
          <TextScallingFalse style={[styles.CaptionTexts,{fontSize: 24, paddingHorizontal: 12}]}>You better</TextScallingFalse>
          <MaterialIcons name="double-arrow" size={33} color="orange" />
        </View>
      </View> 
      </View>

      <View style={{width:'100%', paddingHorizontal: 30, paddingVertical: 20}}>
      <TouchableOpacity activeOpacity={0.7}
       style={{paddingVertical: 10, backgroundColor:'#12965B', gap: 10, alignItems:'center',
       paddingHorizontal: 25, borderRadius: 25, flexDirection:"row"}}>
        <TextScallingFalse style={{color:'white', fontSize: 17, fontWeight:'500'}}>Let's Go</TextScallingFalse>
        <AntDesign name="arrowright" size={20} color="white" />
      </TouchableOpacity>
      </View>
    </PageThemeView>
  )
}

export default feedback

const styles = StyleSheet.create({
  CaptionTextCover: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 40,
    paddingVertical: 7,
    paddingHorizontal: 20
  },
  CaptionTexts:{
    color: 'white', 
    fontSize: 20, 
    fontWeight: '500'
  }
})