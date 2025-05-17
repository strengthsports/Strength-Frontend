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
import React, { useEffect, useLayoutEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  RelativePathString,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import TextScallingFalse from "~/components/CentralText";
import Swiper from "react-native-swiper";
import { swiperConfig } from "~/utils/swiperConfig";
import nopic from "@/assets/images/nopic.jpg";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import InteractionBar from "~/components/PostContainer/InteractionBar";
import { AppDispatch, RootState } from "~/reduxStore";
import BackIcon from "~/components/SvgIcons/Common_Icons/BackIcon";
import PageThemeView from "~/components/PageThemeView";
import VideoPlayer from "~/components/PostContainer/VideoPlayer";
import { useNavigation } from "@react-navigation/native";
import { addPost, selectPostById } from "~/reduxStore/slices/post/postsSlice";
import { toggleLike } from "~/reduxStore/slices/post/postActions";
import { Modal } from "react-native";
import CommentModal from "~/components/feedPage/CommentModal";
import { fetchPostById } from "~/api/post/fetchPostById";
import { ActivityIndicator } from "react-native";

const { width } = Dimensions.get("window");

const Post = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const postId = params?.postId as string; // Extract postId from URL params
  let post = useSelector((state: RootState) => selectPostById(state, postId));
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serializedUser = encodeURIComponent(
    JSON.stringify({ id: post?.postedBy?._id, type: post?.postedBy?.type })
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [isHeaderFooterVisible, setHeaderFooterVisible] = useState(true);
  const [isCommentCountModalVisible, setIsCommentCountModalVisible] =
    useState(false);

  // Fallback to db for post fetching
  useEffect(() => {
    const loadPost = async () => {
      if (!postId || post) return; // Skip if post exists or no postId

      setIsLoading(true);
      setError(null);

      try {
        // Dispatch the async thunk and unwrap the result to handle errors
        post = await fetchPostById({ postId });
        dispatch(addPost(post));
      } catch (err: any) {
        setError(err.message || "Failed to fetch post");
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [postId, dispatch, post]);

  useLayoutEffect(() => {
    const tabParent = navigation.getParent();

    tabParent?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      tabParent?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

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

  // Calculate the image height based on aspect ratio or use default
  const getImageHeight = () => {
    if (post?.aspectRatio) {
      const aspectRatio = post.aspectRatio[0] / post.aspectRatio[1];
      return width / aspectRatio;
    }
    return (width * 2) / 3; // Default 3:2 aspect ratio
  };

  if (isLoading) {
    return (
      <PageThemeView>
        <ActivityIndicator size="large" color="white" />
      </PageThemeView>
    );
  }

  if (error) {
    return (
      <PageThemeView>
        <TextScallingFalse className="text-white">{error}</TextScallingFalse>
      </PageThemeView>
    );
  }

  if (!post) {
    return (
      <PageThemeView>
        <TextScallingFalse className="text-white">
          Post Not Found
        </TextScallingFalse>
      </PageThemeView>
    );
  }

  return (
    <PageThemeView>
      <Pressable
        style={{
          flex: 1,
          flexDirection: "column",
        }}
        onPress={() =>
          isExpanded ? setIsExpanded(false) : toggleHeaderFooterVisibility()
        }
      >
        {/* Header */}
        <View
          className={`w-full z-50 flex-row justify-between items-center ${
            !isHeaderFooterVisible && "opacity-0"
          }`}
          style={{
            flex: 0.1,
            paddingHorizontal: 20,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{ flex: 0.15 }}
            onPress={() => router.back()}
          >
            <BackIcon />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row justify-center items-center gap-x-3 px-5"
            style={{ flex: 1 }}
            activeOpacity={0.8}
            onPress={() =>
              router.push(`/(app)/(profile)/profile/${serializedUser}`)
            }
          >
            <View
              className="rounded-full overflow-hidden"
              style={{ width: 30, height: 30 }}
            >
              <Image
                source={
                  post?.postedBy?.profilePic
                    ? { uri: post.postedBy.profilePic }
                    : nopic
                }
                style={{
                  width: "100%",
                  height: "100%",
                }}
                contentFit="cover"
                transition={500}
              />
            </View>
            <TextScallingFalse
              className="text-white font-semibold text-4xl"
              numberOfLines={1}
            >
              {post?.postedBy?.firstName} {post?.postedBy?.lastName}
            </TextScallingFalse>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 0.15,
              alignItems: "flex-end",
            }}
          >
            <MaterialIcons name="more-horiz" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Content area */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
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
                    style={{
                      width: width,
                      height: getImageHeight(),
                    }}
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

        {/* Interaction Bar */}
        <View
          className={`${!isHeaderFooterVisible && "opacity-0"}`}
          style={{
            flex: 0.18,
            justifyContent: "center",
          }}
        >
          <InteractionBar
            post={post}
            isPostContainer={false}
            onPressLike={handleLike}
            isFeedPage={false}
            onPressComment={() => setIsCommentCountModalVisible(true)}
          />
        </View>

        {/* Caption Bar */}
        <LinearGradient
          colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.8)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            paddingHorizontal: "5%",
            paddingTop: 16,
            position: "absolute",
            bottom: 130,
            zIndex: 20,
          }}
          className={`w-full max-h-52 ${!isHeaderFooterVisible && "opacity-0"}`}
        >
          <ScrollView>
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
      </Pressable>
      <Modal
        visible={isCommentCountModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCommentCountModalVisible(false)}
        style={{
          flex: 1,
        }}
      >
        <CommentModal
          targetId={post._id}
          autoFocusKeyboard={true}
          onClose={() => setIsCommentCountModalVisible(false)}
        />
      </Modal>
    </PageThemeView>
  );
};

export default Post;
