import React, { useState, useRef, memo } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  ImageStyle,
  FlatList,
  Modal,
  NativeSyntheticEvent,
  TextLayoutEventData,
  Pressable,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { Divider } from "react-native-elements";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  useLikeContentMutation,
  useUnLikeContentMutation,
} from "~/reduxStore/api/likeUnlikeApi";
import { Post } from "~/reduxStore/api/feedPostApi";
import MoreModal from "../feedPage/moreModal";
import LikersList from "../feedPage/likerModal";
import LikerModal from "../feedPage/likerModal";
import CommentModal from "../feedPage/commentModal";
import {
  useFollowUserMutation,
  useUnFollowUserMutation,
} from "~/reduxStore/api/profile/profileApi.follow";
import { AppDispatch } from "~/reduxStore";
import { setFollowingCount } from "~/reduxStore/slices/user/authSlice";
import { formatTimeAgo } from "~/utils/formatTime";
import { swiperConfig } from "~/utils/swiperConfig";

// Type definitions
interface SwiperImageProps {
  uri: string;
  onDoubleTap: () => void;
}

const SwiperImage = memo<SwiperImageProps>(({ uri, onDoubleTap }) => {
  let lastTap = useRef(0).current;

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      onDoubleTap();
    }
    lastTap = now;
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={handleDoubleTap}>
      <Image
        className="w-full h-full object-cover"
        source={{ uri }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
});

const PostContainer = ({ item }: { item: Post }) => {
  const router = useRouter();
  const { user } = useSelector((state: any) => state?.auth);
  const dispatch = useDispatch<AppDispatch>();
  const serializedUser = encodeURIComponent(
    JSON.stringify({ id: item.postedBy?._id, type: item.postedBy?.type })
  );
  // State for individual post
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);

  const [isLiked, setIsLiked] = useState(item?.isLiked);
  const [followingStatus, setFollowingStatus] = useState<boolean>(
    item?.isFollowing
  );
  const [likeCount, setLikeCount] = useState(item?.likesCount);
  const [commentCount, setCommentCount] = useState(item?.commentsCount);
  const [likePost, message] = useLikeContentMutation();
  const [unlikePost] = useUnLikeContentMutation();
  const [followUser] = useFollowUserMutation();
  const [unFollowUser] = useUnFollowUserMutation();
  // const [showLikers, setShowLikers] = useState(false);
  const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
  const [isPostLikersModalVisible, setIsPostLikersModalVisible] =
    useState(false);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [isCommentCountModalVisible, setIsCommentCountModalVisible] =
    useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;

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
    }
  };

  //handle follow
  const handleFollow = async () => {
    try {
      setFollowingStatus(true);
      // Perform the follow action via mutation
      await followUser({
        followingId: item.postedBy?._id,
        followingType: item.postedBy?.type,
      }).unwrap();
      dispatch(setFollowingCount("follow"));
      console.log("Followed Successfully!");
    } catch (err) {
      setFollowingStatus(false);
      dispatch(setFollowingCount("unfollow"));
      console.error("Follow error:", err);
    }
  };

  //handle unfollow
  const handleUnfollow = async () => {
    try {
      setFollowingStatus(false);
      await unFollowUser({
        followingId: item.postedBy?._id,
        followingType: item.postedBy?.type,
      }).unwrap();
      dispatch(setFollowingCount("unfollow"));
      console.log("Unfollowed Successfully!");
    } catch (err) {
      setFollowingStatus(true);
      dispatch(setFollowingCount("follow"));
      console.error("Unfollow error:", err);
    }
  };

  // Function to render caption with clickable hashtags
  const renderCaptionWithHashtags = (caption: string) => {
    return caption?.split(/(\#[a-zA-Z0-9_]+)/g).map((word, index) => {
      if (word.startsWith("#")) {
        return (
          <Text
            key={index}
            onPress={() => router.push("/(app)/(main)/settings")}
            className="text-xl text-[#12956B]"
          >
            {word}
          </Text>
        );
      }
      return word;
    });
  };

  return (
    <View className="relative w-full max-w-xl self-center min-h-48 h-auto my-8">
      <View className="flex">
        {/* Profile Section */}
        <View className="ml-[5%] flex flex-row gap-2 z-20 pb-0">
          <TouchableOpacity
            activeOpacity={0.5}
            className="w-[16%] h-[16%] min-w-[54] max-w-[64px] mt-[2px] aspect-square rounded-full bg-slate-400"
            onPress={() =>
              user?._id === item.postedBy?._id
                ? router.push("/(app)/(tabs)/profile")
                : router.push(`../(main)/profile/${serializedUser}`)
            }
          >
            <Image
              className="w-full h-full rounded-full"
              source={{
                uri: item.postedBy.profilePic || "https://placehold.co/400",
              }}
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
          {user?._id !== item.postedBy?._id && (
            <TouchableOpacity
              className="absolute top-0 right-3 bg-black border border-[#808080] rounded-2xl px-2.5 py-1"
              onPress={followingStatus ? handleUnfollow : handleFollow}
            >
              <TextScallingFalse className="text-white text-sm">
                {followingStatus ? "Following" : "+ Follow"}
              </TextScallingFalse>
            </TouchableOpacity>
          )}
        </View>

        {/* Caption Section */}
        <View className="relative left-[5%] bottom-0 w-[95%] min-h-16 h-auto mt-[-22] rounded-tl-[72px] rounded-tr-[16px] pb-3 bg-neutral-900">
          <TouchableOpacity
            className="absolute right-4 p-2 z-30"
            onPress={() => setIsMoreModalVisible(true)}
          >
            <MaterialIcons name="more-horiz" size={18} color="white" />
          </TouchableOpacity>

          <Modal
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
              <MoreModal firstName={item.postedBy?.firstName} />
            </TouchableOpacity>
          </Modal>

          <View className={`${isExpanded ? "pl-8" : "pl-12"} pr-6 pt-12 pb-4`}>
            <Text
              className="text-xl text-neutral-200"
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
        {item.assets && item.assets.length > 0 && (
          <Swiper
            {...swiperConfig}
            className="aspect-[3/2] w-full h-auto rounded-l-[20px] bg-slate-400"
          >
            {item.assets.map((asset) => (
              <SwiperImage
                key={asset.url}
                uri={asset.url}
                onDoubleTap={handleDoubleTap}
              />
            ))}
          </Swiper>
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
        <View className="relative left-[5%] bottom-1 z-[-10] pt-1 w-[95%] min-h-12 h-auto rounded-bl-[72px] rounded-br-[16px] bg-neutral-900">
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
                  ></TouchableOpacity>
                  <CommentModal
                    targetId={item?._id}
                    setCommentCount={setCommentCount}
                  />
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
                    {/* <LikerModal targetId={item._id} targetType="Post" /> */}
                  </TouchableOpacity>
                  <CommentModal
                    targetId={item?._id}
                    autoFocusKeyboard={isCommentModalVisible}
                    setCommentCount={setCommentCount}
                  />
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
