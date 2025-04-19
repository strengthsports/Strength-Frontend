import React from "react";
import { View, Dimensions } from "react-native";
import { MotiView } from "moti";

const { width } = Dimensions.get("window");

interface ShimmerEffectProps {
  width: string | number;
  height: string | number;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderBottomLeftRadius?: number;
}

const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  width,
  height,
  borderRadius = 10,
  borderTopLeftRadius,
  borderBottomLeftRadius,
}) => {
  return (
    <MotiView
      from={{ backgroundColor: "#151515" }}
      animate={{ backgroundColor: "#191919" }}
      transition={{ type: "timing", duration: 1000, loop: true }}
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
        animate={{ translateX: width as number * 1.5 }}
        transition={{ type: "timing", duration: 1000, loop: true }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: (width as number) * 0.8,
          backgroundColor: "#191919",
          transform: [{ skewX: "-20deg" }],
        }}
      />
    </MotiView>
  );
};

const SkeletonBlock = ({ showButton = false }: { showButton?: boolean }) => (
  <View className="flex" style={{ paddingTop: 8 }}>
    {/* Profile Section */}
    <View className="relative ml-[4%] flex flex-row gap-2 z-20 pb-0">
      <View className="flex flex-row mt-2 gap-5 justify-between">
        <ShimmerEffect width={15} height={17} borderRadius={5} />
        <View style={{ gap: 15 }}>
          <ShimmerEffect width={110} height={13} />
          <ShimmerEffect width={110} height={7} />
        </View>
      </View>
    </View>
    {/* Interaction Bar */}
    <View style={{ width: '100%', alignItems: 'flex-end', paddingTop: 16, paddingRight: 20 }}>
      <View className="bg-[#101010] bottom-1 z-[-10] pt-1 w-[88%] rounded-br-[35px] rounded-bl-[40px]" />
    </View>
    {showButton && (
      <>
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
          <ShimmerEffect width={'81%'} height={48} borderRadius={30} />
        </View>
        <View style={{ paddingVertical: 10 }} />
      </>
    )}
  </View>
);

const HastagSkeletonLoader = () => {
  return (
    <View className="relative w-full max-w-xl self-center min-h-48 h-auto">
      <SkeletonBlock />
      <SkeletonBlock />
      <SkeletonBlock showButton />
    </View>
  );
};

export default HastagSkeletonLoader;
