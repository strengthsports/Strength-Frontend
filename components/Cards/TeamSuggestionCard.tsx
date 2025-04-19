import React, { memo, useEffect, useState } from "react";
import { Image, View, TouchableOpacity, Modal as RNModal } from "react-native";
import TextScallingFalse from "../CentralText";
import { SuggestTeam } from "~/types/team";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import nocoverpic from "@/assets/images/nocover.png";
import nopic from "@/assets/images/nopic.jpg";
import { Entypo } from "@expo/vector-icons";
import { RootState } from "~/reduxStore";

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
  // const serializedUser = encodeURIComponent(
  //   JSON.stringify({ id: team._id, type: team.type })
  // );
  const isFollowing = useSelector((state: RootState) =>
    state.profile?.followings?.includes(team._id)
  );
  // console.log(userFollowings);
  const [followingStatus, setFollowingStatus] = useState(isFollowing);

  useEffect(() => {
    setFollowingStatus(isFollowing);
  }, [isFollowing]); // Sync when Redux state changes

  // console.log("Team details : ", team);

  return (
    <>
      <View
        className={`bg-black rounded-xl p-4 mb-4 relative border justify-between ${
          size === "small" ? "w-[150px] h-[180px]" : "w-full h-[200px]"
        } border-[#323232] overflow-hidden`}
      >
        {/* Close Button */}
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => removeSuggestion(team._id)}
          className="absolute right-2 top-2 z-30 bg-black rounded-full w-6 h-6 items-center justify-center opacity-60"
        >
          <TextScallingFalse className="text-white text-5xl">
            ×
          </TextScallingFalse>
        </TouchableOpacity>

        <View className="flex-row items-start gap-x-2 flex-grow">
          {/* Profile Image */}
          <TouchableOpacity
            activeOpacity={0.5}
            // onPress={() =>
            //   router.push(`/(app)/(profile)/profile/${serializedUser}`)
            // }
            disabled={onboarding}
            className={`bg-white rounded-xl ${
              size === "small" ? "w-12 h-12" : "w-16 h-16"
            } items-center justify-center flex-shrink-0 border border-black z-20 overflow-hidden`}
            // style={{ marginTop: "10%" }}
          >
            <Image
              source={team.logo ? { uri: team.logo.url } : nopic}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Name and headline */}
          <View className="flex-col items-start">
            <View>
              <TextScallingFalse
                className={`text-white ${
                  size === "small" ? "text-xl" : "text-2xl"
                } font-semibold`}
              >
                {team.name}
              </TextScallingFalse>
              <TextScallingFalse
                className={`text-[#9F9F9F] ${
                  size === "small" ? "text-xs" : "text-base"
                }`}
              >
                {team.address?.city} {team.address?.state}{" "}
                {team.address?.country}
              </TextScallingFalse>
            </View>
            <View>
              <TextScallingFalse className="mt-10 text-lg text-[#9F9F9F]">
                Ravi, M.S. Dhoni, and 14M others you know supports
              </TextScallingFalse>
            </View>
          </View>
        </View>

        <View>
          {/* Follow Button */}
          <TouchableOpacity
            className={`mt-4 border-[0.5px] rounded-3xl px-8 py-2 border-[#DEDEDE]`}
            activeOpacity={0.6}
          >
            {followingStatus ? (
              <TextScallingFalse className="text-center text-2xl text-[#DEDEDE]">
                <Entypo
                  className="mr-4"
                  name="check"
                  size={14}
                  color="#DEDEDE"
                />
                Supporting
              </TextScallingFalse>
            ) : (
              <TextScallingFalse className="text-center text-2xl text-[#DEDEDE]">
                Support
              </TextScallingFalse>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* {isModalOpen && (
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
                Unfollow {team?.name}
              </TextScallingFalse>
              <TextScallingFalse className="text-white mt-1 font-light text-sm">
                Stop seeing posts from {team?.firstName} on your feed.{" "}
                {team?.firstName} won't be notified that you've unfollowed
              </TextScallingFalse>
              <View className="items-center justify-evenly flex-row mt-5">
                <TouchableOpacity
                  activeOpacity={0.5}
                  className="px-14 py-1.5 justify-center items-center border rounded-xl border-[#12956B]"
                  onPress={() => setModalOpen(false)}
                >
                  <TextScallingFalse className="text-[#12956B] text-[1rem] font-medium">
                    Cancel
                  </TextScallingFalse>
                </TouchableOpacity>
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
      )} */}
    </>
  );
};

export default memo(TeamSuggestionCard);
