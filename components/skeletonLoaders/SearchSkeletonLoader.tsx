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

const SearchSkeletonLoader = () => {
  return (
    <View className="relative w-full max-w-xl self-center min-h-48 px-2 h-auto my-4">
      <View className="flex">
        {/* Profile Section */}
        <View className="relative ml-[5%] flex flex-row gap-2 z-20" style={{alignItems:'center'}}>
          {/* Profile Picture */}
          <View className="w-12 h-12 ml-[-8px] aspect-square rounded-full overflow-hidden">
            <ShimmerEffect width="100%" height="100%" borderRadius={100} />
          </View>
          {/* Name, Headline, post date */}
          <View className="w-64 flex flex-col gap-[6px]">
            {/* Name */}
            <ShimmerEffect width={140} height={14} />

            {/* Username | Headline */}
            <View>
              <ShimmerEffect width={180} height={12} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SearchSkeletonLoader;
