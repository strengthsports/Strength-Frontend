import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
} from "react-native";
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface ZoomableImageProps {
  source: ImageSourcePropType;
  style?: any;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ source, style }) => {
  // Shared values for scale and focal point
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const lastScale = useSharedValue(1);

  // Set up the pinch gesture handler
  const pinchHandler = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    { startScale: number }
  >({
    onStart: (_, ctx) => {
      ctx.startScale = scale.value;
    },
    onActive: (event, ctx) => {
      // Calculate new scale based on pinch gesture
      scale.value = Math.max(ctx.startScale * event.scale, 1);

      // Update focal point
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    },
    onEnd: () => {
      // Save the last scale value
      lastScale.value = scale.value;

      // Optional: you can implement a "snap back" effect if the scale is below a threshold
      if (scale.value < 1.2) {
        scale.value = withTiming(1);
      }
    },
  });

  // Animated styles for the image
  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={[styles.container, style]}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <Animated.View style={styles.imageContainer}>
          <Animated.Image
            source={source}
            style={[styles.image, animatedImageStyle]}
            resizeMode="cover"
          />
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ZoomableImage;
