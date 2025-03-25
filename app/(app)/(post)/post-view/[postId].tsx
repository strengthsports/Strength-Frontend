import {
  View,
  Text,
  ScrollView,
  NativeSyntheticEvent,
  TextLayoutEventData,
  Pressable,
  Platform,
  UIManager,
  LayoutAnimation,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { RelativePathString, useRouter } from "expo-router";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import TextScallingFalse from "~/components/CentralText";
import Swiper from "react-native-swiper";
import { swiperConfig } from "~/utils/swiperConfig";
import nopic from "@/assets/images/nopic.jpg";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { RootState } from "~/reduxStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

const PostDetails = () => {
  const postDetails = useSelector(
    (state: RootState) => state.profile.currentPost
  );
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [isPostDetailsModalOpen, setPostDetailsModalOpen] = useState(false);
  const [isHeaderFooterVisible, setHeaderFooterVisible] = useState(true);

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

  const toggleHeaderFooterVisibility = () => {
    isHeaderFooterVisible
      ? setHeaderFooterVisible(false)
      : setHeaderFooterVisible(true);
  };

  return (
    <Pressable
      className="h-screen flex justify-center items-center bg-black"
      onPress={() =>
        isExpanded ? setIsExpanded(false) : toggleHeaderFooterVisibility()
      }
    >
      <SafeAreaView className="flex-1">
        {/*testing for iOS issue*/}
        <View
          className={`w-full z-50 pt-4 flex-row justify-between items-center px-5 basis-[6%] transition-opacity ease-in-out ${
            !isHeaderFooterVisible && "opacity-0"
          }`}
        >
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
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                transition={500}
                placeholder={require("../../../../assets/images/nopic.jpg")}
              />
            </View>
            <TextScallingFalse className="text-white font-light text-4xl">
              {postDetails?.postedBy?.firstName}{" "}
              {postDetails?.postedBy?.lastName}
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
              aspectRatio: postDetails?.aspectRatio
                ? postDetails.aspectRatio[0] / postDetails.aspectRatio[1]
                : 3 / 2,
            }}
          >
            {postDetails?.assets && postDetails.assets.length > 0 && (
              <Swiper {...swiperConfig} className="w-full h-auto">
                {postDetails.assets.map((asset: { url: string }) => (
                  <Image
                    key={asset.url}
                    source={{ uri: asset.url }}
                    style={{ width: "100%", height: "100%" }}
                    transition={1000}
                    placeholder={require("../../../../assets/images/nocover.png")}
                    contentFit="cover"
                    placeholderContentFit="cover"
                  />
                ))}
              </Swiper>
            )}
          </View>
        </ScrollView>
        {/* Interaction Bar */}
        <View
          className={`basis-[18%] w-full p-4 pt-10 transition-opacity ease-in-out ${
            !isHeaderFooterVisible && "opacity-0"
          }`}
          onStartShouldSetResponder={() => true}
        >
          <View className="w-full px-4 py-3 flex flex-row justify-between items-center">
            {/* like */}
            <View className="flex flex-row items-center gap-2">
              <AntDesign name="like1" size={16} color="#fbbf24" />
              <TextScallingFalse className="text-base text-white">
                {postDetails?.likesCount}{" "}
                {postDetails?.likesCount && postDetails.likesCount > 1
                  ? "Likes"
                  : "Like"}
              </TextScallingFalse>
            </View>

            {/* comment count */}
            <View className="flex flex-row items-center gap-2">
              <TextScallingFalse className="text-base text-white">
                {postDetails?.commentsCount} Comments
              </TextScallingFalse>
            </View>
          </View>

          <View className="w-full mx-auto py-4 flex-row gap-x-6 border-t-[0.5px] border-[#5C5C5C]">
            <TouchableOpacity>
              <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-2 rounded-3xl">
                <AntDesign
                  name={postDetails?.isLiked ? "like1" : "like2"}
                  size={16}
                  color={postDetails?.isLiked ? "#fbbf24" : "white"}
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
            <TouchableOpacity
              className="flex flex-row items-center gap-2"
              onPress={() =>
                router.push({
                  pathname: "/post-details/1" as RelativePathString,
                })
              }
            >
              <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-2 rounded-3xl">
                <Feather name="message-square" size={16} color="white" />
                <TextScallingFalse className="text-base text-white">
                  Comment
                </TextScallingFalse>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-2 rounded-3xl">
                <FontAwesome5 name="location-arrow" size={16} color="white" />
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
          className={`px-8 pt-4 w-full absolute bottom-[18%] max-h-60 overflow-hidden transition-opacity ease-in-out ${
            !isHeaderFooterVisible && "opacity-0"
          }`}
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
              {postDetails?.caption &&
                renderCaptionWithHashtags(postDetails?.caption)}
            </Text>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </Pressable>
  );
};

export default PostDetails;
