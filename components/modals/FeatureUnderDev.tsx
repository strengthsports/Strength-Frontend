import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Public from "@/assets/images/public.gif";
import { Image } from "expo-image";

interface FeatureUnderDevProps {
    isVisible: boolean;
    onClose: () => void;
}


const FeatureUnderDev = ({ isVisible, onClose }: FeatureUnderDevProps) => {
    if (!isVisible) return null;
    return (
        <View style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: 'absolute',
            zIndex: 100,
        }}>
            <View style={{ width: '80%', backgroundColor: '#181818', borderTopRightRadius: 15, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, borderBottomRightRadius: 15}}>
            <View style={{height: 170,}}>
            <Image source={Public} style={{ width: "100%", height: "100%", borderTopRightRadius: 15, borderTopLeftRadius: 15, resizeMode: 'cover'}} />
            </View>
            <View style={{padding: 20, gap: 20, justifyContent:'center', alignItems:'center', paddingHorizontal: 30}}>
            <Text style={{ color: 'white', fontSize: 15, fontWeight: '300', textAlign:'center'}}>By default the posts will be public for all users.</Text>
            <TouchableOpacity activeOpacity={0.5} style={{width: '70%', borderColor:'white', borderRadius: 20, justifyContent:'center', alignItems:'center', padding: 5, borderWidth: 0.4,}} onPress={onClose}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '400' }}>Close</Text>
            </TouchableOpacity>
            </View>
            </View>
        </View>
    )
}

export default FeatureUnderDev

const styles = StyleSheet.create({})