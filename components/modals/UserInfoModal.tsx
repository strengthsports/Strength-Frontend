import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import TextScallingFalse from "../CentralText";
import { useRouter } from "expo-router";
import ModalLayout1 from "./layout/ModalLayout1";
import { MaterialIcons } from "@expo/vector-icons";
import nopic from "@/assets/images/nopic.jpg";
import Captain from "../SvgIcons/teams/Captain";
import CaptainSq from "../SvgIcons/teams/CaptainSq";
import ViceCaptainSq from "../SvgIcons/teams/ViceCaptainSq";
import { useFollow } from "~/hooks/useFollow";
import { FollowUser } from "~/types/user";
import { useSelector } from "react-redux";
import { RootState } from "~/reduxStore";

const btn = "rounded-xl border border-[#12956B] py-2 w-[40%]";
const roleViews =
  "rounded-2xl bg-[#141414] w-full p-5 flex-row justify-between items-center";
const visiblePosition = ["Captain", "Vice-Captain", "Admin"];

const UserInfoModal = ({ visible, onClose, member, isTeam }: any) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.profile.user);
  // Initialize with member.isFollowing or false if member is null/undefined
  const [followingStatus, setFollowingStatus] = useState<boolean>(
    member?.isFollowing ?? false
  );

  // Update state when member changes (e.g., when modal reopens with different member)
  useEffect(() => {
    setFollowingStatus(member?.isFollowing ?? false);
  }, [member]);

  const serializedUser = encodeURIComponent(
    JSON.stringify({ id: member?._id, type: "User" })
  );

  const { followUser, unFollowUser } = useFollow();

  const handleFollowToggle = async () => {
    // Return early if member is not available
    if (!member) {
      console.warn("Member is null/undefined");
      return;
    }

    const wasFollowing = followingStatus; // Use local state instead of member.isFollowing
    const followData: FollowUser = {
      followingId: member._id,
      followingType: "User",
    };

    try {
      // Optimistic UI update
      setFollowingStatus(!wasFollowing);

      // Execute the appropriate action
      if (wasFollowing) {
        await unFollowUser(followData);
      } else {
        await followUser(followData);
      }
    } catch (err) {
      // Revert on error
      setFollowingStatus(wasFollowing);
      console.error(wasFollowing ? "Unfollow error:" : "Follow error:", err);
      Alert.alert("Error", `Failed to ${wasFollowing ? "unfollow" : "follow"}`);
    }
  };

  const handleViewProfile = () => {
    if (!member) return;
    console.log("Handle view profile");
    onClose();
    router.push(`/(app)/(profile)/profile/${serializedUser}`);
  };

  if (!visible || !member) return null;

  return (
    <ModalLayout1
      onClose={onClose}
      visible={visible}
      heightValue={isTeam ? 2.1 : 1.8}
    >
      <View className="pt-10">
        <View className="relative">
          <Image
            source={member.profilePic ? { uri: member.profilePic } : nopic}
            style={styles.profileImage}
          />
          <View className="mt-4 flex-row items-center">
            <TextScallingFalse className="text-white text-5xl font-semibold">
              {member.firstName} {member.lastName}
            </TextScallingFalse>
            <View className="ml-1.5">
              {isTeam && member.position === "Captain" ? (
                <CaptainSq />
              ) : member.position ? (
                <ViceCaptainSq />
              ) : null}
            </View>
          </View>
          <TextScallingFalse className="text-[#B5B5B5] font-regular w-3/4">
            @{member.username} | {member.headline || "No description available"}
          </TextScallingFalse>
        </View>

        {/* Buttons Container */}
        <View className="flex-row justify-start items-center gap-x-5 mt-8">
          {/* Follow / Following Button */}
          {user?._id !== member._id && (
            <TouchableOpacity
              onPress={handleFollowToggle}
              className={`${btn} bg-[#12956B]`}
            >
              {followingStatus ? (
                <TextScallingFalse className="text-white font-medium text-center">
                  ✓ Following
                </TextScallingFalse>
              ) : (
                <TextScallingFalse className="text-white font-medium text-center">
                  Follow
                </TextScallingFalse>
              )}
            </TouchableOpacity>
          )}

          {/* View Profile Button */}
          <TouchableOpacity
            className={btn}
            onPress={handleViewProfile}
            disabled={!member}
          >
            <TextScallingFalse className="text-white font-medium text-center">
              View Profile
            </TextScallingFalse>
          </TouchableOpacity>
        </View>

        {/* Role views */}
        <View className="mt-8 gap-y-4">
          <View className={roleViews}>
            <TextScallingFalse className="font-medium text-[#CFCFCF]">
              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
            </TextScallingFalse>
          </View>

          {!isTeam && (
            <TouchableOpacity className={roleViews}>
              <TextScallingFalse className="text-[#D44044]">
                Remove '{member.firstName} {member.lastName}'
              </TextScallingFalse>
              <MaterialIcons name="do-not-disturb" size={17} color="#D44044" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ModalLayout1>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 78,
    height: 78,
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: "#313131",
  },
});

export default UserInfoModal;
