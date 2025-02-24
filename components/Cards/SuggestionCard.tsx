import React from "react";
import { Image, View, TouchableOpacity } from "react-native";
import TextScallingFalse from "../CentralText";
import { SuggestionUser } from "~/types/user";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import nocoverpic from "@/assets/images/nocover.png";
import nopic from "@/assets/images/nopic.jpg";

const SuggestionCard = ({
  user,
  removeSuggestion,
}: {
  user: SuggestionUser;
  removeSuggestion: (id: string) => void;
}) => {
  const router = useRouter();
  const serializedUser = encodeURIComponent(
    JSON.stringify({ id: user._id, type: user.type })
  );
  const userFollowings = useSelector(
    (state: any) => state.auth.user.followings
  );
  console.log(userFollowings);
  const isFollowing = userFollowings ? userFollowings.has(user._id) : false;
  return (
    <View className="bg-black rounded-xl pb-4 m-1 relative border w-[45%] h-[200px] border-[#80808085] overflow-hidden">
      {/* Close Button */}
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => removeSuggestion(user._id)}
        className="absolute right-2 top-2 z-30 bg-black rounded-full w-6 h-6 items-center justify-center opacity-60"
      >
        <TextScallingFalse className="text-white text-lg">×</TextScallingFalse>
      </TouchableOpacity>

      <View className="h-16 rounded-t-xl overflow-hidden">
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
        className="absolute left-1/2 -translate-x-1/2 bg-white rounded-full w-20 h-20 items-center justify-center flex-shrink-0 border border-black z-20 overflow-hidden"
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
            <TextScallingFalse className="text-white text-2xl font-semibold text-center">
              {user.firstName} {user.lastName}
            </TextScallingFalse>
            <TextScallingFalse className="text-gray-400 text-sm text-center">
              {user.headline && user.headline.length >= 50
                ? user.headline.substring(0, 49).concat("...")
                : user.headline}
            </TextScallingFalse>
          </View>

          {/* Follow Button */}
          <TouchableOpacity
            className="mt-4 border rounded-xl px-8 py-1.5 bg-[#12956B]"
            activeOpacity={0.6}
            // onPress={() => onSupport(user._id)}
          >
            <TextScallingFalse className="text-center text-lg text-white">
              {isFollowing ? "Unfollow" : "Follow"}
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SuggestionCard;
