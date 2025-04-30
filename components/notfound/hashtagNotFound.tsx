import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import TextScallingFalse from "../CentralText";
import { useRouter } from "expo-router";

const HashtagNotFound = ({ text }: { text: string }) => {
  const router = useRouter();
  return (
    <View className="px-5">
      <View className="w-4/5">
        <TextScallingFalse className="font-bold text-[#eaeaea] text-7xl leading-none">
          No Results Found for
        </TextScallingFalse>
        <TextScallingFalse className="font-bold text-7xl text-[#eaeaea]">
          "<TextScallingFalse className="text-theme">#{text}</TextScallingFalse>
          "
        </TextScallingFalse>
        <View>
          <TextScallingFalse className="text-[#808080]">
            Empty stadium here! Why not make the first move and post with this
            tag?
          </TextScallingFalse>
        </View>
      </View>
      <View className="w-fit flex-row">
        <TouchableOpacity
          className="mt-4 rounded-full border border-[#808080] px-5 py-2"
          activeOpacity={0.7}
        >
          <TextScallingFalse className="text-[#eaeaea]">
            Add Post
          </TextScallingFalse>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HashtagNotFound;

const styles = StyleSheet.create({});
