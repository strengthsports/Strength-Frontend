import React from "react";
import { View, Dimensions } from "react-native";
import { MotiView } from "moti";
import Animated from "react-native-reanimated";

const { width } = Dimensions.get("window");
const postWidth = width * 1; // 90% of screen width

interface ShimmerEffectProps {
  width: string | number; // Be specific about the expected type (string for percentages, number for pixels)
  height: string | number;
  borderRadius?: number; // Optional number for uniform border radius
  borderTopLeftRadius?: number;
  borderBottomLeftRadius?: number;
}

// Shimmer effect component
const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  width,
  height,
  borderRadius = 10,
  borderTopLeftRadius,
  borderBottomLeftRadius,
}) => {
  return (
    <MotiView
      from={{
        backgroundColor: "#151515",
      }}
      animate={{
        backgroundColor: "#191919",
      }}
      transition={{
        type: "timing",
        duration: 1000,
        loop: true,
      }}
      style={{
        width,
        height,
        borderRadius,
        borderTopLeftRadius,
        borderBottomLeftRadius,
        overflow: "hidden",
      }}
    >
      <MotiView
        from={{ translateX: -width }}
        animate={{ translateX: width * 1.5 }}
        transition={{
          type: "timing",
          duration: 1000,
          loop: true,
          repeatReverse: false,
        }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: width * 0.8,
          backgroundColor: "#191919",
          transform: [{ skewX: "-20deg" }],
        }}
      />

    </MotiView>
  );
};

const PostSkeletonLoader1 = () => {
  return (
    <View className="relative w-full max-w-xl self-center min-h-48 px-2 h-auto my-4">
      <View className="flex">
        {/* Profile Section */}
        <View className="relative ml-[5%] flex flex-row gap-2 z-20 pb-0">
          {/* Profile Picture */}
          <View className="w-[14%] h-[14%] min-w-[54px] max-w-[64px] ml-[-8px] mt-[6px] aspect-square rounded-full overflow-hidden">
            <ShimmerEffect width="100%" height="100%" borderRadius={100} />
          </View>
          <View className="absolute w-[54px] h-[54px] z-[-1] mt-[6px] ml-[1px] aspect-square rounded-full bg-black opacity-[8%] blur-3xl" />

          {/* Name, Headline, post date */}
          <View className="w-64 flex flex-col mt-2 justify-between">
            {/* Name */}
            <ShimmerEffect width={140} height={14} />

            {/* Username | Headline */}
            <View className="py-[5px] mb-1">
              <ShimmerEffect width={180} height={12} />
            </View>

            {/* Time and public icon */}
            <View className="flex flex-row items-center mt-[10px]">
              <ShimmerEffect width={110} height={10} />
            </View>
          </View>

          {/* Follow button */}
          <View className="absolute top-[9px] right-3">
            <ShimmerEffect width={70} height={28} borderRadius={20} />
          </View>
        </View>

        {/* Caption Section */}
        <View className="relative left-[4.5%] bottom-0 w-[100%] min-h-16 h-auto mt-[-22] rounded-tl-[40px] rounded-tr-[35px] pb-2 bg-[#101010]">

          <View className="pl-9 pr-8 pt-12 pb-4">
            {/* Caption text - multiple lines */}
            <ShimmerEffect width={postWidth * 0.75} height={18} />
            <View className="mt-2">
              <ShimmerEffect width={postWidth * 0.65} height={18} />
            </View>
          </View>
        </View>

        {/* Image Swiper */}
        <View>
          <ShimmerEffect
            width={postWidth}
            height={240}
            borderTopLeftRadius={18}
            borderBottomLeftRadius={18}
          />
        </View>

        {/* Interaction Bar - The critical part that was missing */}
        <View className="bg-[#101010] relative left-[4.5%] bottom-1 z-[-10] pt-1 w-[100%] rounded-br-[35px] rounded-bl-[40px]">
          {/* Top section: Likes count and Comments count */}
          <View className="w-full pl-8 pr-10 py-3 flex flex-row justify-between items-center">
            {/* Likes count with icon */}
            <View className="flex flex-row items-center gap-2">
              <ShimmerEffect width={16} height={14} borderRadius={8} />
              <ShimmerEffect width={60} height={14} />
            </View>

            {/* Image pagination dots */}
            <View className="flex-row justify-center gap-1">
              <ShimmerEffect width={6} height={6} borderRadius={3} />
              <ShimmerEffect width={6} height={6} borderRadius={3} />
              <ShimmerEffect width={6} height={6} borderRadius={3} />
            </View>

            {/* Comments count */}
            <View className="flex flex-row items-center">
              <ShimmerEffect width={82} height={14} />
            </View>
          </View>

          {/* Bottom section: Action buttons */}
          <View className="w-[80%] mx-auto py-5 mb-1 flex flex-row justify-end gap-x-4 items-center border-t-[0.5px] border-[#303030]">
            {/* Like button */}
            <View className="flex flex-row items-center gap-2">
              <ShimmerEffect width={80} height={25} borderRadius={17} />
            </View>

            {/* Comment button */}
            <View className="flex flex-row items-center gap-2">
              <ShimmerEffect width={100} height={25} borderRadius={17} />
            </View>

            {/* Share button */}
            <View className="mr-3 flex flex-row items-center gap-2">
              <ShimmerEffect width={80} height={25} borderRadius={17} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostSkeletonLoader1;
