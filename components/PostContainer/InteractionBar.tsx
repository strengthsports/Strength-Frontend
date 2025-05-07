import { View, TouchableOpacity, Text } from "react-native";
import React, { memo } from "react";
import { RelativePathString, useRouter } from "expo-router";
import { AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";
import { Platform } from "react-native";
import TextScallingFalse from "../CentralText";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";
import { useShare } from "~/hooks/useShare";
import { Post } from "~/types/post";

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
  post,
  onPressLike,
  onPressComment,
  activeSlideIndex,
  isPostContainer,
  isFeedPage,
}: {
  post: Post;
  onPressLike: () => void;
  onPressComment: () => void;
  activeSlideIndex?: number;
  isPostContainer?: boolean;
  isFeedPage?: boolean;
}) => {
  const router = useRouter();
  const { sharePost } = useShare();
  const {
    caption,
    commentsCount,
    isLiked,
    likesCount,
    assets,
    _id: postId,
  } = post;

  const serializedData = encodeURIComponent(
    JSON.stringify({ id: post._id, type: "Post" })
  );

  const handleShare = () => {
    if (assets && caption) {
      sharePost({
        imageUrl: assets[0]?.url,
        caption: caption,
        link: "https://play.google.com/store/apps/details?id=com.strength.android",
      });
    }
  };

  return (
    <View
      className={`${
        isPostContainer
          ? "bg-neutral-900 relative left-[5%] bottom-1 z-[-10] pt-1 w-[100%] rounded-br-[35px] rounded-bl-[40px]"
          : "w-[100%] bg-transparent"
      } min-h-12 h-auto`}
    >
      {/* counts */}
      <View
        className={`w-full ${
          isPostContainer ? "pl-8 pr-12" : "px-8"
        } py-3 flex flex-row justify-between items-center`}
      >
        {/* like count */}
        <TouchableOpacity
          className="flex flex-row items-center gap-2"
          onPress={() => {
            router.push(`/post-details/${serializedData}/likes`);
          }}
        >
          <AntDesign name="like1" size={16} color="#fbbf24" />
          <TextScallingFalse className="text-base text-white font-light">
            {likesCount} {likesCount > 1 ? "Likes" : "Like"}
          </TextScallingFalse>
        </TouchableOpacity>

        {isPostContainer && assets && assets.length > 1 ? (
          <View className="flex-row justify-center">
            <AnimatedDotsCarousel
              length={assets.length}
              currentIndex={activeSlideIndex as number}
              maxIndicators={2}
              interpolateOpacityAndColor={true}
              activeIndicatorConfig={{
                color: "#FFFFFF",
                margin: 3,
                opacity: 1,
                size: 6,
              }}
              inactiveIndicatorConfig={{
                color: "#FFFFFF",
                margin: 3,
                opacity: 0.5,
                size: 6,
              }}
              decreasingDots={[
                {
                  config: {
                    color: "#FFFFFF",
                    margin: 3,
                    opacity: 0.5,
                    size: 5,
                  },
                  quantity: 1,
                },
                {
                  config: {
                    color: "#FFFFFF",
                    margin: 3,
                    opacity: 0.5,
                    size: 4,
                  },
                  quantity: 1,
                },
                {
                  config: {
                    color: "#FFFFFF",
                    margin: 3,
                    opacity: 0.5,
                    size: 3,
                  },
                  quantity: 1,
                },
              ]}
            />
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
          <TextScallingFalse className="text-base text-white font-light">
            {commentsCount} Comments
          </TextScallingFalse>
        </TouchableOpacity>
      </View>

      {/* actions */}
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
            <TextScallingFalse
              className={`text-base ${
                isLiked ? "text-amber-400" : "text-white"
              }`}
            >
              {isLiked ? "Liked" : "Like"}
            </TextScallingFalse>
          </View>
        </TouchableOpacity>
        {/* comment now */}
        <TouchableOpacity
          className="flex flex-row items-center gap-2 relative"
          onPress={() => {
            !isFeedPage
              ? router.push({
                  pathname: `/post-details/${postId}` as RelativePathString,
                })
              : onPressComment();
          }}
        >
          <View className={interactionBtn} style={shadowStyle}>
            <Feather name="message-square" size={16} color="white" />
            <TextScallingFalse className="text-base text-white">
              Comment
            </TextScallingFalse>
          </View>
        </TouchableOpacity>
        {/* share */}
        <TouchableOpacity
          className="mr-3 flex flex-row items-center gap-2 relative"
          onPress={handleShare}
        >
          {/* The main button */}
          <View className={interactionBtn} style={shadowStyle}>
            <FontAwesome5 name="location-arrow" size={16} color="white" />
            <TextScallingFalse className="text-base text-white">
              Share
            </TextScallingFalse>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(InteractionBar);
