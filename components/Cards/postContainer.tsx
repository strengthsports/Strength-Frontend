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
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { Divider } from "react-native-elements";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

// Type definitions
interface ActionButtonProps {
  iconName: keyof typeof FontAwesome.glyphMap;
  text: string;
  onPress?: () => void;
}

interface SwiperImageProps {
  uri: string;
  onDoubleTap: () => void;
}

interface PostData {
  _id: string;
  caption: string;
  assets: Array<{ url: string }>;
  postedBy: {
    _id: string;
    type: string;
    profilePic: string;
    firstName: string;
    lastName: string;
    headline: string;
  };
  createdAt: string;
  likesCount: number;
  commentsCount: number;
}

interface PostContainerProps {
  postData: PostData[];
}

// Memoized components
const ActionButton = memo<ActionButtonProps>(({ iconName, text, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-2 rounded-3xl">
      <FontAwesome name={iconName} size={16} color="gray" />
      <TextScallingFalse className="text-base text-white">
        {text}
      </TextScallingFalse>
    </View>
  </TouchableOpacity>
));

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

// Individual Post Component
const PostItem = ({ item }: { item: PostData }) => {
  const router = useRouter();
  const { user } = useSelector((state) => state?.auth);
  const serializedUser = encodeURIComponent(
    JSON.stringify({ id: item.postedBy._id, type: item.postedBy.type })
  );
  // State for individual post
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likesCount);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const { lines } = e.nativeEvent;
    const shouldShowSeeMore =
      lines.length > 2 || (lines as any).some((line: any) => line.truncated);
    setShowSeeMore(shouldShowSeeMore);
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);

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

  const closeModal = () => setIsModalVisible(false);

  const swiperConfig = {
    autoplay: false,
    showsPagination: true,
    loop: false,
    paginationStyle: { bottom: -22, zIndex: 20 },
    dotStyle: {
      backgroundColor: "grey",
      width: 4,
      height: 4,
      marginHorizontal: 20,
    },
    activeDotStyle: {
      backgroundColor: "white",
      width: 5,
      height: 5,
      marginLeft: 20,
      zIndex: 30,
    },
  };

  return (
    <View className="relative w-full max-w-xl self-center min-h-48 h-auto my-8">
      <View className="flex">
        {/* Profile Section */}
        <View className="ml-[5%] flex flex-row gap-2 z-20 pb-0">
          <TouchableOpacity
            className="w-[16%] h-[16%] min-w-[54] max-w-[64px] mt-[2px] aspect-square rounded-full bg-slate-400"
            onPress={() =>
              user._id === item.postedBy._id
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

          <View className="flex flex-col justify-between">
            <View>
              <TextScallingFalse className="text-white text-xl font-bold">
                {item.postedBy.firstName} {item.postedBy.lastName}
              </TextScallingFalse>
              <TextScallingFalse className="text-neutral-300 text-sm">
                {item.postedBy.headline}
              </TextScallingFalse>
            </View>
            <View className="flex flex-row items-center">
              <TextScallingFalse className="text-base text-neutral-400">
                {new Date(item.createdAt).toLocaleDateString()} &bull;{" "}
              </TextScallingFalse>
              <MaterialIcons name="public" size={12} color="gray" />
            </View>
          </View>
        </View>

        {/* Caption Section */}
        <View className="relative left-[5%] bottom-0 w-[95%] min-h-16 h-auto mt-[-22] rounded-tl-[72px] rounded-tr-[16px] pb-3 bg-neutral-900">
          <TouchableOpacity
            className="absolute right-4 p-2 z-30"
            onPress={() => setIsModalVisible(true)}
          >
            <MaterialIcons name="more-horiz" size={18} color="white" />
          </TouchableOpacity>

          <Modal
            visible={isModalVisible}
            transparent
            animationType="slide"
            onRequestClose={closeModal}
          >
            <TouchableOpacity
              className="flex-1 justify-end bg-black/50"
              activeOpacity={1}
              onPress={closeModal}
            >
              <View className="h-80 w-full bg-neutral-900 rounded-t-3xl p-4">
                <Divider
                  className="w-16 self-center rounded-full bg-neutral-700 my-1"
                  width={4}
                />
                <View className="flex-1 justify-evenly">
                  <TouchableOpacity className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg">
                    <MaterialIcons
                      name="bookmark-border"
                      size={24}
                      color="white"
                    />
                    <Text className="text-white ml-4">Bookmark</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg">
                    <FontAwesome name="share" size={20} color="white" />
                    <Text className="text-white ml-4">Share</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg">
                    <MaterialIcons
                      name="report-problem"
                      size={22}
                      color="white"
                    />
                    <Text className="text-white ml-4">Report</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg">
                    <FontAwesome name="user-plus" size={19} color="white" />
                    <Text className="text-white ml-4">
                      Follow {item.postedBy.firstName}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>

          <View className={`${isExpanded ? "pl-8" : "pl-12"} pr-6 pt-12 pb-4`}>
            <Text
              className="text-xl text-neutral-200"
              numberOfLines={isExpanded ? undefined : 2}
              ellipsizeMode="tail"
              onTextLayout={handleTextLayout}
            >
              {item.caption}
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
          <FontAwesome name="thumbs-up" size={50} color="yellow" />
        </Animated.View>

        {/* Interaction Bar */}
        <View className="relative left-[5%] bottom-0 w-[95%] min-h-12 h-auto rounded-bl-[72px] rounded-br-[16px] bg-neutral-900">
          <View className="w-full px-8 pr-6 py-3 flex flex-row justify-between items-center">
            <View className="flex flex-row items-center gap-2">
              <FontAwesome
                name={isLiked ? "thumbs-up" : "thumbs-o-up"}
                size={16}
                color={isLiked ? "yellow" : "gray"}
              />
              <TextScallingFalse className="text-base text-white">
                {likeCount} {isLiked ? "Liked" : "Likes"}
              </TextScallingFalse>
            </View>
            <TextScallingFalse className="text-base text-white">
              {item.commentsCount} Comments
            </TextScallingFalse>
          </View>

          <Divider
            style={{ marginLeft: "12%", width: "80%" }}
            width={0.2}
            color="grey"
          />

          <View className="w-full px-6 py-5 mb-1 flex flex-row justify-evenly items-center">
            <ActionButton
              iconName={isLiked ? "thumbs-up" : "thumbs-o-up"}
              text={isLiked ? "Liked" : "Like"}
              onPress={() => {
                setIsLiked(!isLiked);
                setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
              }}
            />
            <ActionButton iconName="comment" text="Comment" />
            <ActionButton iconName="paper-plane" text="Share" />
          </View>
        </View>
      </View>
    </View>
  );
};

// Main Container
const PostContainer = ({ postData }: PostContainerProps) => {
  return (
    <FlatList
      data={postData}
      renderItem={({ item }) => <PostItem item={item} />}
      keyExtractor={(item) => item._id}
      ListEmptyComponent={
        <Text className="text-white text-center">No posts available</Text>
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

export default PostContainer;
