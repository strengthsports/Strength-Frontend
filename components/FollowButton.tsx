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
  handleFollow,
  handleUnfollow,
  handleOpenModal,
  onboarding = false,
}: {
  size: string;
  followingStatus: boolean;
  handleFollow: () => void;
  handleUnfollow: () => void;
  handleOpenModal?: () => void;
  onboarding?: boolean;
}) => {
  return (
    <TouchableOpacity
      className={`border ${
        size === "regular" ? "rounded-xl px-8" : "rounded-lg px-4"
      } py-1.5 ${
        followingStatus ? "border border-[#ffffff]" : "bg-[#12956B]"
      } `}
      activeOpacity={0.6}
      onPress={
        followingStatus
          ? onboarding
            ? handleUnfollow
            : handleOpenModal
          : handleFollow
      }
    >
      {followingStatus ? (
        <TextScallingFalse
          className={size === "regular" ? regularFollowText : smallFollowText}
        >
          <Entypo className="mr-4" name="check" size={14} color="white" />
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
