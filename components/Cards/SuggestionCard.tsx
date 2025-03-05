import React, { memo, useEffect, useState } from "react";
import { Image, View, TouchableOpacity } from "react-native";
import TextScallingFalse from "../CentralText";
import { FollowUser, SuggestionUser } from "~/types/user";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import nocoverpic from "@/assets/images/nocover.png";
import nopic from "@/assets/images/nopic.jpg";
import { useFollow } from "~/hooks/useFollow";
import { Entypo } from "@expo/vector-icons";
import { RootState } from "~/reduxStore";

const SuggestionCard = ({
  user,
  removeSuggestion,
  size,
  isSelected,
}: {
  user: SuggestionUser;
  removeSuggestion: (id: string) => void;
  size: string;
  isSelected?: (id: string) => void;
}) => {
  const router = useRouter();
  const serializedUser = encodeURIComponent(
    JSON.stringify({ id: user._id, type: user.type }),
  );
  const isFollowing = useSelector((state: RootState) =>
    state.auth?.user?.followings?.has(user._id),
  );
  // console.log(userFollowings);
  const [followingStatus, setFollowingStatus] = useState(isFollowing);

  useEffect(() => {
    setFollowingStatus(isFollowing);
  }, [isFollowing]); // Sync when Redux state changes
  const { followUser, unFollowUser } = useFollow();

  const handleSelected = () => {
    if (isSelected) {
      isSelected(user._id);
    }
  };
  //handle follow
  // const handleFollow = async () => {
  //   try {
  //     setFollowingStatus(true);
  //     const followData: FollowUser = {
  //       followingId: user._id,
  //       followingType: user.type || "User",
  //     };

  //     await followUser(followData);
  //   } catch (err) {
  //     setFollowingStatus(false);
  //     console.error("Follow error:", err);
  //   }
  // };
  // //handle isSelected

  // //handle unfollow
  // const handleUnfollow = async () => {
  //   try {
  //     setFollowingStatus(false);
  //     const unfollowData: FollowUser = {
  //       followingId: user._id,
  //       followingType: user.type || "User",
  //     };

  //     await unFollowUser(unfollowData);
  //   } catch (err) {
  //     setFollowingStatus(true);
  //     console.error("Unfollow error:", err);
  //   }
  // };

  //handle follow
  const handleFollow = async () => {
    try {
      if (isSelected) {
        isSelected(user._id); // Add to selected players
      }
      setFollowingStatus(true);
      const followData: FollowUser = {
        followingId: user._id,
        followingType: user.type || "User",
      };

      await followUser(followData);
    } catch (err) {
      setFollowingStatus(false);
      console.error("Follow error:", err);
    }
  };

  //handle unfollow
  const handleUnfollow = async () => {
    try {
      if (isSelected) {
        isSelected(user._id); // Remove from selected players
      }
      setFollowingStatus(false);
      const unfollowData: FollowUser = {
        followingId: user._id,
        followingType: user.type || "User",
      };

      await unFollowUser(unfollowData);
    } catch (err) {
      setFollowingStatus(true);
      console.error("Unfollow error:", err);
    }
  };

  return (
    <View
      className={`bg-black rounded-xl pb-4 m-1 relative border ${
        size === "small" ? "w-[150px] h-[180px]" : "w-[45%] h-[200px]"
      } border-[#80808085] overflow-hidden`}
    >
      {/* Close Button */}
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => removeSuggestion(user._id)}
        className="absolute right-2 top-2 z-30 bg-black rounded-full w-6 h-6 items-center justify-center opacity-60"
      >
        <TextScallingFalse className="text-white text-lg">×</TextScallingFalse>
      </TouchableOpacity>

      <View
        className={`${
          size === "small" ? "h-14" : "h-16"
        } rounded-t-xl overflow-hidden`}
      >
        <Image
          source={user.coverPic ? { uri: user.coverPic } : nocoverpic}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Profile Image positioned outside the cover's container */}
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => router.push(`../(main)/profile/${serializedUser}`)}
        className={`absolute left-1/2 -translate-x-1/2 bg-white rounded-full ${
          size === "small" ? "w-16 h-16" : "w-20 h-20"
        } items-center justify-center flex-shrink-0 border border-black z-20 overflow-hidden`}
        style={{ marginTop: "10%" }}
      >
        <Image
          source={user.profilePic ? { uri: user.profilePic } : nopic}
          className="w-full h-full"
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View className="items-center flex-grow">
        <View className="flex-grow pt-10 px-1.5 items-center justify-between">
          {/* Name and headline */}
          <View className="w-4/5">
            <TextScallingFalse
              className={`text-white ${
                size === "small" ? "text-xl" : "text-2xl"
              } font-semibold text-center`}
            >
              {user.firstName} {user.lastName}
            </TextScallingFalse>
            <TextScallingFalse
              className={`text-gray-400 ${
                size === "small" ? "text-xs" : "text-sm"
              } text-center`}
            >
              {user.headline && user.headline.length >= 50
                ? user.headline.substring(0, 49).concat("...")
                : user.headline}
            </TextScallingFalse>
          </View>

          {/* Follow Button */}
          <TouchableOpacity
            className={`mt-4 border rounded-xl px-8 py-1.5 ${
              followingStatus ? "border border-[#ffffff]" : "bg-[#12956B]"
            } `}
            activeOpacity={0.6}
            onPress={followingStatus ? handleUnfollow : handleFollow}
          >
            {followingStatus ? (
              <TextScallingFalse className="text-center text-lg text-white">
                <Entypo className="mr-4" name="check" size={14} color="white" />
                Unfollow
              </TextScallingFalse>
            ) : (
              <TextScallingFalse className="text-center text-lg text-white">
                Follow
              </TextScallingFalse>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(SuggestionCard);
