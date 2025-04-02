import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextLayoutEventData,
  BackHandler,
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
import { RelativePathString } from "expo-router";
import { Image } from "expo-image";
import InteractionBar from "../PostContainer/InteractionBar";
import { postComment, toggleLike } from "~/reduxStore/slices/feed/feedSlice";
import { FollowUser } from "~/types/user";
import { useFollow } from "~/hooks/useFollow";
import { showFeedback } from "~/utils/feedbackToast";
import { useBottomSheet } from "~/context/BottomSheetContext";
import CommentModal from "../feedPage/CommentModal";
import { TextInput } from "react-native";
import { Colors } from "~/constants/Colors";
import StickyInput from "../ui/StickyInput";
import { useFetchCommentsQuery } from "~/reduxStore/api/feed/features/feedApi.comment";

type TaggedUser = {
  _id: string;
  username: string;
  type: string;
};

interface PostContainerProps {
  item: Post;
  highlightedHashtag?: string;
  isFeedPage?: boolean;
  isMyActivity?: boolean;
  handleBottomSheet?: (state: boolean) => void;
}

export interface PostContainerHandles {
  closeBottomSheet: (params: { type: string }) => void;
}

const PostContainer = forwardRef<PostContainerHandles, PostContainerProps>(
  ({ item, highlightedHashtag, isFeedPage, handleBottomSheet }, ref) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state?.profile);
    const serializedUser = encodeURIComponent(
      JSON.stringify({ id: item.postedBy?._id, type: item.postedBy?.type })
    );

    const { followUser, unFollowUser } = useFollow();

    // State for individual post
    const [isExpanded, setIsExpanded] = useState(false);
    const [showSeeMore, setShowSeeMore] = useState(false);
    const [activeIndex, setActiveIndex] = useState<any>(0);
    // Comment for individual post
    const [commentText, setCommentText] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [replyingTo, setReplyingTo] = useState<{
      commentId: string;
      name: string;
    } | null>(null);
    const progress = useRef(new Animated.Value(0)).current;

    const { refetch: refetchComments } = useFetchCommentsQuery({
      targetId: item._id,
      targetType: "Post",
    });

    const handleTextChange = (text: string) => {
      setCommentText(text);
      if (text === "" && replyingTo) {
        setReplyingTo(null);
      }
    };

    const handlePostComment = async () => {
      if (!commentText.trim()) return;
      setIsPosting(true);
      const isReply = replyingTo !== null;
      const textToPost = commentText;
      // Clear the input and reply context.
      setCommentText("");
      if (isReply) setReplyingTo(null);
      try {
        await dispatch(
          postComment({
            targetId: isReply ? replyingTo!.commentId : item._id,
            targetType: isReply ? "Comment" : "Post",
            text: textToPost,
          })
        ).unwrap();
        await refetchComments();
      } catch (error) {
        console.log("Failed to post comment:", error);
      }
      setCommentText("");
      setIsPosting(false);
    };

    // Get the openBottomSheet function from context
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();

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
        openBottomSheet({
          isVisible: true,
          content: (
            <>
              <CommentModal targetId={item._id} autoFocusKeyboard={true} />
              <StickyInput
                user={user}
                value={commentText}
                onChangeText={handleTextChange}
                onSubmit={handlePostComment}
                isPosting={isPosting}
                replyingTo={replyingTo}
                progress={progress}
                placeholder="Type your comment here"
                autoFocus={true}
              />
            </>
          ),
          height: "80%",
          bgcolor: "#000",
          border: true,
          maxHeight: "100%",
          draggableDirection: "both",
        });
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

    // Set slider active index
    const handleSetActiveIndex = (index: any) => {
      setActiveIndex(index);
    };

    // Caption expanding
    const handleTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      const { lines } = e.nativeEvent;
      const shouldShowSeeMore =
        lines.length > 2 || (lines as any).some((line: any) => line.truncated);
      setShowSeeMore(shouldShowSeeMore);
    };

    // Function to render caption with clickable hashtags and mention tags
    const renderCaptionWithTags = (
      caption: string,
      taggedUsers: TaggedUser[] // Array of user objects with _id and username
    ) => {
      // Split on both hashtags and mentions using regex
      return caption
        ?.split(/(#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)/g)
        .map((word, index) => {
          if (word.startsWith("#")) {
            return (
              <TextScallingFalse
                key={index}
                onPress={() =>
                  router.push(`/(app)/(post)/hashtag/${word.split("#")[1]}`)
                }
                className={`text-xl text-[#12956B] ${
                  highlightedHashtag?.toLowerCase() === word.toLowerCase() &&
                  "font-semibold"
                }`}
              >
                {word}
              </TextScallingFalse>
            );
          } else if (word.startsWith("@")) {
            // Find the tagged user by username
            // console.log(taggedUsers);
            const user = taggedUsers.find(
              (u) => u.username === word.split("@")[1]
            );
            // console.log(user);
            const serializedUser = encodeURIComponent(
              JSON.stringify({ id: user?._id, type: user?.type })
            );
            // console.log(serializedUser);
            return (
              <TextScallingFalse
                key={index}
                onPress={() =>
                  serializedUser &&
                  router.push(`/(app)/(profile)/profile/${serializedUser}`)
                }
                className="text-xl text-[#12956B]"
              >
                {word}
              </TextScallingFalse>
            );
          }

          // Return regular text for non-tag parts
          return <TextScallingFalse key={index}>{word}</TextScallingFalse>;
        });
    };

    // Memoized Caption
    const memoizedCaption = useMemo(
      () => renderCaptionWithTags(item.caption, item.taggedUsers || []),
      [item.caption, item.taggedUsers]
    );

    return (
      <View className="relative w-full max-w-xl self-center min-h-48 h-auto my-6">
        <View className="flex">
          {/* Profile Section */}
          <View className="relative ml-[5%] flex flex-row gap-2 z-20 pb-0">
            {/* Profile Picture */}
            <TouchableOpacity
              activeOpacity={0.5}
              className="w-[14%] h-[14%] min-w-[54] max-w-[64px] mt-[2px] aspect-square rounded-full bg-slate-700"
              onPress={() =>
                user?._id === item.postedBy?._id
                  ? router.push("/(app)/(tabs)/profile")
                  : router.push(`/(app)/(profile)/profile/${serializedUser}`)
              }
            >
              <Image
                source={
                  item.postedBy.profilePic
                    ? {
                        uri: item.postedBy.profilePic,
                      }
                    : nopic
                }
                style={{ width: "100%", height: "100%", borderRadius: 100 }}
                transition={500}
                cachePolicy="memory-disk"
                placeholder={require("../../assets/images/nopic.jpg")}
              />
            </TouchableOpacity>
            <TouchableOpacity className="absolute w-[54px] h-[54px] z-[-1] mt-[6px] ml-[1px] aspect-square rounded-full bg-black opacity-[8%] blur-3xl" />

            {/* Name, Headline, post date */}
            <View className="w-64 flex flex-col justify-between">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  user?._id === item.postedBy?._id
                    ? router.push("/(app)/(tabs)/profile")
                    : router.push(`/(app)/(profile)/profile/${serializedUser}`)
                }
              >
                <TextScallingFalse className="text-white text-xl font-bold">
                  {item.postedBy?.firstName} {item.postedBy?.lastName}
                </TextScallingFalse>
                <TextScallingFalse
                  className="text-[#EAEAEA] text-sm"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  @{item.postedBy.username} | {item.postedBy?.headline}
                </TextScallingFalse>
              </TouchableOpacity>
              <View className="flex flex-row items-center">
                <TextScallingFalse className="text-base text-neutral-400">
                  {formatTimeAgo(item.createdAt)} &bull;{" "}
                </TextScallingFalse>
                <MaterialIcons name="public" size={12} color="gray" />
              </View>
            </View>

            {/* Follow button */}
            {user?._id !== item.postedBy?._id && !item.isFollowing && (
              <TouchableOpacity
                className="absolute top-0 right-3 bg-black border border-[#808080] rounded-2xl px-2.5 py-1"
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
          <View className="relative left-[5%] bottom-0 w-[100%] min-h-16 h-auto mt-[-22] rounded-tl-[40px] rounded-tr-[35px] pb-2 bg-neutral-900">
            <TouchableOpacity
              className="absolute right-8 p-2 pt-1.5 z-30"
              onPress={() => handleOpenBottomSheet({ type: "settings" })}
            >
              <MaterialIcons name="more-horiz" size={20} color="white" />
            </TouchableOpacity>

            <View
              className={`${isExpanded ? "pl-6" : "pl-10"} pr-8 pt-12 pb-4`}
            >
              <TextScallingFalse
                onPress={() => {
                  isFeedPage &&
                    router.push({
                      pathname:
                        `/post-details/${item._id}` as RelativePathString,
                    });
                }}
                className="text-xl leading-5 text-neutral-200"
                numberOfLines={isExpanded ? undefined : 2}
                ellipsizeMode="tail"
                onTextLayout={handleTextLayout}
              >
                {memoizedCaption}
              </TextScallingFalse>
              {showSeeMore && !isExpanded && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsExpanded(true)}
                  className="mt-1"
                >
                  <TextScallingFalse className="text-theme text-sm">
                    See more
                  </TextScallingFalse>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Image Swiper */}
          {item.assets &&
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
            })()}

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
            postId={item._id}
            onPressLike={handleLike}
            onPressComment={() => handleOpenBottomSheet({ type: "comment" })}
            isLiked={item.isLiked}
            likesCount={item.likesCount}
            commentsCount={item.commentsCount}
            assetsCount={item.assets?.length || 0}
            activeSlideIndex={activeIndex}
            isPostContainer={true}
            isFeedPage={isFeedPage}
          />
        </View>
      </View>
    );
  }
);

export default PostContainer;
