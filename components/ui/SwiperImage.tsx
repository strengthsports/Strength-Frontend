import { View, Text } from "react-native";
import React, { memo, useRef } from "react";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { useRouter } from "expo-router";

export interface SwiperImageProps {
  uri?: string;
  details?: any;
  onDoubleTap?: () => void;
  className?: string;
}

const SwiperImage = memo<SwiperImageProps>(
  ({ uri, details, onDoubleTap, className }) => {
    const router = useRouter();
    let lastTap = useRef(0).current;
    // console.log("Details : ", details);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/(app)/(modal)/post/1",
            params: { image: uri, details: JSON.stringify(details) },
          })
        }
      >
        <Image
          className={`w-full h-full object-cover ${className}`}
          source={{ uri }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  }
);

export default SwiperImage;
