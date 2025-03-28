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
import CustomBottomSheet from "../ui/CustomBottomSheet";
import { setCurrentPost } from "~/reduxStore/slices/user/profileSlice";
import { RelativePathString } from "expo-router";
import { Image } from "expo-image";
import InteractionBar from "../PostContainer/InteractionBar";
import { toggleLike } from "~/reduxStore/slices/feed/feedSlice";

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
    const { user } = useSelector((state: RootState) => state?.profile);
    const serializedUser = encodeURIComponent(
      JSON.stringify({ id: item.postedBy?._id, type: item.postedBy?.type })
    );
    // State to hold the selected data from the button press
    const [isBottomSheetOpen, setBottomSheetOpen] = useState<any>({
      type: "",
      status: false,
    });
    // State for individual post
    const [isExpanded, setIsExpanded] = useState(false);
    const [showSeeMore, setShowSeeMore] = useState(false);
    const [activeIndex, setActiveIndex] = useState<any>(0);

    // Ref for the bottom sheet
    const likeBottomSheetRef = useRef(null);
    const settingsBottomSheetRef = useRef(null);

    // Ref for the like animation
    const scaleAnim = useRef(new Animated.Value(0)).current;

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

    // Handle like on double tap on post
    const handleDoubleTap = () => {
      if (!item.isLiked) {
        // setIsLiked(true);
        // setLikeCount(prev => prev + 1);
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
            {user?._id !== item.postedBy?._id && !item.isFollowing && (
              <TouchableOpacity
                className="absolute top-0 right-3 bg-black border border-[#808080] rounded-2xl px-2.5 py-1"
                // onPress={handleFollow}
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
              className={`${isExpanded ? "pl-6" : "pl-10"} pr-8 pt-12 pb-4`}
            >
              <Text
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
