import {
  View,
  Text,
  Image,
  ScrollView,
  NativeSyntheticEvent,
  TextLayoutEventData,
  Pressable,
  Platform,
  UIManager,
  LayoutAnimation,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import TextScallingFalse from "~/components/CentralText";
import { Divider } from "react-native-elements";
import Swiper from "react-native-swiper";
import { swiperConfig } from "~/utils/swiperConfig";
import nopic from "@/assets/images/nopic.jpg";
import { LinearGradient } from "expo-linear-gradient";
import PostDetailsModal from "~/components/modals/PostDetailsModal";

const PostDetails = () => {
  const { details } = useLocalSearchParams();
  //   console.log("details : ", JSON.parse(details));
  const postDetails = JSON.parse(details as any);
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [isPostDetailsModalOpen, setPostDetailsModalOpen] = useState(false);

  // Enable LayoutAnimation on Android
  useEffect(() => {
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const renderCaptionWithHashtags = (caption: string) => {
    return caption?.split(/(\#[a-zA-Z0-9_]+)/g).map((word, index) => {
      if (word.startsWith("#")) {
        return (
          <Text
            key={index}
            onPress={() =>
              router.push(
                `/(app)/(post)/hashtag/${word.substring(1, word.length)}`
              )
            }
            className={`text-xl text-[#12956B]`}
          >
            {word}
          </Text>
        );
      }
      return word;
    });
  };

  const handleTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const { lines } = e.nativeEvent;
    const shouldShowSeeMore =
      lines.length > 2 || (lines as any).some((line: any) => line.truncated);
    setShowSeeMore(shouldShowSeeMore);
  };

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <Pressable
      className="h-screen flex justify-center items-center"
      onPress={() => isExpanded && setIsExpanded(false)}
    >
      <View className="w-full z-50 pt-4 flex-row justify-between items-center px-5 basis-[6%]">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row justify-center items-center gap-x-4">
          <View className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              source={
                postDetails?.postedBy?.profilePic
                  ? { uri: postDetails.postedBy.profilePic }
                  : nopic
              }
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <TextScallingFalse className="text-white font-light text-4xl">
            {postDetails?.postedBy?.firstName} {postDetails?.postedBy?.lastName}
          </TextScallingFalse>
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="more-horiz" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Image section */}
        <View
          className="relative w-full"
          style={{
            aspectRatio: postDetails.aspectRatio
              ? postDetails.aspectRatio[0] / postDetails.aspectRatio[1]
              : 3 / 2,
          }}
        >
          {postDetails.assets && postDetails.assets.length > 0 && (
            <Swiper {...swiperConfig} className="w-full h-auto bg-slate-400">
              {postDetails.assets.map((asset: { url: string }) => (
                <Image
                  key={asset.url}
                  source={{ uri: asset.url }}
                  className="size-full"
                />
              ))}
            </Swiper>
          )}
        </View>
      </ScrollView>

      {/* Interaction Bar */}
      <View className="basis-[18%] w-full p-4 pt-10">
        <View className="w-full px-4 py-3 flex flex-row justify-between items-center">
          {/* like */}
          <View className="flex flex-row items-center gap-2">
            <FontAwesome name="thumbs-up" size={16} color="gray" />
            <TextScallingFalse className="text-base text-white">
              {postDetails?.likesCount}{" "}
              {postDetails?.likesCount > 1 ? "Likes" : "Like"}
            </TextScallingFalse>
          </View>

          {/* comment count */}
          <View className="flex flex-row items-center gap-2">
            <TextScallingFalse className="text-base text-white">
              {postDetails?.commentsCount} Comments
            </TextScallingFalse>
          </View>
        </View>

        <Divider
          style={{ marginHorizontal: "auto", width: "80%" }}
          width={0.2}
          color="grey"
        />

        <View className="w-full px-6 py-5 flex flex-row justify-evenly items-center">
          <TouchableOpacity>
            <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-2 rounded-3xl">
              <FontAwesome
                name={postDetails?.isLiked ? "thumbs-up" : "thumbs-o-up"}
                size={16}
                color={postDetails?.isLiked ? "#FABE25" : "gray"}
              />
              <TextScallingFalse
                className={`text-base ${
                  postDetails?.isLiked ? "text-amber-400" : "text-white"
                }`}
              >
                {postDetails?.isLiked ? "Liked" : "Like"}
              </TextScallingFalse>
            </View>
          </TouchableOpacity>
          {/* comment now */}
          <TouchableOpacity
            className="flex flex-row items-center gap-2"
            onPress={() => setPostDetailsModalOpen(true)}
          >
            <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-2 rounded-3xl">
              <FontAwesome name="comment" size={16} color="grey" />
              <TextScallingFalse className="text-base text-white">
                Comment
              </TextScallingFalse>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-2 rounded-3xl">
              <FontAwesome name="paper-plane" size={16} color="grey" />
              <TextScallingFalse className="text-base text-white">
                Share
              </TextScallingFalse>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/*Caption Bar */}
      <LinearGradient
        colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.8)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="px-8 pt-4 w-full absolute bottom-[18%] max-h-60 overflow-hidden"
      >
        <ScrollView
          className="max-h-full"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          onStartShouldSetResponder={() => true}
        >
          <Text
            className="text-xl leading-5 text-neutral-200"
            numberOfLines={isExpanded ? undefined : 1}
            ellipsizeMode="tail"
            onTextLayout={handleTextLayout}
            onPress={(event) => {
              event.stopPropagation();
              toggleExpand();
            }}
          >
            {renderCaptionWithHashtags(postDetails.caption)}
          </Text>
        </ScrollView>
      </LinearGradient>

      <Modal
        visible={isPostDetailsModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPostDetailsModalOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => setPostDetailsModalOpen(false)}
        >
          <PostDetailsModal details={details} />
        </TouchableOpacity>
      </Modal>
    </Pressable>
  );
};

export default PostDetails;
