import React, { useCallback, useState, useMemo, useRef, memo } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  ImageStyle,
  LayoutChangeEvent,
  Modal,
  Button,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { Divider } from "react-native-elements";
// import Modal from "react-native-modal"
// Type definitions for components
interface ActionButtonProps {
  iconName: keyof typeof FontAwesome.glyphMap;
  text: string;
  onPress?: () => void;
}

interface SwiperImageProps {
  uri: string;
  onDoubleTap: () => void;
}

// Memoized components with proper typing
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
  let lastTap = 0;

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      // 300ms delay for double tap
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

export default function PostContainer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(40);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [isModalVisible, setIsModalVisible] = useState(false);

  // const opneModal = () => {
  //   setIsModalVisible(!isModalVisible);
  // };
  const closeModal = () => setIsModalVisible(false);

  const imageUris = useMemo<string[]>(
    () => [
      "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2Fec810ca3-96d1-4101-981e-296240d60437.jpg?alt=media&token=da6e81af-e2d0-49c0-8ef0-fe923f837a07",
      "https://images.unsplash.com/photo-1547469447-4afec158715b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    []
  );

  const swiperConfig = useMemo(
    () => ({
      autoplay: false,
      autoplayTimeout: 3,
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
    }),
    []
  );

  const handleDoubleTap = () => {
    if (!isLiked) {
      // Only allow liking if the post is not already liked
      setIsLiked(true); // Set liked to true
      setLikeCount((prev) => prev + 1); // Increment like count

      // Reset animation value
      scaleAnim.setValue(0);

      // Animation sequence
      Animated.sequence([
        // Scale up and fade in
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200, // Faster scale-up
          useNativeDriver: true,
        }),
        // Stay visible for 300ms
        Animated.delay(500),
        // Scale down and fade out
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200, // Faster scale-down
          useNativeDriver: true,
        }),
      ]).start();

      // Log results to the console
      console.log("Post Liked!");
      console.log("Current Like Status:", true);
      console.log("Updated Like Count:", likeCount + 1);
    } else {
      console.log("Post is already liked. No action taken.");
    }
  };

  const ModalView = () => (
    <View className="flex-1 justify-evenly">
      <TouchableOpacity
        className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg"
        onPress={() => console.log("Bookmark pressed")}
      >
        <MaterialIcons name="bookmark-border" size={24} color="white" />
        <Text className="text-white ml-4">Bookmark</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg"
        onPress={() => console.log("Share pressed")}
      >
        <FontAwesome name="share" size={20} color="white" />
        <Text className="text-white ml-4">Share</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg"
        onPress={() => console.log("Report pressed")}
      >
        <MaterialIcons name="report-problem" size={22} color="white" />
        <Text className="text-white ml-4">Report</Text>
      </TouchableOpacity>

      {/* Follow Section */}
      <TouchableOpacity
        className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg"
        onPress={() => console.log("Follow pressed")}
      >
        <FontAwesome name="user-plus" size={19} color="white" />
        <Text className="text-white ml-4">Follow Sebastian</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="relative w-full max-w-xl self-center min-h-48 h-auto my-8">
      <View className="flex">
        {/* Profile Section */}
        <View className="ml-[5%] flex flex-row gap-2 z-20 pb-0">
          <Image
            className="w-[16%] h-[16%] min-w-[54] max-w-[64px] mt-[2px] aspect-square rounded-full bg-slate-400"
            source={{ uri: imageUris[1] }}
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

          <View className="flex flex-col justify-between">
            <View>
              <TextScallingFalse className="text-white text-xl font-bold">
                Rahul Sharma
              </TextScallingFalse>
              <TextScallingFalse className="text-neutral-300 text-sm">
                Cricketer | Right hand batsman
              </TextScallingFalse>
            </View>
            <View className="flex flex-row items-center">
              <TextScallingFalse className="text-base text-neutral-400">
                8 h ago &bull;{" "}
              </TextScallingFalse>
              <MaterialIcons name="public" size={12} color="gray" />
            </View>
          </View>
        </View>

        {/* Grey Top Caption Div */}
        <View className="relative left-[5%] bottom-0 w-[95%] min-h-16 h-auto mt-[-22] rounded-tl-[72px] rounded-tr-[16px] pb-3 bg-neutral-900">
          <TouchableOpacity
            className="absolute right-4 p-2 z-30"
            onPress={() => setIsModalVisible(true)}
          >
            <MaterialIcons name="more-horiz" size={18} color="white" />
          </TouchableOpacity>

          <View>
            <Modal
              visible={isModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsModalVisible(false)} //Android
              onDismiss={() => setIsModalVisible(false)} //IOS
              presentationStyle="formSheet"
            >
              <TouchableOpacity
                className="flex-1 justify-end bg-black/50"
                activeOpacity={1}
                onPress={closeModal}
              >
                <View className="h-80 w-full bg-neutral-900 rounded-t-3xl p-4">
                  <Divider
                    className="w-16 self-center rounded-full bg-neutral-700 my-1 "
                    width={4}
                  />
                  
                  <ModalView />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          <View className={`${isExpanded ? "pl-8" : "pl-12"} pr-6 pt-12 pb-4`}>
            <Text
              className="text-xl text-neutral-200"
              numberOfLines={isExpanded ? undefined : 2}
              ellipsizeMode="tail"
              onTextLayout={(e) => {
                const { lines } = e.nativeEvent;
                if (!isExpanded) {
                  // Show "See more" only if text is truncated
                  setShowSeeMore(
                    lines.length > 2 ||
                      (lines as any).some((line: any) => line.truncated)
                  );
                }
              }}
            >
              Absolutely! If you're using NativeWind, you can leverage its
              built-in transition utilities to simplify the animation process.
              NativeWind uses Tailwind CSS under the hood, so we can use
              Tailwind's transition classes to achieve smooth animations
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

        {/* Swiper Section */}
        <Swiper
          {...swiperConfig}
          className="aspect-[3/2] w-full h-auto rounded-l-[20px] bg-slate-400"
        >
          {imageUris.map((uri) => (
            <SwiperImage key={uri} uri={uri} onDoubleTap={handleDoubleTap} />
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
            opacity: scaleAnim, // Fade animation
          }}
        >
          <FontAwesome name="thumbs-up" size={50} color="yellow" />
        </Animated.View>

        {/* Bottom Grey Div */}
        <View className="relative left-[5%] bottom-0 w-[95%] min-h-12 h-auto rounded-bl-[72px] rounded-br-[16px] bg-neutral-900">
          <View className="w-full px-8 pr-6 py-3 flex flex-row justify-between items-center">
            <View className="flex flex-row justify-between items-center gap-2">
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
              3 Comments
            </TextScallingFalse>
          </View>

          <Divider
            style={{ marginLeft: "12%", width: "80%" }}
            width={0.2}
            color="grey"
          />

          <View className="w-full px-6 py-5 mb-1 mr flex flex-row justify-evenly items-center">
            <ActionButton
              iconName={isLiked ? "thumbs-up" : "thumbs-o-up"}
              text={isLiked ? "Liked" : "Like"}
              onPress={() => {
                setIsLiked((prev) => !prev);
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
}
