import React from "react";
import { View, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import TextScallingFalse from "~/components/CentralText";
import { FontAwesome5 } from '@expo/vector-icons';

export default function ModalScreen() {
  const router = useRouter();
  const { picType } = useLocalSearchParams(); 


  return (
    <Pressable style={styles.modalContainer} onPress={() => router.back()}>
      <View style={{width: '100%', backgroundColor: '#1D1D1D', borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
        <View style={{justifyContent:'center', alignItems:'center', padding: 15, gap: 4}}>
        <TextScallingFalse style={{color:'white', fontSize: 13, fontWeight: '500'}}>{picType === "cover" ? "Add Tour Cover Picture" : "Add your Profile Picture"}</TextScallingFalse>
        <View style={{height: 1, backgroundColor:'white', width: '28%'}} />
        </View>
        <View style={{width: '100%',justifyContent:'center', alignItems:'center', padding: 20, marginBottom:'3%'}}>
        <TouchableOpacity activeOpacity={0.7} style={{ flexDirection:'row', gap:'3%', paddingHorizontal: 30}}>
        <FontAwesome5 name="images" style={{marginTop: '1%'}} size={24} color="white" />
        <View>
        <TextScallingFalse style={{color:'white', fontSize: 16, fontWeight:'semibold'}}>{picType === "cover" ? "Upload your Cover Picture" : "Upload your Profile Picture"}</TextScallingFalse>
        <TextScallingFalse style={{ color: 'white', fontSize: 13, fontWeight: '300',}}> {picType === "cover" ? "On Strength we require members to use their standard details so upload a meaningful cover pic" : "On Strength we require members to use their real identities so upload a photo of yourself"}</TextScallingFalse>
        </View>
        </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalText: {
    color: "black",
    fontSize: 18,
    marginBottom: 20,
  },
});
