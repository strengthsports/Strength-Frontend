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
        backgroundColor: "#232323",
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

const UserCardSkeleton = ({ size }: { size: string; }) => {
  return (
    <View className={`bg-black rounded-xl relative border ${size === "small" ? "w-[150px] h-[180px]" : "w-[45%] h-[200px]"
      } border-[#191919] overflow-hidden border-[3px]`}>
      <View style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
        {/* Sports Section */}
        <View className="relative gap-4 z-20" style={{width:'75%'}}>
          {/* Sports icon */}
          <View style={{width:'100%', alignItems:'center'}}>
          <View className="w-[72px] h-[72px] aspect-square rounded-md overflow-hidden">
            <ShimmerEffect width="100%" height="100%" borderRadius={100} />
          </View>
          </View>
          {/* Sports name */}
          <View style={{justifyContent:'center', alignItems:'center', gap: 5}}>
          <ShimmerEffect width={'70%'} height={12} />
          <ShimmerEffect width={'100%'} height={7} />
          <ShimmerEffect width={'100%'} height={7} />
          </View>
          <View style={{justifyContent:'center', alignItems:'center'}}>
          <ShimmerEffect width={'80%'} height={30} borderRadius={10} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserCardSkeleton;
