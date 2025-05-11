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
  borderRadius = 0,
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

const SwipperSkeletonLoader = () => {
  return (
    <View className="relative w-full max-w-xl self-center min-h-48 h-auto">
      <View className="flex">
        {/* Image Swiper */}
        <View>
          <ShimmerEffect
            width={postWidth}
            height={220}
          />
        </View>
      </View>
    </View>
  );
};

export default SwipperSkeletonLoader;
