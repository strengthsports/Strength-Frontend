import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import React from "react";
import nopic from "@/assets/images/nopic.jpg";
import TextScallingFalse from "../CentralText";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");

const SearchHistoryProfile = ({
  name,
  username,
  profilePic,
  _id,
  type,
}: {
  name: string;
  username: string;
  profilePic?: string; // ✅ Accept profilePic as an optional prop
  _id: string;
  type: string;
}) => {
  const serializedUser = encodeURIComponent(
    JSON.stringify({ id: _id, type: type })
  );

  return (
    <View
      className="items-center rounded-xl border-[0.5px] border-[#606060] py-4"
      style={{ width: width * 0.22 }}
    >
      <Link href={`/(app)/(profile)/profile/${serializedUser}`} asChild>
        <TouchableOpacity className="items-center" style={{ gap: 4 }}>
          {/* Profile Image */}
          <Image
            className="rounded-full mb-1 border border-[#2F2F2F]"
            source={
              profilePic && profilePic.trim() !== ""
                ? { uri: profilePic }
                : nopic
            }
            style={{ width: 38, height: 38 }}
          />
          <View>
            {/* Name */}
            <TextScallingFalse
              className="text-white font-semibold text-center"
              numberOfLines={1}
              style={{ fontSize: 10, maxWidth: "80%" }}
            >
              {name}
            </TextScallingFalse>

            {/* Username */}
            <TextScallingFalse
              className="text-[#71767b] text-center"
              numberOfLines={1}
              style={{ fontSize: 8, maxWidth: "80%" }}
            >
              @{username}
            </TextScallingFalse>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default SearchHistoryProfile;
