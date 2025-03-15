import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  ImageStyle,
  Modal,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { Divider } from "react-native-elements";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import MoreModal from "../feedPage/MoreModal";
import LikerModal from "../feedPage/likerModal";
import CommentModal from "../feedPage/commentModal";
import { RootState } from "~/reduxStore";
import { formatTimeAgo } from "~/utils/formatTime";
import { swiperConfig } from "~/utils/swiperConfig";
import {
  useLikeContentMutation,
  useUnLikeContentMutation,
} from "~/reduxStore/api/feed/features/feedApi.likeUnlike";
import { FollowUser } from "~/types/user";
import { useFollow } from "~/hooks/useFollow";
import nopic from "@/assets/images/nopic.jpg";
import { Post, ReportPost } from "~/types/post";
import { useReport } from "~/hooks/useReport";
import SwiperImage from "../ui/SwiperImage";
import { showFeedback } from "~/utils/feedbackToast";
import { BlurView } from "expo-blur";
import CustomImageSlider from "@/components/Cards/imageSlideContainer";

const PostContainer = ({
  item,
  highlightedHashtag,
  onPressMore,
}: {
  item: Post;
  highlightedHashtag?: string;
  onPressMore?: (item: Post) => void;
}) => {
  const router = useRouter();
  const { user, followings } = useSelector(
    (state: RootState) => state?.profile
  );
  const isFollowingGlobal = followings?.includes(item.postedBy?._id) ?? false;
  const serializedUser = encodeURIComponent(
    JSON.stringify({ id: item.postedBy?._id, type: item.postedBy?.type })
  );
  const { followUser, unFollowUser } = useFollow();
  const { reportPost } = useReport();
  // State for individual post
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [followingStatus, setFollowingStatus] =
    useState<boolean>(isFollowingGlobal);
  const [isReported, setIsReported] = useState<boolean>(item?.isReported);
  const [isLiked, setIsLiked] = useState(item?.isLiked);
  const [likeCount, setLikeCount] = useState(item?.likesCount);
  const [commentCount, setCommentCount] = useState(item?.commentsCount);
  const [likePost, message] = useLikeContentMutation();
  const [unlikePost] = useUnLikeContentMutation();
  const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
  const [isPostLikersModalVisible, setIsPostLikersModalVisible] =
    useState(false);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [isCommentCountModalVisible, setIsCommentCountModalVisible] =
    useState(false);
  const [activeIndex, setActiveIndex] = useState<any>(0);

  const handleSetActiveIndex = (index: any) => {
    setActiveIndex(index);
  };

  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Sync local state with global state changes
  useEffect(() => {
    setFollowingStatus(isFollowingGlobal);
  }, [isFollowingGlobal]);

  const handleTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const { lines } = e.nativeEvent;
    const shouldShowSeeMore =
      lines.length > 2 || (lines as any).some((line: any) => line.truncated);
    setShowSeeMore(shouldShowSeeMore);
  };

  const handleLikeAction = async () => {
    try {
      // Optimistic update
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

      // API call
      const action = isLiked ? unlikePost : likePost;
      await action({
        targetId: item?._id,
        targetType: "Post",
      }).unwrap();
      // console.log("Message", message);
      // console.log(message?.data?.message);
    } catch (error) {
      // Rollback on error
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      console.error("Like action failed:", error);
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      // setIsLiked(true);
      // setLikeCount(prev => prev + 1);

      handleLikeAction();
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

  //handle follow
  const handleFollow = async () => {
    try {
      setFollowingStatus(true);
      const followData: FollowUser = {
        followingId: item.postedBy?._id,
        followingType: item.postedBy?.type,
      };

      showFeedback(
        `You are now following ${item?.postedBy?.firstName}`,
        "success"
      );

      await followUser(followData);
    } catch (err) {
      setFollowingStatus(false);
      console.error("Follow error:", err);
    }
  };

  //handle unfollow
  const handleUnfollow = async () => {
    try {
      setFollowingStatus(false);
      const unfollowData: FollowUser = {
        followingId: item.postedBy?._id,
        followingType: item.postedBy?.type,
      };

      await unFollowUser(unfollowData);
    } catch (err) {
      setFollowingStatus(true);
      console.error("Unfollow error:", err);
    }
  };

  //handle report
  const handleReport = async (reason: string) => {
    setIsReported((prev) => !prev);
    const reportData: ReportPost = {
      targetId: item._id,
      targetType: "Post",
      reason,
    };

    await reportPost(reportData);
  };

  // Function to render caption with clickable hashtags
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
            className={`text-xl text-[#12956B] ${
              highlightedHashtag?.toLowerCase() === word.toLowerCase() &&
              "font-semibold"
            }`}
          >
            {word}
          </Text>
        );
      }
      return word;
    });
  };

  const handleDeletePost = () => {
    console.log(`Post ${item._id} deleted successfully.`);
    setIsMoreModalVisible(false);
  };

  return (
    <View className="relative w-full max-w-xl self-center min-h-48 h-auto my-6">
      <View className="flex">
        {/* Profile Section */}
        <View className="relative ml-[5%] flex flex-row gap-2 z-20 pb-0">
          <TouchableOpacity
            activeOpacity={0.5}
            className="w-[16%] h-[16%] min-w-[54] max-w-[64px] mt-[2px] aspect-square rounded-full bg-slate-700"
            onPress={() =>
              user?._id === item.postedBy?._id
                ? router.push("/(app)/(tabs)/profile")
                : router.push(`/(app)/(profile)/profile/${serializedUser}`)
            }
          >
            <Image
              className="w-full h-full rounded-full"
              source={
                item.postedBy.profilePic
                  ? {
                      uri: item.postedBy.profilePic,
                    }
                  : nopic
              }
              style={
                {
                  elevation: 8,
                  shadowColor: "black",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.8,
                  shadowRadius: 4,
                } as ImageStyle
              }
            />
          </TouchableOpacity>
          <BlurView
            intensity={20}
            tint="dark"
            className="absolute w-[54px] h-[54px] z-[-1] mt-[0px] ml-[0px] aspect-square rounded-full opacity-40"
          />

          <View className="w-64 flex flex-col justify-between">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                user?._id === item.postedBy?._id
                  ? router.push("/(app)/(tabs)/profile")
                  : router.push(`../(main)/profile/${serializedUser}`)
              }
            >
              <TextScallingFalse className="text-white text-xl font-bold">
                {item.postedBy?.firstName} {item.postedBy?.lastName}
              </TextScallingFalse>
              <TextScallingFalse
                className="text-neutral-300 text-sm"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.postedBy?.headline}
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
          {user?._id !== item.postedBy?._id && !followingStatus && (
            <TouchableOpacity
              className="absolute top-0 right-3 bg-black border border-[#808080] rounded-2xl px-2.5 py-1"
              onPress={handleFollow}
            >
              <TextScallingFalse className="text-white text-sm">
                + Follow
              </TextScallingFalse>
            </TouchableOpacity>
          )}
        </View>

        {/* Caption Section */}
        <View className="relative left-[5%] bottom-0 w-[95%] min-h-16 h-auto mt-[-22] rounded-tl-[40px] rounded-tr-[16px] pb-3 bg-neutral-900">
          <TouchableOpacity
            className="absolute right-4 p-2 z-30"
            // onPress={() => setIsMoreModalVisible(true)}
            onPress={() =>
              onPressMore({
                ...item,
                followingStatus: isFollowingGlobal,
                isReported: item?.isReported,
                currUser: user?._id,
              })
            }
          >
            <MaterialIcons name="more-horiz" size={18} color="white" />
          </TouchableOpacity>

          {/* <Modal
            visible={isMoreModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setIsMoreModalVisible(false)}
          >
            <TouchableOpacity
              className="flex-1 justify-end bg-black/50"
              activeOpacity={1}
              onPress={() => setIsMoreModalVisible(false)}
            >
              <MoreModal
                firstName={item.postedBy?.firstName}
                followingStatus={followingStatus}
                isOwnPost={item.postedBy?._id === user?._id}
                postId={item._id}
                onDelete={handleDeletePost}
                handleFollow={handleFollow}
                handleUnfollow={handleUnfollow}
                handleReport={handleReport}
                isReported={isReported}
              />
            </TouchableOpacity>
          </Modal> */}

          <View className={`${isExpanded ? "pl-8" : "pl-12"} pr-6 pt-12 pb-4`}>
            <Text
              className="text-xl leading-5 text-neutral-200"
              numberOfLines={isExpanded ? undefined : 2}
              ellipsizeMode="tail"
              onTextLayout={handleTextLayout}
            >
              {renderCaptionWithHashtags(item.caption)}
            </Text>

            {showSeeMore && !isExpanded && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsExpanded(true)}
                className="mt-1"
              >
                <Text className="text-theme text-sm">See more</Text>
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
                postDetails={item}
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
        <View className="relative left-[5%] bottom-1 z-[-10] pt-1 w-[95%] min-h-12 h-auto rounded-bl-[40px] rounded-br-[16px] bg-neutral-900">
          <View className="w-full px-8 pr-6 py-3 flex flex-row justify-between items-center">
            {/* like */}
            <TouchableOpacity
              className="flex flex-row items-center gap-2"
              onPress={() => setIsPostLikersModalVisible(true)}
            >
              <FontAwesome name="thumbs-up" size={16} color="gray" />
              <TextScallingFalse className="text-base text-white">
                {likeCount} {likeCount > 1 ? "Likes" : "Like"}
              </TextScallingFalse>
              {isPostLikersModalVisible && (
                <Modal
                  visible={isPostLikersModalVisible}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setIsPostLikersModalVisible(false)}
                >
                  <TouchableOpacity
                    className="flex-1 justify-end bg-black/50"
                    activeOpacity={1}
                    onPress={() => setIsPostLikersModalVisible(false)}
                  ></TouchableOpacity>
                  <LikerModal targetId={item?._id} targetType="Post" />
                </Modal>
              )}
            </TouchableOpacity>

            {item.assets && item.assets.length > 1 && (
              <View className="flex-row justify-center">
                {Array.from({ length: item.assets.length }).map((_, i) => (
                  <View
                    key={`dot-${i}`}
                    className={
                      i === activeIndex
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
              onPress={() => setIsCommentCountModalVisible(true)}
            >
              <TextScallingFalse className="text-base text-white">
                {commentCount} Comments
              </TextScallingFalse>
              {isCommentCountModalVisible && (
                <Modal
                  visible={isCommentCountModalVisible}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setIsCommentCountModalVisible(false)}
                >
                  <TouchableOpacity
                    className="flex-1 justify-end bg-black/50"
                    activeOpacity={1}
                    onPress={() => setIsCommentCountModalVisible(false)}
                  >
                    <CommentModal
                      targetId={item?._id}
                      setCommentCount={setCommentCount}
                    />
                  </TouchableOpacity>
                </Modal>
              )}
            </TouchableOpacity>
          </View>

          <Divider
            style={{ marginLeft: "12%", width: "80%" }}
            width={0.2}
            color="grey"
          />

          <View className="w-full px-6 py-5 mb-1 flex flex-row justify-evenly items-center">
            <TouchableOpacity onPress={handleLikeAction}>
              <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-2 rounded-3xl">
                <FontAwesome
                  name={isLiked ? "thumbs-up" : "thumbs-o-up"}
                  size={16}
                  color={isLiked ? "#FABE25" : "gray"}
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
            <TouchableOpacity
              className="flex flex-row items-center gap-2"
              onPress={() => setIsCommentModalVisible(true)}
            >
              <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-2 rounded-3xl">
                <FontAwesome name="comment" size={16} color="grey" />
                <TextScallingFalse className="text-base text-white">
                  Comment
                </TextScallingFalse>
              </View>
              {isCommentModalVisible && (
                <Modal
                  visible={isCommentModalVisible}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setIsCommentModalVisible(false)}
                >
                  <TouchableOpacity
                    className="flex-1 justify-end bg-black/50"
                    activeOpacity={1}
                    onPress={() => setIsCommentModalVisible(false)}
                  >
                    <CommentModal
                      targetId={item?._id}
                      autoFocusKeyboard={isCommentModalVisible}
                      setCommentCount={setCommentCount}
                    />
                  </TouchableOpacity>
                </Modal>
              )}
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
      </View>
    </View>
  );
};

export default PostContainer;
