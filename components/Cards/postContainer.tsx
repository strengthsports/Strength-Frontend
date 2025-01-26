import React, { useCallback, useState, useMemo, useRef, memo } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  ImageStyle,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Swiper from "react-native-swiper";
import { Divider } from "react-native-elements";

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
      <TextScallingFalse className="text-base text-white">{text}</TextScallingFalse>
    </View>
  </TouchableOpacity>
));

const SwiperImage = memo<SwiperImageProps>(({ uri, onDoubleTap }) => {
  let lastTap = 0;

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) { // 300ms delay for double tap
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

export default function PostContainerSmall() {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(40);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const imageUris = useMemo<string[]>(() => [
    "https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2Fec810ca3-96d1-4101-981e-296240d60437.jpg?alt=media&token=da6e81af-e2d0-49c0-8ef0-fe923f837a07",
    "https://images.unsplash.com/photo-1547469447-4afec158715b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ], []);

  const swiperConfig = useMemo(() => ({
    autoplay: false,
    autoplayTimeout: 3,
    showsPagination: true,
    loop: false,
    paginationStyle: { bottom: -22, zIndex: 20 },
    dotStyle: {
      backgroundColor: 'grey',
      width: 3,
      height: 3,
      marginHorizontal: 20,
    },
    activeDotStyle: {
      backgroundColor: "white",
      width: 4,
      height: 4,
      marginLeft: 20,
      zIndex: 30
    }
  }), []);

  const handleDoubleTap = () => {
    if (!isLiked) { // Only allow liking if the post is not already liked
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

  return (
    <View className="relative w-full max-w-xl self-center min-h-48 h-auto my-8">
      <View className="flex">
        {/* Profile Section */}
        <View className="ml-[5%] flex flex-row gap-2 z-20 pb-0">
          <Image
            className="w-[16%] h-[16%] min-w-[54] max-w-[64px] mt-[2px] aspect-square rounded-full bg-slate-400"
            source={{ uri: imageUris[1] }}
            style={{
              elevation: 8,
              shadowColor: 'black',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.8,
              shadowRadius: 4,
            } as ImageStyle}
          />

          <View className="flex flex-col justify-between">
            <View>
              <TextScallingFalse className="text-white text-xl font-bold">Rahul Sharma</TextScallingFalse>
              <TextScallingFalse className="text-neutral-300 text-sm">Cricketer | Right hand batsman</TextScallingFalse>
            </View>
            <View className="flex flex-row items-center">
              <TextScallingFalse className="text-base text-neutral-400">8 h ago  &bull;  </TextScallingFalse>
              <MaterialIcons name="public" size={12} color="gray" />
            </View>
          </View>
        </View>

        {/* Grey Top Caption Div */}
        <View className="relative left-[5%] bottom-0 w-[95%] min-h-16 h-auto mt-[-22] rounded-tl-[50px] rounded-tr-[16px] pb-3 bg-neutral-900">
          <MaterialIcons className="absolute right-6 top-2" name="more-horiz" size={18} color="white" />
          <TextScallingFalse className="pl-10 pr-6 pt-10 pb-3 text-sm text-white">
            A lon asd asd asd  iksad fsafjkakj sfjh hja  h    j a asdss jhasd jhasd hja sdh asd hjaksdkjh
          </TextScallingFalse>
        </View>

        {/* Swiper Section */}
        <Swiper {...swiperConfig} className="aspect-[3/2] w-full h-auto rounded-l-[20px] bg-slate-400">
          {imageUris.map((uri) => (
            <SwiperImage key={uri} uri={uri} onDoubleTap={handleDoubleTap} />
          ))}
        </Swiper>

        {/* Like Animation */}
        <Animated.View
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
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
        <View className="relative left-[5%] bottom-0 w-[95%] min-h-12 h-auto rounded-b-[50px] bg-neutral-900">
          <View className="w-full px-8 pr-6 py-3 flex flex-row justify-between items-center">
            <View className="flex flex-row justify-between items-center gap-2">
              <FontAwesome name={isLiked ? "thumbs-up" : "thumbs-o-up"} size={16} color={isLiked ? "yellow" : "gray"} />
              <TextScallingFalse className="text-base text-white">{likeCount} {isLiked ? "Liked" : "Likes"}</TextScallingFalse>
            </View>
            <TextScallingFalse className="text-base text-white">3 Comments</TextScallingFalse>
          </View>

          <Divider style={{ marginLeft: '12%', width: '80%' }} width={0.2} color="grey" />

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