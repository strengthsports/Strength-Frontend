import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { RelativePathString, useRouter } from "expo-router";
import { AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";
import TextScallingFalse from "../CentralText";
import { Post } from "~/types/post";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { setCurrentPost } from "~/reduxStore/slices/user/profileSlice";

const InteractionBar = ({
  post,
  isLiked,
  likeCount,
  commentCount,
  handleLikeAction,
  activeSlideIndex,
  likePageRoute,
  commentPageRoute,
  isPostContainer,
}: {
  post: Post;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  handleLikeAction: () => void;
  activeSlideIndex?: number;
  likePageRoute?: string;
  commentPageRoute?: string;
  isPostContainer?: boolean;
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  return (
    <View
      className={`${
        isPostContainer
          ? "bg-neutral-900 relative left-[5%] bottom-1 z-[-10] pt-1 w-[95%] rounded-bl-[40px] rounded-br-[16px]"
          : "bg-transparent"
      } min-h-12 h-auto`}
    >
      <View className="w-full px-8 pr-6 py-3 flex flex-row justify-between items-center">
        {/* like */}
        <TouchableOpacity
          className="flex flex-row items-center gap-2"
          onPress={() => {
            router.push("/post-details/1/likes");
            dispatch(setCurrentPost(post));
          }}
        >
          <AntDesign name="like1" size={16} color="#fbbf24" />
          <TextScallingFalse className="text-base text-white font-light">
            {likeCount} {likeCount > 1 ? "Likes" : "Like"}
          </TextScallingFalse>
        </TouchableOpacity>

        {isPostContainer && post.assets && post.assets.length > 1 && (
          <View className="flex-row justify-center">
            {Array.from({ length: post.assets.length }).map((_, i) => (
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
        )}

        {/* comment count */}
        <TouchableOpacity
          className="flex flex-row items-center gap-2"
          onPress={() => {
            router.push({
              pathname: "/post-details/1" as RelativePathString,
            });
            dispatch(setCurrentPost(post));
          }}
        >
          <TextScallingFalse className="text-base text-white font-light">
            {commentCount} Comments
          </TextScallingFalse>
        </TouchableOpacity>
      </View>

      <View
        className={`w-[90%] mx-auto py-5 mb-1 flex flex-row ${
          isPostContainer ? "justify-end" : "justify-center"
        } gap-x-5 items-center border-t-[0.5px] border-[#5C5C5C]`}
      >
        {/* like */}
        <TouchableOpacity onPress={handleLikeAction}>
          <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-1.5 rounded-3xl">
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
        <TouchableOpacity className="flex flex-row items-center gap-2">
          <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-1.5 rounded-3xl">
            {/* <FontAwesome name="comment" size={16} color="grey" /> */}
            <Feather name="message-square" size={16} color="white" />
            <TextScallingFalse className="text-base text-white">
              Comment
            </TextScallingFalse>
          </View>
        </TouchableOpacity>
        {/* share */}
        <TouchableOpacity className="mr-3">
          <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-1.5 rounded-3xl">
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

export default InteractionBar;
