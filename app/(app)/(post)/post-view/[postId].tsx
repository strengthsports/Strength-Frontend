import {
  View,
  ScrollView,
  NativeSyntheticEvent,
  TextLayoutEventData,
  Pressable,
  Platform,
  UIManager,
  LayoutAnimation,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  RelativePathString,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
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
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import InteractionBar from "~/components/PostContainer/InteractionBar";
import { AppDispatch, RootState } from "~/reduxStore";
import { selectPostById, toggleLike } from "~/reduxStore/slices/feed/feedSlice";
import CustomVideoPlayer, {
  VideoPlayerHandle,
} from "~/components/PostContainer/VideoPlayer";
import { AVPlaybackStatusSuccess } from "expo-av";
import VideoControls from "~/components/PostContainer/VideoControls";

const post = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const postId = params?.postId as string; // Extract postId from URL params
  console.log("Post ID : ", postId);
  const post = useSelector((state: RootState) => selectPostById(state, postId));
  const dispatch = useDispatch<AppDispatch>();

  const serializedUser = encodeURIComponent(
    JSON.stringify({ id: post?.postedBy?._id, type: post?.postedBy?.type })
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [isHeaderFooterVisible, setHeaderFooterVisible] = useState(true);

  const videoPlayerRef = useRef<VideoPlayerHandle>(null);
  const [videoStatus, setVideoStatus] =
    useState<AVPlaybackStatusSuccess | null>(null);

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
          <TextScallingFalse
            key={index}
            onPress={() =>
              router.push(
                `/(app)/(post)/hashtag/${word.substring(1, word.length)}`
              )
            }
            className={`text-xl text-[#12956B]`}
          >
            {word}
          </TextScallingFalse>
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

  const handleLike = () => {
    dispatch(toggleLike({ targetId: post._id, targetType: "Post" }));
  };

  const handlePlayPause = async () => {
    if (videoStatus?.isPlaying) {
      await videoPlayerRef.current?.pause();
    } else {
      await videoPlayerRef.current?.play();
    }
  };

  const handleSeek = (position: number) => {
    videoPlayerRef.current?.seek(position);
  };

  const handleToggleMute = () => {
    videoPlayerRef.current?.toggleMute();
  };

  const updateVideoStatus = (status: AVPlaybackStatusSuccess) => {
    setVideoStatus(status);
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
          <TouchableOpacity
            className="flex-row justify-center items-center gap-x-4"
            activeOpacity={0.8}
            onPress={() =>
              router.push(`/(app)/(profile)/profile/${serializedUser}`)
            }
          >
            <View className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                source={
                  post?.postedBy?.profilePic
                    ? { uri: post.postedBy.profilePic }
                    : nopic
                }
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                transition={500}
                placeholder={require("../../../../assets/images/nopic.jpg")}
              />
            </View>
            <TextScallingFalse className="text-white font-light text-4xl">
              {post?.postedBy?.firstName} {post?.postedBy?.lastName}
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
              aspectRatio: post?.aspectRatio
                ? post.aspectRatio[0] / post.aspectRatio[1]
                : 3 / 2,
            }}
          >
            {post?.isVideo ? (
              // When this is a video post, render the CustomVideoPlayer.
              <CustomVideoPlayer
                ref={videoPlayerRef}
                videoUri={post.assets[0].url}
                autoPlay={true}
                isFeedPage={false}
                onPlaybackStatusUpdate={updateVideoStatus}
              />
            ) : (
              // Otherwise, render your image container (e.g., a Swiper)
              <Swiper {...swiperConfig} className="w-full h-auto">
                {post.assets.map((asset: { url: string }) => (
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

        {videoStatus && (
          <View
            className={`transition-opacity ease-in-out ${
              !isHeaderFooterVisible ? "opacity-0" : ""
            }`}
          >
            <VideoControls
              isPlaying={videoStatus.isPlaying}
              isBuffering={videoStatus.isBuffering}
              positionMillis={videoStatus.positionMillis}
              durationMillis={videoStatus.durationMillis as number}
              isMuted={videoStatus.isMuted}
              onPlayPause={handlePlayPause}
              onSeek={handleSeek}
              onToggleMute={handleToggleMute}
            />
          </View>
        )}

        {/* Interaction Bar */}
        <View
          className={`transition-opacity ease-in-out ${
            !isHeaderFooterVisible && "opacity-0"
          }`}
        >
          <InteractionBar
            post={post}
            isPostContainer={false}
            onPressLike={handleLike}
            isFeedPage={false}
            onPressComment={() =>
              router.push({
                pathname: `/post-details/${postId}` as RelativePathString,
              })
            }
          />
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
            <TextScallingFalse
              className="text-xl leading-5 text-neutral-200"
              numberOfLines={isExpanded ? undefined : 1}
              ellipsizeMode="tail"
              onTextLayout={handleTextLayout}
              onPress={(event) => {
                event.stopPropagation();
                toggleExpand();
              }}
            >
              {post?.caption && renderCaptionWithHashtags(post?.caption)}
            </TextScallingFalse>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </Pressable>
  );
};

export default post;
