import {
  View,
  ScrollView,
  NativeSyntheticEvent,
  TextLayoutEventData,
  Pressable,
  Platform,
  UIManager,
  LayoutAnimation,
  Dimensions,
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
import { AVPlaybackStatusSuccess } from "expo-av";
import VideoControls from "~/components/PostContainer/VideoControls";
import BackIcon from "~/components/SvgIcons/Common_Icons/BackIcon";
import { purple100 } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import PageThemeView from "~/components/PageThemeView";
import VideoPlayer from "~/components/PostContainer/VideoPlayer";

const { width } = Dimensions.get("window");

const Post = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const postId = params?.postId as string; // Extract postId from URL params
  // const post = useSelector((state: RootState) => state.post.currentPost);
  const post = useSelector((state: RootState) => selectPostById(state, postId));
  const dispatch = useDispatch<AppDispatch>();

  const serializedUser = encodeURIComponent(
    JSON.stringify({ id: post?.postedBy?._id, type: post?.postedBy?.type })
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [isHeaderFooterVisible, setHeaderFooterVisible] = useState(true);

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
                `/(app)/(post)/hashtag/${word.substring(
                  1,
                  word.length
                )}` as RelativePathString
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
    setHeaderFooterVisible(!isHeaderFooterVisible);
  };

  const handleLike = () => {
    dispatch(toggleLike({ targetId: post._id, targetType: "Post" }));
  };

  const updateVideoStatus = (status: AVPlaybackStatusSuccess) => {
    setVideoStatus(status);
  };

  // Calculate the image height based on aspect ratio or use default
  const getImageHeight = () => {
    if (post?.aspectRatio) {
      const aspectRatio = post.aspectRatio[0] / post.aspectRatio[1];
      return width / aspectRatio;
    }
    return (width * 2) / 3; // Default 3:2 aspect ratio
  };

  if (!post) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-black">
        <TextScallingFalse className="text-white">Loading...</TextScallingFalse>
      </SafeAreaView>
    );
  }

  return (
    <PageThemeView>
      <Pressable
        className="flex-1"
        onPress={() =>
          isExpanded ? setIsExpanded(false) : toggleHeaderFooterVisibility()
        }
      >
        {/* Header */}
        <View
          className={`w-full z-50 pt-3 flex-row justify-between items-center px-5 ${
            !isHeaderFooterVisible && "opacity-0"
          }`}
        >
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => router.back()}
          >
            <BackIcon />
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
                style={{ width: 40, height: 40 }}
                contentFit="cover"
                transition={500}
              />
            </View>
            <TextScallingFalse className="text-white font-light text-4xl">
              {post?.postedBy?.firstName} {post?.postedBy?.lastName}
            </TextScallingFalse>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 10 }}>
            <MaterialIcons name="more-horiz" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Content area */}
        <View className="flex-1 justify-center">
          {/* Media section */}
          <View
            style={{
              width: width,
              height: getImageHeight(),
            }}
          >
            {post?.isVideo ? (
              // Video player
              <VideoPlayer videoSource={post.assets[0].url} />
            ) : (
              // Image swiper
              <Swiper {...swiperConfig} style={{ height: getImageHeight() }}>
                {post.assets.map((asset, index) => (
                  <View
                    key={index}
                    style={{ width: width, height: getImageHeight() }}
                  >
                    <Image
                      source={{ uri: asset.url }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                      transition={1000}
                    />
                  </View>
                ))}
              </Swiper>
            )}
          </View>
        </View>

        {/* Video controls */}
        {/* {videoStatus && (
          <View
            className={`absolute bottom-40 left-0 right-0 ${
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
        )} */}

        {/* Interaction Bar */}
        <View
          className={`absolute bottom-20 left-0 right-0 ${
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

        {/* Caption Bar */}
        <LinearGradient
          colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.8)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          className={`px-8 pt-4 w-full absolute bottom-32 max-h-60 ${
            !isHeaderFooterVisible && "opacity-0"
          }`}
        >
          <View>
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
          </View>
        </LinearGradient>
      </Pressable>
    </PageThemeView>
  );
};

export default Post;
