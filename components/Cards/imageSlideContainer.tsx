import React, {
  useState,
  useEffect,
  memo,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { View, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { swiperConfig } from "~/utils/swiperConfig";
import { RelativePathString, useRouter } from "expo-router";
import TouchableWithDoublePress from "../ui/TouchableWithDoublePress";
import { Image } from "expo-image";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";

// const borderLeftWidth = Platform.select({
//   ios: {
//     borderLeftWidth: 3
//   },
//   android: {
//     borderLeftWidth: 0.5
//   },
// });

// const borderTopwidth =

// const borderBottomWidth =

interface CustomImageSliderProps {
  images: string[];
  aspectRatio: [number, number];
  onRemoveImage: (index: number) => void;
  isFeedPage?: boolean;
  isMyActivity?: boolean;
  postId?: string;
  setIndex: (index: number) => void;
  onDoubleTap?: () => void;
}

const RemoveButton = memo(({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    className="absolute top-2 right-2 bg-black/50 rounded-full p-1 z-10"
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <MaterialCommunityIcons name="close" size={20} color="white" />
  </TouchableOpacity>
));

const ImageSlide = memo(
  ({
    uri,
    index,
    onRemove,
    isFirstSlide,
    isFeedPage,
    isMyActivity,
    postId,
    onDoubleTap,
  }: {
    uri: string;
    index: number;
    onRemove: (index: number) => void;
    isFirstSlide: boolean;
    totalSlides: number;
    isFeedPage?: boolean;
    isMyActivity?: boolean;
    postId?: string;
    onDoubleTap?: () => any;
  }) => {
    const router = useRouter();
    const [isError, setIsError] = useState(false);

    return (
      <TouchableWithDoublePress
        className={`flex-1 relative overflow-hidden ${
          !isMyActivity && isFirstSlide ? "ml-2" : ""
        }`}
        activeOpacity={0.95}
        onSinglePress={() => {
          if (isFeedPage && postId) {
            router.push({
              pathname: `/post-view/${postId}` as RelativePathString,
            });
          }
        }}
        onDoublePress={onDoubleTap}
      >
        <Image
          source={
            isError ? require("../../assets/images/nocover.png") : { uri }
          }
          contentFit="cover"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
            borderTopLeftRadius: !isMyActivity && isFirstSlide ? 16 : 0,
            borderBottomLeftRadius: !isMyActivity && isFirstSlide ? 16 : 0,
            borderTopWidth: !isMyActivity && isFirstSlide ? 0.5 : 0.4,
            borderBottomWidth: !isMyActivity && isFirstSlide ? 0.5 : 0.4,
            borderLeftWidth: !isMyActivity && isFirstSlide ? 0.5 : 0,
            borderColor: "#2F2F2F",
          }}
          placeholder={require("../../assets/images/nocover.png")}
          placeholderContentFit="cover"
          transition={500}
          cachePolicy="memory-disk"
          onError={(e) => {
            setIsError(true);
            console.log(`Error loading image ${index}: `, e?.error);
          }}
        />
        {!isFeedPage && !isMyActivity && (
          <RemoveButton onPress={() => onRemove(index)} />
        )}
      </TouchableWithDoublePress>
    );
  }
);

const CustomImageSlider = ({
  images,
  aspectRatio,
  onRemoveImage,
  isFeedPage,
  isMyActivity,
  postId,
  setIndex,
  onDoubleTap,
}: CustomImageSliderProps) => {
  const swiperRef = useRef<Swiper>(null);
  const prevImagesLengthRef = useRef(images.length);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(
    Dimensions.get("window").width
  );

  const containerHeight = useMemo(
    () => containerWidth * (aspectRatio[1] / aspectRatio[0]),
    [containerWidth, aspectRatio]
  );

  useEffect(() => {
    if (images.length > prevImagesLengthRef.current) {
      const newIndex = images.length - 1;
      const timer = setTimeout(() => {
        if (
          swiperRef.current &&
          typeof swiperRef.current.scrollTo === "function"
        ) {
          // console.log(`Scrolling to new index: ${newIndex}`);
          swiperRef.current.scrollTo(newIndex, false);
        }
      }, 50);

      prevImagesLengthRef.current = images.length;
      return () => clearTimeout(timer);
    } else {
      prevImagesLengthRef.current = images.length;
    }
  }, [images.length]);

  useEffect(() => {
    const updateLayout = () => {
      setContainerWidth(Dimensions.get("window").width);
    };
    const dimensionsHandler = Dimensions.addEventListener(
      "change",
      updateLayout
    );
    updateLayout();
    return () => {
      dimensionsHandler?.remove();
    };
  }, []);

  const handleIndexChange = useCallback(
    (index: number) => {
      // console.log(`Swiper onIndexChanged fired with: ${index}`);
      setActiveIndex((currentIndex) => {
        if (currentIndex !== index) {
          if (typeof setIndex === "function") {
            setIndex(index);
          }
          return index;
        }
        return currentIndex;
      });
    },
    [setIndex]
  );

  const handleRemoveImage = useCallback(
    (indexToRemove: number) => {
      const currentLength = images.length;
      const currentActiveIndex = activeIndex;

      onRemoveImage(indexToRemove);

      const newLength = currentLength - 1;

      if (newLength > 0 && currentActiveIndex >= newLength) {
        const newIndex = newLength - 1;
        // console.log(`Post-removal: Index ${currentActiveIndex} invalid (>= ${newLength}). Setting to ${newIndex}`);
        setActiveIndex(newIndex);
        if (typeof setIndex === "function") {
          setIndex(newIndex);
        }
      } else if (newLength <= 0) {
        //  console.log("Post-removal: List empty. Setting index to 0");
        setActiveIndex(0);
        if (typeof setIndex === "function") {
          setIndex(0);
        }
      }

      // Update the ref immediately after triggering removal
      prevImagesLengthRef.current = newLength;
    },
    [activeIndex, images.length, onRemoveImage, setIndex]
  );

  if (!images || images.length === 0) {
    return null;
  }
  const safeActiveIndex = Math.min(Math.max(0, activeIndex), images.length - 1);

  return (
    <View>
      <View
        style={{
          height: containerHeight,
          width: containerWidth,
        }}
        className="overflow-hidden bg-transparent"
      >
        <Swiper
          {...swiperConfig}
          ref={swiperRef}
          onIndexChanged={handleIndexChange}
          index={safeActiveIndex}
          key={images.length}
          removeClippedSubviews={false}
          loop={false}
          showsPagination={false}
        >
          {images.map((uri, index) => (
            <ImageSlide
              key={uri || `slide-${index}`}
              uri={uri}
              index={index}
              onRemove={handleRemoveImage}
              isFirstSlide={index === 0}
              totalSlides={images.length}
              isFeedPage={isFeedPage}
              isMyActivity={isMyActivity}
              postId={postId}
              onDoubleTap={onDoubleTap}
            />
          ))}
        </Swiper>
      </View>

      {images.length > 1 && !isFeedPage && !isMyActivity && (
        <View style={styles.paginationContainer}>
          <AnimatedDotsCarousel
            length={images.length}
            currentIndex={safeActiveIndex}
            maxIndicators={2}
            interpolateOpacityAndColor={true}
            activeIndicatorConfig={{
              color: "#FFFFFF",
              margin: 3,
              opacity: 1,
              size: 6,
            }}
            inactiveIndicatorConfig={{
              color: "#FFFFFF",
              margin: 3,
              opacity: 0.5,
              size: 6,
            }}
            decreasingDots={[
              {
                config: { color: "#FFFFFF", margin: 3, opacity: 0.5, size: 5 },
                quantity: 1,
              },
              {
                config: { color: "#FFFFFF", margin: 3, opacity: 0.5, size: 4 },
                quantity: 1,
              },
              {
                config: { color: "#FFFFFF", margin: 3, opacity: 0.5, size: 3 },
                quantity: 1,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginTop: 4,
  },
});

export default memo(CustomImageSlider);
