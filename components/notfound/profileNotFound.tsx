import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import TextScallingFalse from "../CentralText";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ProfileNotFound = () => {
  const router = useRouter();
  return (
    <View className="w-4/5">
      <TextScallingFalse className="font-bold text-[#eaeaea] text-7xl leading-none">
        Profile Not Found
      </TextScallingFalse>
      <View>
        <TextScallingFalse className="text-[#808080]">
          Double-check the spelling or scout another profile!
        </TextScallingFalse>
      </View>
      <View className="w-fit flex-row">
        <TouchableOpacity
          className="mt-4 rounded-full border border-[#808080] px-5 py-2 flex-row items-center gap-x-2"
          activeOpacity={0.7}
          onPress={() => router.push("/(app)/searchPage")}
        >
          <AntDesign name="search1" size={12} color="#eaeaea" />
          <TextScallingFalse className="text-[#eaeaea]">
            Search
          </TextScallingFalse>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileNotFound;

const styles = StyleSheet.create({});
