import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import TextScallingFalse from "../CentralText";
import Public from "@/assets/images/train.gif";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";

interface ThisFeatureUnderDevProps {
  isVisible: boolean;
  onClose: () => void;
}

const ThisFeatureUnderDev = ({
  isVisible,
  onClose,
}: ThisFeatureUnderDevProps) => {
  if (!isVisible) return null;
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "absolute",
        zIndex: 100,
      }}
    >
      <View
        style={{
          width: "80%",
          backgroundColor: "#181818",
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
        }}
      >
        <View style={{ height: 190 }}>
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.5}
            style={{
              position: "absolute",
              zIndex: 100,
              left: "72%",
              top: "5%",
              height: "30%",
              width: "25%",
              alignItems: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                width: 35,
                height: 35,
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign name="close" size={18} color="white" />
            </View>
          </TouchableOpacity>
          <Image
            source={Public}
            style={{
              width: "100%",
              height: "100%",
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              resizeMode: "cover",
            }}
          />
        </View>
        <View
          style={{
            gap: 20,
            justifyContent: "center",
            alignItems: "center",
            padding: 30,
          }}
        >
          <TextScallingFalse
            style={{
              color: "white",
              fontSize: 15,
              fontWeight: "400",
              textAlign: "center",
            }}
          >
            This Feature is under development
          </TextScallingFalse>
          {/* <TouchableOpacity activeOpacity={0.5} style={{width: '70%', borderRadius: 20, justifyContent:'center', backgroundColor:'#12956B', alignItems:'center', padding: 5,}} onPress={onClose}>
            <TextScallingFalse style={{ color: 'white', fontSize: 12, fontWeight: '400' }}>Close</TextScallingFalse>
            </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};

export default ThisFeatureUnderDev;

const styles = StyleSheet.create({});
