import {
  View,
  TouchableOpacity,
  Text,
  Image,
  LayoutChangeEvent,
  ImageStyle,
  Dimensions,
} from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Swiper from "react-native-swiper";
import { Divider } from "react-native-elements";
import { useCallback, useState, memo, useMemo } from "react";
import { Post } from "~/types/post";
import { formatTimeAgo } from "~/utils/formatTime";
import { responsiveFontSize } from "react-native-responsive-dimensions";

// Type definitions for components
interface ActionButtonProps {
  iconName: keyof typeof FontAwesome.glyphMap; // Correct type for icon names
  text: string;
}

interface SwiperImageProps {
  uri: string;
}

// Memoized components with proper typing
const ActionButton = memo<ActionButtonProps>(({ iconName, text }) => (
  <View className="flex flex-row justify-between items-center gap-2 bg-black px-4 py-2 rounded-3xl">
    <FontAwesome name={iconName} size={16} color="gray" />
  </View>
));

const SwiperImage = memo<SwiperImageProps>(({ uri }) => (
    <Image
      className="w-full h-full"
      source={{ uri }}
      resizeMode="cover" // Try both cover/contain
      onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
    />
));

export default function PostContainerSmall({ post }: { post: Post }) {

  const imageUrls = post.assets.filter(asset => asset.url).map(asset => asset.url);
  // console.log(imageUrls);

  const { width: screenWidth2 } = Dimensions.get('window');
  const scaleFactor = screenWidth2 / 410;

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
      // marginHorizontal: 20,
      zIndex: 30
    }
  }), []);
  // console.log(parentWidth)

  return (
    <View className="relative w-full max-w-xl self-center min-h-48 h-auto my-8"
    >
      <View className="flex">
        {/* Profile Section */}
        <View className={`ml-[5%] flex flex-row gap-2 z-20 pb-0' `}>
          <Image
            className="w-[16%] h-[16%] min-w-[54] max-w-[64px] mt-[2px] aspect-square rounded-full bg-slate-400"
            source={{ uri: post.postedBy?.profilePic }}
            style={{
              elevation: 8, // Shadow for Android
              shadowColor: 'black', // Shadow color for iOS
              shadowOffset: { width: 0, height: 4 }, // Offset for iOS
              shadowOpacity: 0.8, // Opacity for iOS
              shadowRadius: 4, // Blur radius for iOS
            } as ImageStyle}
          />

          <View className="flex flex-col justify-between ">
            <View>
              <TextScallingFalse className="text-white text-xl font-bold">{post.postedBy?.firstName} {post.postedBy?.lastName}</TextScallingFalse>
              <TextScallingFalse numberOfLines={1} style={{color:'white', fontSize: responsiveFontSize(1.19), fontWeight:'200'}}>{post.postedBy?.headline}</TextScallingFalse>
            </View>
            <View className="flex flex-row  items-center">
              <TextScallingFalse className="text-base text-neutral-400">{formatTimeAgo(post.createdAt)} &bull;{" "}</TextScallingFalse>
              <MaterialIcons name="public" size={12} color="gray" />
            </View>
          </View>

        </View>


        {/* Grey Top Caption Div */}
        <View className={`relative left-[5%] bottom-0 w-[95%] min-h-16 h-auto mt-[-22] rounded-tl-[50px] rounded-tr-[16px]  pb-3 bg-neutral-900`}>
          <MaterialIcons className="absolute right-6 top-2" name="more-horiz" size={18} color="white" />
          <TextScallingFalse className=" pl-10 pr-6 pt-10 pb-3 text-sm text-white ">
            {post?.caption}
          </TextScallingFalse>
        </View>

        {/* Swiper Section */}
        <View style={{height: 210 * scaleFactor}}>
          <Swiper {...swiperConfig} 
            style={{
              width: "100%",
              height: 300,
            }}
          >
            {imageUrls.map((url) => (
              <SwiperImage key={url} uri={url} />
            ))}
          </Swiper>
        </View>

        {/* Bottom Grey Div */}
        <View className={`relative left-[5%] bottom-1 z-[-10] pt-1 w-[95%] min-h-12 h-auto rounded-b-[50px]  bg-neutral-900`}>
          <View className="w-full px-8 pr-6 py-3 flex flex-row justify-between items-center">
            <View className="flex flex-row justify-between items-center gap-2">
            <FontAwesome name="thumbs-up" size={16} color="yellow" />
            <TextScallingFalse className="text-base text-white ">{post.likesCount} Likes</TextScallingFalse>
            </View>
            <TextScallingFalse className="text-base text-white ">{post.commentsCount} Comments</TextScallingFalse>
          </View>

          <Divider style={{ marginLeft: '12%', width: '80%' }} width={0.2} color="grey" />

          <View
            className="w-full px-6 py-5 mb-1 mr flex flex-row justify-evenly items-center"
          >
            <ActionButton iconName="thumbs-o-up" text="Like" />
            <ActionButton iconName="comment" text="Comment" />
            <ActionButton iconName="paper-plane" text="Share" />
          </View>
        </View>

      </View>
    </View>
  );
}