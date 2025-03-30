import { View, TouchableOpacity, Text } from "react-native";
import React, { memo } from "react";
import { RelativePathString, useRouter } from "expo-router";
import { AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";
import { Platform } from "react-native";

const interactionBtn = `flex flex-row justify-between items-center gap-2 bg-black px-4 py-[6px] rounded-3xl`;
const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  android: {
    elevation: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.25,
  },
});

const InteractionBar = ({
  postId,
  onPressLike,
  isLiked,
  likesCount,
  commentsCount,
  assetsCount,
  activeSlideIndex,
  likePageRoute,
  commentPageRoute,
  isPostContainer,
  isFeedPage,
}: {
  postId: string;
  onPressLike: () => void;
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  assetsCount?: number;
  activeSlideIndex?: number;
  likePageRoute?: string;
  commentPageRoute?: string;
  isPostContainer?: boolean;
  isFeedPage?: boolean;
}) => {
  const router = useRouter();

  return (
    <View
      className={`${
        isPostContainer
          ? "bg-neutral-900 relative left-[5%] bottom-1 z-[-10] pt-1 w-[100%] rounded-br-[35px] rounded-bl-[40px]"
          : "w-[100%] bg-transparent"
      } min-h-12 h-auto`}
    >
      <View
        className={`w-full ${
          isPostContainer ? "pl-8 pr-12" : "px-8"
        } py-3 flex flex-row justify-between items-center`}
      >
        {/* like */}
        <TouchableOpacity
          className="flex flex-row items-center gap-2"
          onPress={() => {
            router.push(`/post-details/${postId}/likes`);
          }}
        >
          <AntDesign name="like1" size={16} color="#fbbf24" />
          <Text className="text-base text-white font-light">
            {likesCount} {likesCount > 1 ? "Likes" : "Like"}
          </Text>
        </TouchableOpacity>

        {isPostContainer && assetsCount && assetsCount > 1 ? (
          <View className="flex-row justify-center">
            {Array.from({ length: assetsCount }).map((_, i) => (
              <View
                key={`dot-${i}`}
                className={
                  i === activeSlideIndex
                    ? "w-1.5 h-1.5 rounded-full bg-white mx-0.5"
                    : "w-1.5 h-1.5 rounded-full bg-white/50 mx-0.5"
                }
              />
            ))}
          </View>
        ) : (
          <View />
        )}

        {/* comment count */}
        <TouchableOpacity
          className="flex flex-row items-center gap-2"
          onPress={() => {
            isFeedPage &&
              router.push({
                pathname: `/post-details/${postId}` as RelativePathString,
              });
          }}
        >
          <Text className="text-base text-white font-light">
            {commentsCount} Comments
          </Text>
        </TouchableOpacity>
      </View>

      <View
        className={`w-[80%] mx-auto py-5 mb-1 flex flex-row ${
          isPostContainer ? "justify-end" : "justify-center"
        } gap-x-4 items-center border-t-[0.5px] border-[#5C5C5C]`}
      >
        {/* like */}
        <TouchableOpacity
          onPress={onPressLike}
          className="flex flex-row items-center gap-2 relative"
        >
          <View className={interactionBtn} style={shadowStyle}>
            <AntDesign
              name={isLiked ? "like1" : "like2"}
              size={16}
              color={isLiked ? "#FABE25" : "white"}
            />
            <Text
              className={`text-base ${
                isLiked ? "text-amber-400" : "text-white"
              }`}
            >
              {isLiked ? "Liked" : "Like"}
            </Text>
          </View>
        </TouchableOpacity>
        {/* comment now */}
        <TouchableOpacity
          className="flex flex-row items-center gap-2 relative"
          onPress={() => {
            !isFeedPage &&
              router.push({
                pathname: `/post-details/${postId}` as RelativePathString,
              });
          }}
        >
          <View className={interactionBtn} style={shadowStyle}>
            <Feather name="message-square" size={16} color="white" />
            <Text className="text-base text-white">Comment</Text>
          </View>
        </TouchableOpacity>
        {/* share */}
        <TouchableOpacity className="mr-3 flex flex-row items-center gap-2 relative">
          {/* The main button */}
          <View className={interactionBtn} style={shadowStyle}>
            <FontAwesome5 name="location-arrow" size={16} color="white" />
            <Text className="text-base text-white">Share</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(InteractionBar);
