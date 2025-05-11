import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import TextScallingFalse from "./CentralText";
import { Entypo } from "@expo/vector-icons";

const regularFollowText = "text-center text-lg text-white";
const smallFollowText = "text-center text-base text-white";

const FollowButton = ({
  size = "regular",
  followingStatus,
  handleFollowToggle,
  handleOpenModal,
  onboarding = false,
}: {
  size: string;
  followingStatus: boolean;
  handleFollowToggle: () => void;
  handleOpenModal?: () => void;
  onboarding?: boolean;
}) => {
  return (
    <TouchableOpacity
      className={`border ${
        size === "regular" ? "rounded-xl px-8" : "rounded-lg px-4"
      } py-1.5 ${followingStatus ? "border" : "bg-[#12956B]"} `}
      style={{
        borderColor: followingStatus ? "#cacaca" : "#12956B",
      }}
      activeOpacity={0.6}
      onPress={handleFollowToggle}
    >
      {followingStatus ? (
        <TextScallingFalse
          className={size === "regular" ? regularFollowText : smallFollowText}
        >
          Following
        </TextScallingFalse>
      ) : (
        <TextScallingFalse
          className={size === "regular" ? regularFollowText : smallFollowText}
        >
          Follow
        </TextScallingFalse>
      )}
    </TouchableOpacity>
  );
};

export default FollowButton;

const styles = StyleSheet.create({});
