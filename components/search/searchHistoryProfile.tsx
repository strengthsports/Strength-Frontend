import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import React from "react";
import nopic from "@/assets/images/nopic.jpg";
import TextScallingFalse from "../CentralText";

const { width } = Dimensions.get("window");

const SearchHistoryProfile = ({
  name,
  username,
  profilePic,
}: {
  name: string;
  username: string;
  profilePic?: string; // ✅ Accept profilePic as an optional prop
}) => {
  return (
    <View
      className="items-center rounded-md border-[0.5px] border-[#808080] py-2"
      style={{ width: width * 0.22 }}
    >
      <TouchableOpacity
        className="items-center"
        activeOpacity={0.7}
        style={{ gap: 4 }}
      >
        {/* Profile Image */}
        <Image
          className="rounded-full mb-1"
          source={
            profilePic && profilePic.trim() !== "" ? { uri: profilePic } : nopic
          }
          style={{ width: 35, height: 35 }}
        />

        {/* Name */}
        <TextScallingFalse
          className="text-white font-semibold text-center"
          numberOfLines={1}
          style={{ fontSize: 12, maxWidth: "90%" }}
        >
          {name}
        </TextScallingFalse>

        {/* Username */}
        <TextScallingFalse
          className="text-[#71767b] text-center"
          numberOfLines={1}
          style={{ fontSize: 10, maxWidth: "90%" }}
        >
          @{username}
        </TextScallingFalse>
      </TouchableOpacity>
    </View>
  );
};

export default SearchHistoryProfile;
