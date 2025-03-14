import { View, TouchableOpacity } from "react-native";
import React from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import TextScallingFalse from "../CentralText";
import PostButton from "../PostButton";
import { useRouter } from "expo-router";

const Header = ({
  username,
  isBackButtonVisible,
}: {
  username: string;
  isBackButtonVisible: boolean;
}) => {
  const router = useRouter();
  return (
    <View className="flex-row justify-between items-center h-[45px] px-3">
      <View className="flex-row">
        {/* back to home button */}
        {isBackButtonVisible && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => router.replace("/")}
          >
            <Feather name="chevron-left" size={28} color="white" />
          </TouchableOpacity>
        )}
        {/* username */}
        <TextScallingFalse
          style={{
            color: "white",
            fontSize: 19,
            marginLeft: 10,
          }}
        >
          @{username}
        </TextScallingFalse>
      </View>
      {/* add post button and message button */}
      <View className="flex-row gap-x-3">
        <PostButton />
        <TouchableOpacity activeOpacity={0.5}>
          <MaterialCommunityIcons
            name="message-reply-text-outline"
            size={27}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
