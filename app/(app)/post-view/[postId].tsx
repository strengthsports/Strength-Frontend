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
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
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
import MoreModal from "~/components/feedPage/MoreModal";
import { useBottomSheet } from "~/context/BottomSheetContext";
import { FollowUser } from "~/types/user";
import { showFeedback } from "~/utils/feedbackToast";
import { useFollow } from "~/hooks/useFollow";
import { useShare } from "~/hooks/useShare";

const { width } = Dimensions.get("window");

const Post = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const userId = useSelector((state: RootState) => state.profile.user?._id);
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

  // Get the openBottomSheet function from context
  const { openBottomSheet } = useBottomSheet();
  // Follow following hook
  const { followUser, unFollowUser } = useFollow();
  // Share post
  const { sharePost } = useShare();

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

  const goToHashtag = useCallback(
    (tag: string) => {
      // string version is faster than object
      router.push(`/hashtag/${tag}/top`);
    },
    [router]
  );

  const goToUser = useCallback(
    (serializedUser: any, userId?: string) => {
      userId === post.postedBy?._id
        ? router.push("/(app)/(tabs)/profile")
        : router.push(`/(app)/(profile)/profile/${serializedUser}`);
    },
    [router]
  );

  const renderCaptionWithHashtags = (
    caption: string,
    taggedUsers: any,
    isExpanded: boolean,
    onPressSeeMore: () => void
  ) => {
    const parts = caption.split(/(#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)/g);
    const elements = [];
    let remainingChars = isExpanded ? Infinity : 94;
    let showSeeMore = false;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part || remainingChars <= 0) continue;

      if (part.startsWith("#")) {
        if (part.length > remainingChars) {
          showSeeMore = true;
          break;
        }
        const tag = part.slice(1);
        elements.push(
          <TextScallingFalse
            key={i}
            onPress={() => goToHashtag(tag)}
            className={`text-xl text-[#12956B] active:bg-gray-600`}
          >
            {part}
          </TextScallingFalse>
        );
        remainingChars -= part.length;
      } else if (part.startsWith("@")) {
        const uname = part.slice(1);
        const user = taggedUsers.find((u) => u.username === uname);
        if (!user || part.length > remainingChars) {
          showSeeMore = true;
          break;
        }
        elements.push(
          <TextScallingFalse
            key={i}
            onPress={() =>
              goToUser(
                encodeURIComponent(
                  JSON.stringify({ id: user._id, type: user.type })
                ),
                user._id
              )
            }
            className="text-xl text-[#12956B] active:bg-gray-600"
          >
            {part}
          </TextScallingFalse>
        );
        remainingChars -= part.length;
      } else {
        const allowed = Math.min(remainingChars, part.length);
        const visibleText = part.slice(0, allowed);
        if (visibleText) {
          elements.push(
            <TextScallingFalse key={i} className={`text-white`}>
              {visibleText}
            </TextScallingFalse>
          );
          remainingChars -= allowed;

          // Add see more immediately if we're truncating
          if (allowed < part.length) {
            showSeeMore = true;
            break;
          }
        }
      }
    }

    if (!isExpanded && showSeeMore) {
      elements.push(
        <TextScallingFalse
          key="see-more"
          onPress={onPressSeeMore}
          className="text-[#808080] text-xl"
        >
          ...more
        </TextScallingFalse>
      );
    }

    return elements;
  };

  // Memoized Caption
  const memoizedCaption = useMemo(
    () =>
      renderCaptionWithHashtags(
        post.caption,
        post.taggedUsers || [],
        isExpanded,
        () => setIsExpanded(true)
      ),
    [post, post.caption, post.taggedUsers, isExpanded]
  );

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

  // Handle Follow
  const handleFollow = async () => {
    const followData: FollowUser = {
      followingId: post.postedBy._id,
      followingType: post.postedBy.type,
    };

    showFeedback(`You are now following ${post.postedBy.firstName}`, "success");
    await followUser(followData);
  };

  // Handle Unfollow
  const handleUnfollow = async () => {
    const unfollowData: FollowUser = {
      followingId: post.postedBy._id,
      followingType: post.postedBy.type,
    };

    await unFollowUser(unfollowData);
  };

  // Handle share
  const handleShare = () => {
    sharePost({
      imageUrl: post.assets ? post.assets[0]?.url : "",
      ...(post.caption && { caption: post.caption }),
    });
  };

  // Define the menu items for this specific post
  const handleOpenBottomSheet = ({ type }: { type: string }) => {
    // Open the bottom sheet with these items
    if (type === "settings") {
      openBottomSheet({
        isVisible: true,
        content: (
          <MoreModal
            firstName={post.postedBy.firstName}
            followingStatus={post.isFollowing}
            isOwnPost={post.postedBy._id === userId}
            postId={post._id}
            isReported={post.isReported}
            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
            handleShare={handleShare}
          />
        ),
        height: post.postedBy._id === userId ? "20%" : "25%",
        bgcolor: "#151515", // Ensure bgcolor is always defined
        border: false,
        maxHeight: post.postedBy._id === userId ? "20%" : "25%",
        draggableDirection: "down",
      });
    }
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
              style={{
                width: 30,
                height: 30,
                borderWidth: 1,
                borderColor: "#202020",
              }}
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
            onPress={() => handleOpenBottomSheet({ type: "settings" })}
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
            maxHeight: 180,
          }}
          className={`w-full ${!isHeaderFooterVisible && "opacity-0"}`}
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
              {post?.caption && memoizedCaption}
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
