import React, { memo, useEffect, useState } from "react";
import { Image, View, TouchableOpacity, Modal as RNModal } from "react-native";
import TextScallingFalse from "../CentralText";
import { FollowUser, SuggestionUser } from "~/types/user";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import nocoverpic from "@/assets/images/nocover.png";
import nopic from "@/assets/images/nopic.jpg";
import { useFollow } from "~/hooks/useFollow";
import { Entypo } from "@expo/vector-icons";
import { RootState } from "~/reduxStore";
import { Divider } from "react-native-elements";
import MultipleProfiles from "../ui/atom/MultipleProfiles";
import FollowerText from "../ui/atom/FollowerText";

const PageSuggestionCard = ({
  user,
  removeSuggestion,
  size,
  onboarding,
  isSelected,
}: {
  user: SuggestionUser;
  removeSuggestion: (id: string) => void;
  size: string;
  onboarding?: boolean;
  isSelected?: (id: string) => void;
}) => {
  const router = useRouter();
  const serializedUser = encodeURIComponent(
    JSON.stringify({ id: user._id, type: "Page" })
  );
  const isFollowing = useSelector((state: RootState) =>
    state.profile?.followings?.includes(user._id)
  );
  // console.log(userFollowings);
  const [followingStatus, setFollowingStatus] = useState(isFollowing);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setFollowingStatus(isFollowing);
  }, [isFollowing]); // Sync when Redux state changes
  const { followUser, unFollowUser } = useFollow();

  //handle follow
  const handleFollow = async () => {
    try {
      if (isSelected) {
        isSelected(user._id); // Add to selected players
      }
      setFollowingStatus(true);
      const followData: FollowUser = {
        followingId: user._id,
        followingType: "Page",
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
      setModalOpen(false);
      setFollowingStatus(false);
      const unfollowData: FollowUser = {
        followingId: user._id,
        followingType: "Page",
      };
      if (isSelected) {
        isSelected(user._id); // Remove from selected players
      }

      await unFollowUser(unfollowData);
    } catch (err) {
      setFollowingStatus(true);
      console.error("Unfollow error:", err);
    } finally {
      setModalOpen(false);
    }
  };

  //handle isSelected
  const handleSelected = () => {
    if (isSelected) {
      isSelected(user._id);
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  return (
    <>
      <View
        className={`bg-black rounded-xl pb-4 mb-4 relative border ${
          size === "small" ? "w-[150px] h-[180px]" : "w-[100%] h-[200px]"
        } border-[#80808085] overflow-hidden`}
      >
        {/* Close Button */}
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => removeSuggestion(user._id)}
          className="absolute right-2 top-2 z-30 bg-black rounded-full w-6 h-6 items-center justify-center opacity-60"
        >
          <TextScallingFalse className="text-white text-lg">
            ×
          </TextScallingFalse>
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
          onPress={() =>
            router.push(`/(app)/(profile)/profile/${serializedUser}`)
          }
          disabled={onboarding}
          className={`absolute left-5 bg-white rounded-full ${
            size === "small" ? "w-16 h-16" : "w-20 h-20"
          } items-center justify-center flex-shrink-0 border border-black z-20 overflow-hidden`}
          style={{ marginTop: "5%" }}
        >
          <Image
            source={user.profilePic ? { uri: user.profilePic } : nopic}
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View className="relative items-start flex-grow">
          <View className="flex-grow pt-12 px-6 items-start justify-between">
            {/* Name and headline */}
            <View className="w-4/5">
              <TextScallingFalse
                className={`text-white ${
                  size === "small" ? "text-xl" : "text-2xl"
                } font-semibold`}
              >
                {user.firstName}
              </TextScallingFalse>
              <TextScallingFalse
                className={`text-[#EAEAEA] ${
                  size === "small" ? "text-xs" : "text-sm"
                }`}
              >
                {user.headline}
              </TextScallingFalse>
            </View>

            {/* Following information */}
            {user.followers &&
              user.followers.length > 0 &&
              user.followerCount > 1 && (
                <View className="flex-row items-center gap-x-2">
                  <MultipleProfiles users={user.followers} size="small" />
                  <FollowerText
                    user={{
                      followers: user.followers,
                      followerCount: user.followerCount,
                    }}
                  />
                </View>
              )}
          </View>
          {/* Follow Button */}
          <TouchableOpacity
            className={`absolute right-5 mt-4 border rounded-xl px-8 py-1.5 ${
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
              <TextScallingFalse className="text-center text-lg text-white">
                <Entypo className="mr-4" name="check" size={14} color="white" />
                Following
              </TextScallingFalse>
            ) : (
              <TextScallingFalse className="text-center text-lg text-white">
                Follow
              </TextScallingFalse>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {isModalOpen && (
        <RNModal
          visible={isModalOpen}
          animationType="slide"
          onRequestClose={() => setModalOpen(false)}
          transparent={true}
        >
          <TouchableOpacity
            className="flex-1 justify-end items-center bg-black/30"
            activeOpacity={1}
            onPress={() => setModalOpen(false)}
          >
            <View className="w-full mx-auto bg-black rounded-t-3xl p-5 pt-3 border-t-[0.5px] border-x-[0.5px] border-neutral-700">
              <Divider
                className="w-16 self-center rounded-full bg-neutral-700 mb-10"
                width={4}
              />
              <TextScallingFalse className="text-white text-4xl font-semibold">
                Unfollow {user?.firstName}
              </TextScallingFalse>
              <TextScallingFalse className="text-white mt-1 font-light text-sm">
                Stop seeing posts from {user?.firstName} on your feed.{" "}
                {user?.firstName} won't be notified that you've unfollowed
              </TextScallingFalse>
              <View className="items-center justify-evenly flex-row mt-5">
                {/* cancel unfollow */}
                <TouchableOpacity
                  activeOpacity={0.5}
                  className="px-14 py-1.5 justify-center items-center border rounded-xl border-[#12956B]"
                  onPress={() => setModalOpen(false)}
                >
                  <TextScallingFalse className="text-[#12956B] text-[1rem] font-medium">
                    Cancel
                  </TextScallingFalse>
                </TouchableOpacity>
                {/* do unfollow */}
                <TouchableOpacity
                  activeOpacity={0.5}
                  className="px-14 py-1.5 justify-center items-center bg-[#12956B] border rounded-xl border-[#12956B]"
                  onPress={handleUnfollow}
                >
                  <TextScallingFalse className="text-white text-[1rem] font-medium">
                    Unfollow
                  </TextScallingFalse>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </RNModal>
      )}
    </>
  );
};

export default memo(PageSuggestionCard);
