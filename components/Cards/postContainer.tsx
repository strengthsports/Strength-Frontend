import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
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
  BackHandler,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import {
  MaterialIcons,
  FontAwesome,
  AntDesign,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { Divider } from "react-native-elements";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import MoreModal from "../feedPage/MoreModal";
import LikerModal from "../feedPage/LikerModal";
import CommentModal from "../feedPage/CommentModal";
import { AppDispatch, RootState } from "~/reduxStore";
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
import CustomBottomSheet from "../ui/CustomBottomSheet";
import { setCurrentPost } from "~/reduxStore/slices/user/profileSlice";
import { RelativePathString } from "expo-router";
import CustomDivider from "../ui/CustomDivider";

type TaggedUser = {
  _id: string;
  username: string;
  type: string;
};

interface PostContainerProps {
  item: Post;
  highlightedHashtag?: string;
  isFeedPage?: boolean;
  handleBottomSheet?: (state: boolean) => void;
}

export interface PostContainerHandles {
  closeBottomSheet: (params: { type: string }) => void;
}

const PostContainer = forwardRef<PostContainerHandles, PostContainerProps>(
  ({ item, highlightedHashtag, isFeedPage, handleBottomSheet }, ref) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
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
    // State to hold the selected data from the button press
    const [isBottomSheetOpen, setBottomSheetOpen] = useState<any>({
      type: "",
      status: false,
    });

    // Ref for the bottom sheet
    const likeBottomSheetRef = useRef(null);
    const settingsBottomSheetRef = useRef(null);

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
              <Text
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
              </Text>
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
              <Text
                key={index}
                onPress={() =>
                  serializedUser &&
                  router.push(`/(app)/(profile)/profile/${serializedUser}`)
                }
                className="text-xl text-[#12956B]"
              >
                {word}
              </Text>
            );
          }

          // Return regular text for non-tag parts
          return <Text key={index}>{word}</Text>;
        });
    };

    const handleDeletePost = () => {
      console.log(`Post ${item._id} deleted successfully.`);
      setIsMoreModalVisible(false);
    };

    // To open bottom sheet
    const handleOpenBottomSheet = ({ type }: { type: string }) => {
      console.log(`${type} Bottom sheet opens...`);
      handleBottomSheet && handleBottomSheet(true);
      setBottomSheetOpen({ type, status: true });
      type === "like"
        ? likeBottomSheetRef.current?.scrollTo(-550)
        : type === "settings"
        ? settingsBottomSheetRef.current?.scrollTo(-220)
        : null;
    };

    // To close bottom sheet
    const handleCloseBottomSheet = ({ type }: { type: string }) => {
      console.log("Called");
      console.log(type);
      console.log(likeBottomSheetRef);
      type === "like"
        ? likeBottomSheetRef.current?.scrollTo(0)
        : type === "settings"
        ? settingsBottomSheetRef.current?.scrollTo(0)
        : null;
      setBottomSheetOpen({ type, status: false });
      handleBottomSheet && handleBottomSheet(false);
    };

    // Expose the handleCloseBottomSheet function to the parent
    useImperativeHandle(ref, () => ({
      closeBottomSheet: (params: { type: string }) =>
        handleCloseBottomSheet(params),
    }));

    // Handle hardware back press
    useEffect(() => {
      const handleBackPress = () => {
        if (isBottomSheetOpen.status) {
          handleCloseBottomSheet({ type: isBottomSheetOpen.type });
          return true; // Prevent default back behavior
        }
        return false; // Default back behavior
      };

      BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      // Cleanup on component unmount
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }, [isBottomSheetOpen]);

    return (
      <View className="relative w-full max-w-xl self-center min-h-48 h-auto my-6">
        <View className="flex">
          {/* Profile Section */}
          <View className="relative ml-[5%] flex flex-row gap-2 z-20 pb-0">
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
                className="w-full h-full rounded-full"
                source={
                  item.postedBy.profilePic
                    ? {
                        uri: item.postedBy.profilePic,
                      }
                    : nopic
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
                    : router.push(`/(app)/(profile)/profile/${serializedUser}`)
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
              onPress={() => handleOpenBottomSheet({ type: "settings" })}
            >
              <MaterialIcons name="more-horiz" size={18} color="white" />
              <CustomBottomSheet
                ref={settingsBottomSheetRef}
                onClose={() => handleCloseBottomSheet({ type: "settings" })}
                animationSpeed={20}
                controllerVisibility={true}
                isFixed={true}
                fixedHeight={220}
              >
                {isBottomSheetOpen.type === "settings" &&
                  isBottomSheetOpen.status && (
                    <MoreModal
                      firstName={item.postedBy.firstName}
                      followingStatus={item.followingStatus}
                      isOwnPost={item.postedBy._id === item.currUser}
                      postId={item._id}
                      isReported={item.isReported}
                    />
                  )}
              </CustomBottomSheet>
            </TouchableOpacity>

            <View
              className={`${isExpanded ? "pl-8" : "pl-12"} pr-6 pt-12 pb-4`}
            >
              <Text
                className="text-xl leading-5 text-neutral-200"
                numberOfLines={isExpanded ? undefined : 2}
                ellipsizeMode="tail"
                onTextLayout={handleTextLayout}
              >
                {renderCaptionWithTags(item.caption, item.taggedUsers || [])}
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
          <View className="bg-neutral-900 relative left-[5%] bottom-1 z-[-10] pt-1 w-[95%] min-h-12 h-auto rounded-bl-[40px] rounded-br-[16px]">
            <View className="w-full px-8 pr-6 py-3 flex flex-row justify-between items-center">
              {/* like */}
              <TouchableOpacity
                className="flex flex-row items-center gap-2"
                onPress={() =>
                  isFeedPage
                    ? handleOpenBottomSheet({ type: "like" })
                    : router.push("/post-details/1/likes")
                }
              >
                <AntDesign name="like1" size={16} color="#fbbf24" />
                <TextScallingFalse className="text-base text-white font-light">
                  {likeCount} {likeCount > 1 ? "Likes" : "Like"}
                </TextScallingFalse>
                <CustomBottomSheet
                  ref={likeBottomSheetRef}
                  onClose={() => handleCloseBottomSheet({ type: "like" })}
                  animationSpeed={20}
                  controllerVisibility={false}
                  bgColor="bg-[#000]"
                >
                  {isBottomSheetOpen.type === "like" &&
                    isBottomSheetOpen.status && (
                      <LikerModal targetId={item?._id} targetType="Post" />
                    )}
                </CustomBottomSheet>
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
                onPress={() => {
                  router.push({
                    pathname: "/post-details/1" as RelativePathString,
                  });
                  dispatch(setCurrentPost(item));
                }}
              >
                <TextScallingFalse className="text-base text-white font-light">
                  {commentCount} Comments
                </TextScallingFalse>
                {/* <CustomBottomSheet
                ref={commentBottomSheetRef}
                onClose={() => handleCloseBottomSheet({ type: "comment" })}
                animationSpeed={20}
                controllerVisibility={false}
                bgColor="bg-[#000]"
              >
                {isBottomSheetOpen.type === "comment" &&
                  isBottomSheetOpen.status && (
                    <CommentModal
                      targetId={item?._id}
                      setCommentCount={setCommentCount}
                    />
                  )}
              </CustomBottomSheet> */}
              </TouchableOpacity>
            </View>

            <View className="w-[90%] mx-auto py-5 mb-1 flex flex-row justify-end gap-x-5 items-center border-t-[0.5px] border-[#5C5C5C]">
              {/* like */}
              <TouchableOpacity onPress={handleLikeAction}>
                <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-1.5 rounded-3xl">
                  <AntDesign
                    name={isLiked ? "like1" : "like2"}
                    size={16}
                    color={isLiked ? "#FABE25" : "white"}
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
                <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-1.5 rounded-3xl">
                  {/* <FontAwesome name="comment" size={16} color="grey" /> */}
                  <Feather name="message-square" size={16} color="white" />
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
              {/* share */}
              <TouchableOpacity className="mr-3">
                <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-1.5 rounded-3xl">
                  <FontAwesome5 name="location-arrow" size={16} color="white" />
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
  }
);

export default PostContainer;
