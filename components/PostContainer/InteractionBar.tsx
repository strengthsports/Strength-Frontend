import { View, TouchableOpacity } from "react-native";
import React, { memo } from "react";
import { Link, RelativePathString } from "expo-router";
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
  isPostDetailsPage = false,
}: {
  post: Post;
  onPressLike: () => void;
  onPressComment: () => void;
  activeSlideIndex?: number;
  isPostContainer?: boolean;
  isFeedPage?: boolean;
  isPostDetailsPage?: boolean;
}) => {
  const { sharePost } = useShare();
  const {
    caption,
    commentsCount,
    isLiked,
    likesCount,
    assets,
    isVideo,
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
        link: "https://play.google.com/store/apps/details?id=strength.net.in",
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
      // style={{ backgroundColor: "pink" }}
    >
      {/* counts */}
      <View
        className={`w-full ${
          isPostContainer ? "pl-8 pr-12" : "px-6"
        } py-3 flex flex-row justify-between items-center`}
      >
        {/* like count */}
        <Link
          href={`/post-details/${serializedData}/likes` as RelativePathString}
          className="flex flex-row items-center gap-2"
          asChild
        >
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <AntDesign name="like1" size={13} color="#fbbf24" />
            <TextScallingFalse className="text-base text-white font-light">
              {likesCount} {likesCount > 1 ? "Likes" : "Like"}
            </TextScallingFalse>
          </TouchableOpacity>
        </Link>

        {isPostContainer && assets && !isVideo && assets.length > 1 ? (
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
        {isPostDetailsPage ? (
          <TouchableOpacity disabled>
            <TextScallingFalse className="text-base text-white font-light">
              {commentsCount} Comments
            </TextScallingFalse>
          </TouchableOpacity>
        ) : (
          <Link
            href={`/post-details/${postId}` as RelativePathString}
            className="flex flex-row items-center gap-2"
            asChild
          >
            <TouchableOpacity activeOpacity={0.7}>
              <TextScallingFalse className="text-base text-white font-light">
                {commentsCount} Comments
              </TextScallingFalse>
            </TouchableOpacity>
          </Link>
        )}
      </View>

      {/* actions */}
      <View
        className={`${!isPostContainer && "mx-auto"} py-5 mb-1 flex flex-row ${
          isPostContainer ? "justify-end" : "justify-center"
        } items-center border-t`}
        style={{
          columnGap: isPostContainer ? 16 : 32,
          borderColor: "#303030",
          marginTop: 1,
          // backgroundColor: "green",
          width: isPostContainer ? "81%" : "90%",
          left: isPostContainer ? 32 : 0,
        }}
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
              color={isLiked ? "#FABE25" : "#D2D2D2"}
            />
            <TextScallingFalse
              className="text-base"
              style={{
                color: isLiked ? "#fbbf24" : "#E3E3E3",
              }}
            >
              {isLiked ? "Liked" : "Like"}
            </TextScallingFalse>
          </View>
        </TouchableOpacity>
        {/* comment now */}
        {isFeedPage || !isPostContainer ? (
          <TouchableOpacity
            className="flex flex-row items-center gap-2 relative"
            onPress={onPressComment}
          >
            <View className={interactionBtn} style={shadowStyle}>
              <Feather name="message-square" size={16} color="#D2D2D2" />
              <TextScallingFalse
                className="text-base"
                style={{ color: "#E3E3E3" }}
              >
                Comment
              </TextScallingFalse>
            </View>
          </TouchableOpacity>
        ) : isPostDetailsPage ? (
          <TouchableOpacity
            className="flex flex-row items-center gap-2 relative"
            disabled
          >
            <View className={interactionBtn} style={shadowStyle}>
              <Feather name="message-square" size={16} color="#D2D2D2" />
              <TextScallingFalse
                className="text-base"
                style={{ color: "#E3E3E3" }}
              >
                Comment
              </TextScallingFalse>
            </View>
          </TouchableOpacity>
        ) : (
          <Link
            href={`/post-details/${postId}` as RelativePathString}
            className="flex flex-row items-center gap-2 relative"
            asChild
          >
            <TouchableOpacity className="flex flex-row items-center gap-2 relative">
              <View className={interactionBtn} style={shadowStyle}>
                <Feather name="message-square" size={16} color="#D2D2D2" />
                <TextScallingFalse
                  className="text-base"
                  style={{ color: "#E3E3E3" }}
                >
                  Comment
                </TextScallingFalse>
              </View>
            </TouchableOpacity>
          </Link>
        )}
        {/* share */}
        <TouchableOpacity
          className={`${
            isPostContainer && "mr-3"
          } flex flex-row items-center gap-2 relative`}
          onPress={handleShare}
        >
          {/* The main button */}
          <View className={interactionBtn} style={shadowStyle}>
            <FontAwesome5 name="location-arrow" size={16} color="#D2D2D2" />
            <TextScallingFalse
              className="text-base"
              style={{ color: "#E3E3E3" }}
            >
              Share
            </TextScallingFalse>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(InteractionBar);
