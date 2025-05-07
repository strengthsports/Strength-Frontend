import React, {
  useState,
  useRef,
  forwardRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import MoreModal from "../feedPage/MoreModal";
import { AppDispatch, RootState } from "~/reduxStore";
import { formatTimeAgo } from "~/utils/formatTime";
import nopic from "@/assets/images/nopic.jpg";
import { Post } from "~/types/post";
import CustomImageSlider from "@/components/Cards/imageSlideContainer";
import InteractionBar from "../PostContainer/InteractionBar";
import { toggleLike, voteInPoll } from "~/reduxStore/slices/feed/feedSlice";
import { FollowUser } from "~/types/user";
import { useFollow } from "~/hooks/useFollow";
import { showFeedback } from "~/utils/feedbackToast";
import { useBottomSheet } from "~/context/BottomSheetContext";
import CommentModal from "../feedPage/CommentModal";
import { Modal } from "react-native";
import PollsContainer from "./PollsContainer";
import { Platform } from "react-native";
import TouchableWithDoublePress from "../ui/TouchableWithDoublePress";
import ClipsIconMedia from "../SvgIcons/profilePage/ClipsIconMedia";
import * as VideoThumbnails from "expo-video-thumbnails";
import UserInfo from "../ui/atom/UserInfo";

const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  android: {
    elevation: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.25,
  },
});

type TaggedUser = {
  _id: string;
  username: string;
  type: string;
};
export interface PostContainerHandles {
  closeBottomSheet: (params: { type: string }) => void;
}

interface PostContainerProps {
  item: Post;
  highlightedHashtag?: string;
  isFeedPage?: boolean;
  isMyActivity?: boolean;
  handleBottomSheet?: (state: boolean) => void;
  isVideo?: boolean;
  isVisible?: boolean;
}

const PostContainer = forwardRef<PostContainerHandles, PostContainerProps>(
  (
    {
      item,
      highlightedHashtag,
      isFeedPage,
      handleBottomSheet,
      isVideo,
      isVisible,
    },
    ref
  ) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state?.profile);
    const serializedUser = encodeURIComponent(
      JSON.stringify({ id: item.postedBy?._id, type: item.postedBy?.type })
    );

    const [isCommentCountModalVisible, setIsCommentCountModalVisible] =
      useState(false);

    const { followUser, unFollowUser } = useFollow();

    // State for individual post
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeIndex, setActiveIndex] = useState<any>(0);

    const [containerWidth, setContainerWidth] = useState(
      Dimensions.get("window").width
    );

    useEffect(() => {
      const updateLayout = () => {
        setContainerWidth(Dimensions.get("window").width);
      };
      const dimensionsHandler = Dimensions.addEventListener(
        "change",
        updateLayout
      );
      updateLayout();
      return () => {
        dimensionsHandler?.remove();
      };
    }, []);

    // Get the openBottomSheet function from context
    const { openBottomSheet } = useBottomSheet();

    // Define the menu items for this specific post
    const handleOpenBottomSheet = ({ type }: { type: string }) => {
      // Open the bottom sheet with these items
      if (type === "settings") {
        openBottomSheet({
          isVisible: true,
          content: (
            <MoreModal
              firstName={item.postedBy.firstName}
              followingStatus={item.isFollowing}
              isOwnPost={item.postedBy._id === user?._id}
              postId={item._id}
              isReported={item.isReported}
              handleFollow={handleFollow}
              handleUnfollow={handleUnfollow}
            />
          ),
          height: item.postedBy._id === user?._id ? "20%" : "25%",
          bgcolor: "#151515", // Ensure bgcolor is always defined
          border: false,
          maxHeight: item.postedBy._id === user?._id ? "20%" : "25%",
          draggableDirection: "down",
        });
      } else if (type === "comment") {
        <Modal transparent visible={true} animationType="slide">
          <CommentModal targetId={item._id} autoFocusKeyboard={true} />
        </Modal>;
      }
    };

    // Ref for the like animation
    const scaleAnim = useRef(new Animated.Value(0)).current;

    // Handle like on double tap on post
    const handleDoubleTap = () => {
      if (!item.isLiked) {
        dispatch(toggleLike({ targetId: item._id, targetType: "Post" }));
      }
      scaleAnim.setValue(0);
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(500),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    };

    // Handle like on button press
    const handleLike = () => {
      dispatch(toggleLike({ targetId: item._id, targetType: "Post" }));
    };

    // Handle Follow
    const handleFollow = async () => {
      const followData: FollowUser = {
        followingId: item.postedBy._id,
        followingType: item.postedBy.type,
      };

      showFeedback(
        `You are now following ${item.postedBy.firstName}`,
        "success"
      );
      await followUser(followData);
    };

    // Handle Unfollow
    const handleUnfollow = async () => {
      const unfollowData: FollowUser = {
        followingId: item.postedBy._id,
        followingType: item.postedBy.type,
      };

      await unFollowUser(unfollowData);
    };

    // Handle vote
    const handleVote = async (optionIndex: number) => {
      await dispatch(
        voteInPoll({
          targetId: item._id,
          targetType: "Post",
          selectedOption: optionIndex,
        })
      );
    };

    // Set slider active index
    const handleSetActiveIndex = (index: any) => {
      setActiveIndex(index);
    };

    const goToHashtag = useCallback(
      (tag: string) => {
        // string version is faster than object
        router.push(`/(app)/(post)/hashtag/${tag}/top`);
      },
      [router]
    );

    const goToUser = useCallback(
      (userId: string) => {
        router.push(`/(app)/(profile)/profile/${userId}`);
      },
      [router]
    );

    // Function to render caption with clickable hashtags and mention tags
    const renderCaptionWithTags = (
      caption: string,
      taggedUsers: TaggedUser[],
      isExpanded: boolean,
      onPressSeeMore: () => void
    ) => {
      if (!caption) return null;

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
            return;
          }
          const tag = part.slice(1);
          elements.push(
            <TextScallingFalse
              key={i}
              onPress={() => goToHashtag(tag)}
              className={`text-2xl text-[#12956B] ${
                highlightedHashtag === part && "font-semibold"
              } active:bg-gray-600`}
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
            return;
          }
          elements.push(
            <TextScallingFalse
              key={i}
              onPress={() =>
                goToUser(
                  encodeURIComponent(
                    JSON.stringify({ id: user._id, type: user.type })
                  )
                )
              }
              className="text-2xl text-[#12956B] active:bg-gray-600"
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
              <TextScallingFalse key={i} className="text-white">
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
            className="text-[#808080] text-2xl"
          >
            ...see more
          </TextScallingFalse>
        );
      }

      return elements;
    };

    // Memoized Caption
    const memoizedCaption = useMemo(
      () =>
        renderCaptionWithTags(
          item.caption,
          item.taggedUsers || [],
          isExpanded,
          () => setIsExpanded(true)
        ),
      [item.caption, item.taggedUsers, isExpanded]
    );

    const [thumbnail, setThumbnail] = useState(null);

    useEffect(() => {
      const generateThumbnail = async () => {
        if (!item?.assets || item.assets.length === 0 || !item.assets[0].url)
          return;

        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(
            item.assets[0].url,
            { time: 15000 }
          );
          setThumbnail(uri);
        } catch (e) {
          console.warn(e);
        }
      };

      generateThumbnail();
    }, [item?.assets]);

    return (
      <View className="relative w-full max-w-xl self-center min-h-48 h-auto my-6">
        <View className="flex">
          {/* Profile Section */}
          <View className="relative ml-[4%] flex flex-row gap-2 z-20 pb-0">
            {/* Profile Picture */}
            <TouchableOpacity
              activeOpacity={0.5}
              className="w-[12%] h-[12%] min-w-[48] max-w-[64px] mt-[0px] aspect-square rounded-full bg-slate-700"
              onPress={() =>
                user?._id === item.postedBy?._id
                  ? router.push("/(app)/(tabs)/profile")
                  : router.push(`/(app)/(profile)/profile/${serializedUser}`)
              }
              style={shadowStyle}
            >
              <Image
                source={
                  item.postedBy.profilePic
                    ? {
                        uri: item.postedBy.profilePic,
                      }
                    : nopic
                }
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: "#1a1a1a",
                }}
                transition={500}
                cachePolicy="memory-disk"
                placeholder={require("../../assets/images/nopic.jpg")}
              />
            </TouchableOpacity>

            {/* Name, Headline, post date */}
            <View className="w-64 flex flex-col gap-y-4 justify-between">
              <UserInfo
                fullName={
                  item.postedBy.firstName +
                  " " +
                  (item.postedBy.lastName !== undefined
                    ? item.postedBy.lastName
                    : "")
                }
                headline={item.postedBy.headline}
                username={item.postedBy.username}
                size="small"
                numberOfLines={2}
                leftAlign={true}
              />
              <View className="flex flex-row items-center">
                <TextScallingFalse className="text-sm text-neutral-400">
                  {" "}
                  {formatTimeAgo(item.createdAt)} &bull;{" "}
                </TextScallingFalse>
                <MaterialIcons
                  name="public"
                  size={10}
                  style={{ marginTop: 2 }}
                  color="gray"
                />
              </View>
            </View>

            {/* Follow button */}
            {user?._id !== item.postedBy?._id && !item.isFollowing && (
              <TouchableOpacity
                className="absolute top-[2px] right-3 bg-black border border-[#808080] rounded-2xl px-2.5 py-1"
                onPress={handleFollow}
                activeOpacity={0.6}
              >
                <TextScallingFalse className="text-white text-sm">
                  + Follow
                </TextScallingFalse>
              </TouchableOpacity>
            )}
          </View>

          {/* Caption Section */}
          <View className="relative left-[5%] bottom-0 w-[100%] min-h-16 h-auto mt-[-25] rounded-tl-[40px] rounded-tr-[35px] pb-2 bg-neutral-900">
            <TouchableOpacity
              className="absolute right-8 p-2 pt-2 z-30"
              onPress={() => handleOpenBottomSheet({ type: "settings" })}
            >
              <MaterialIcons name="more-horiz" size={22} color="white" />
            </TouchableOpacity>

            <View className="pl-7 pr-10 pt-12 pb-2">
              <TextScallingFalse className="text-2xl flex-wrap flex-row">
                {memoizedCaption}
              </TextScallingFalse>
            </View>

            {!isVideo && item.isPoll && (
              <PollsContainer
                options={item.poll.options}
                mode="view"
                voteCounts={item.poll.voteCounts}
                userVoted={item.isVoted}
                selectedOption={Number(item.votedOption)}
                onVote={handleVote}
              />
            )}
          </View>

          {/* Assets section */}
          {item.isVideo ? (
            <View
              style={{
                aspectRatio: 16 / 9,
                width: containerWidth,
              }}
              className="overflow-hidden bg-transparent"
            >
              <TouchableWithDoublePress
                className="flex-1 relative overflow-hidden ml-2"
                activeOpacity={0.95}
                onSinglePress={() => {
                  if (isFeedPage && item) {
                    router.push({
                      pathname: `/post-view/${item._id}` as RelativePathString,
                    });
                  }
                }}
                onDoublePress={handleDoubleTap}
              >
                <Image
                  source={thumbnail}
                  contentFit="cover"
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    inset: 0,
                    borderTopLeftRadius: 16,
                    borderBottomLeftRadius: 16,
                    borderTopWidth: 0.5,
                    borderBottomWidth: 0.5,
                    borderLeftWidth: 0.5,
                    borderColor: "#2F2F2F",
                  }}
                  placeholder={require("../../assets/images/nocover.png")}
                  placeholderContentFit="cover"
                  transition={500}
                  cachePolicy="memory-disk"
                />
                <View style={styles.videoOverlay} />
                <View
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    zIndex: 2,
                    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
                  }}
                >
                  <ClipsIconMedia size={40} />
                </View>
              </TouchableWithDoublePress>
            </View>
          ) : (
            item.assets &&
            item.assets.length > 0 &&
            (() => {
              const imageUrls = item.assets.map((asset) => asset.url);
              return (
                <CustomImageSlider
                  onRemoveImage={() => {}}
                  aspectRatio={item.aspectRatio || [3, 2]}
                  images={imageUrls}
                  isFeedPage={true}
                  postId={item._id}
                  setIndex={handleSetActiveIndex}
                  onDoubleTap={handleDoubleTap}
                />
              );
            })()
          )}

          {/* Like Animation */}
          <Animated.View
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: [
                { translateX: -25 },
                { translateY: -25 },
                { scale: scaleAnim },
              ],
              opacity: scaleAnim,
            }}
          >
            <FontAwesome name="thumbs-up" size={50} color="#FABE25" />
          </Animated.View>

          {/* Interaction Bar */}
          <InteractionBar
            post={item}
            onPressLike={handleLike}
            onPressComment={() => setIsCommentCountModalVisible(true)}
            activeSlideIndex={activeIndex}
            isPostContainer={true}
            isFeedPage={isFeedPage}
          />
        </View>
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
            targetId={item._id}
            autoFocusKeyboard={true}
            onClose={() => setIsCommentCountModalVisible(false)}
          />
        </Modal>
      </View>
    );
  }
);

export default PostContainer;

const styles = StyleSheet.create({
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 1,
  },
});
