import React, { memo, useEffect, useState } from "react";
import { Image, View, TouchableOpacity, Pressable } from "react-native";
import TextScallingFalse from "../CentralText";
import { SuggestTeam } from "~/types/team";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import nocoverpic from "@/assets/images/nocover.png";
import nopic from "@/assets/images/nopic.jpg";
import { Entypo } from "@expo/vector-icons";
import { RootState } from "~/reduxStore";
import MultipleProfiles from "../ui/atom/MultipleProfiles";
import FollowerText from "../ui/atom/FollowerText";
import { FollowUser } from "~/types/user"; // Replace with actual path
import { useFollow } from "~/hooks/useFollow";

const TeamSuggestionCard = ({
  team,
  removeSuggestion,
  size,
  onboarding,
  isSelected,
}: {
  team: SuggestTeam;
  removeSuggestion: (id: string) => void;
  size: string;
  onboarding?: boolean;
  isSelected?: (id: string) => void;
}) => {
  const router = useRouter();
  const isFollowing = useSelector((state: RootState) =>
    state.profile?.followings?.includes(team._id)
  );
  const { followUser, unFollowUser } = useFollow();
  const [followingStatus, setFollowingStatus] = useState(isFollowing);

  useEffect(() => {
    setFollowingStatus(isFollowing);
  }, [isFollowing]);

  // Optimistic follow
  const handleFollow = async () => {
    try {
      if (isSelected) isSelected(team._id);
      setFollowingStatus(true);

      const followData: FollowUser = {
        followingId: team._id,
        followingType: "Team",
      };

      await followUser(followData, true);
    } catch (err) {
      setFollowingStatus(false);
      console.error("Follow error:", err);
    }
  };

  // Optimistic unfollow
  const handleUnfollow = async () => {
    try {
      if (isSelected) isSelected(team._id);
      setFollowingStatus(false);

      const unfollowData: FollowUser = {
        followingId: team._id,
        followingType: "Team",
      };

      await unFollowUser(unfollowData, true);
    } catch (err) {
      setFollowingStatus(true);
      console.error("Unfollow error:", err);
    }
  };

  //handle go to profile
  const goToProfile = () => {
    router.push(`/(app)/(team)/teams/${team._id}`);
  };

  return (
    <Pressable
      className={`bg-black rounded-xl p-5 mb-4 relative border justify-between ${
        size === "small" ? "w-[150px] h-[180px]" : "w-full h-[180px]"
      } border-[#323232] overflow-hidden`}
      onPress={goToProfile}
    >
      {/* Close Button */}
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => removeSuggestion(team._id)}
        className="absolute right-2 top-2 z-30 bg-black rounded-full w-6 h-6 items-center justify-center opacity-60"
      >
        <TextScallingFalse className="text-white text-5xl">×</TextScallingFalse>
      </TouchableOpacity>

      <View className="flex-col">
        {/* Details section */}
        <View className="basis-[80%] flex-row gap-x-3">
          {/* Profile Image */}
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={goToProfile}
            disabled={onboarding}
            className={`rounded-[10px] ${
              size === "small" ? "w-[50px] h-[50px]" : "w-[60px] h-[60px]"
            } items-center justify-center flex-shrink-0 border-[2px] border-[#181818] z-20 overflow-hidden`}
          >
            <Image
              source={team.logo ? { uri: team.logo.url } : nopic}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Name and headline */}
          <View className="flex-col gap-y-5">
            <View>
              <TextScallingFalse
                className={`text-white ${
                  size === "small" ? "text-2xl" : "text-3xl"
                } font-semibold`}
              >
                {team.name}
              </TextScallingFalse>
              <TextScallingFalse
                className={`text-[#9F9F9F] ${
                  size === "small" ? "text-sm" : "text-lg"
                }`}
              >
                {team.address?.city} {team.address?.state}{" "}
                {team.address?.country}
              </TextScallingFalse>
            </View>
            {team.supporters &&
              team.supporters.length > 0 &&
              team.supporterCount > 1 && (
                <View className="flex-row items-center">
                  <MultipleProfiles users={team.supporters} />
                  <View className="w-[55%]">
                    <FollowerText
                      user={{
                        followers: team.supporters,
                        followerCount: team.supporterCount,
                      }}
                    />
                  </View>
                </View>
              )}
          </View>
        </View>

        {/* Follow/Unfollow button */}
        <View className="basis-[20%]">
          <TouchableOpacity
            className="border-[1px] rounded-3xl px-8 border-[#555555] h-10 flex items-center justify-center"
            activeOpacity={0.6}
            onPress={followingStatus ? handleUnfollow : handleFollow}
          >
            {followingStatus ? (
              <TextScallingFalse className="text-2xl text-center text-[#DEDEDE]">
                <Entypo
                  className="mr-4"
                  name="check"
                  size={14}
                  color="#DEDEDE"
                />
                Supporting
              </TextScallingFalse>
            ) : (
              <TextScallingFalse className="text-2xl text-center text-[#DEDEDE]">
                Support
              </TextScallingFalse>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

export default memo(TeamSuggestionCard);
