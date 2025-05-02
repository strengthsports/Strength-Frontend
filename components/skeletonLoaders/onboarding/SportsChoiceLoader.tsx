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
        backgroundColor: "#121212",
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

const SportsChoiceLoader = () => {
  return (
    <View className="relative w-full max-w-xl self-center h-auto" 
    style={{width: 114, height: 104, borderRadius: 10, borderWidth: 2, borderColor:'#151515', justifyContent:'center'}}>
      <View className="flex">
        {/* Sports Section */}
        <View className="relative gap-4 z-20"style={{alignItems:'center'}}>
          {/* Sports icon */}
          <View className="w-[34px] h-[34px] aspect-square rounded-md overflow-hidden">
            <ShimmerEffect width="100%" height="100%" borderRadius={10} />
          </View>
          {/* Sports name */}
            <ShimmerEffect width={60} height={8} />
        </View>
      </View>
    </View>
  );
};

export default SportsChoiceLoader;
