import React, {
  useState,
  useEffect,
  memo,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
  FlatList,
  ViewToken,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  onDoubleTap?: () => any;
}

const RemoveButton = memo(({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.removeButton}>
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
    postId,
    onDoubleTap,
    containerWidth,
    containerHeight,
  }: {
    uri: string;
    index: number;
    onRemove: (index: number) => void;
    isFirstSlide: boolean;
    isFeedPage?: boolean;
    postId?: string;
    onDoubleTap?: () => any;
    containerWidth: number;
    containerHeight: number;
  }) => {
    const router = useRouter();
    const [isError, setIsError] = useState(false);

    const slideStyle = useMemo(
      () => [styles.slide, { width: containerWidth, height: containerHeight }],
      [containerWidth, containerHeight, isFirstSlide]
    );

    const imageStyle = useMemo(
      () => [
        styles.image,
        {
          borderTopLeftRadius: isFirstSlide ? 16 : 0,
          borderBottomLeftRadius: isFirstSlide ? 16 : 0,
          borderTopWidth: isFirstSlide ? 0.5 : 0.4,
          borderBottomWidth: isFirstSlide ? 0.5 : 0.4,
          borderLeftWidth: isFirstSlide ? 0.5 : 0,
          borderColor: "#2F2F2F",
        },
      ],
      [isFirstSlide]
    );

    return (
      <View style={slideStyle}>
        <TouchableWithDoublePress
          style={styles.touchableInner}
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
            source={{ uri }}
            contentFit="cover"
            style={imageStyle}
            placeholder={require("../../assets/images/nocover.png")}
            placeholderContentFit="cover"
            transition={300}
            cachePolicy="memory-disk"
            onError={(e) => {
              setIsError(true);
              console.error("Image Load Error:", uri, e?.error);
            }}
          />
          {isError && (
            <Image
              source={require("../../assets/images/nocover.png")}
              style={styles.imageErrorPlaceholder}
              contentFit="cover"
            />
          )}
          {!isFeedPage && <RemoveButton onPress={() => onRemove(index)} />}
        </TouchableWithDoublePress>
      </View>
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
  setIndex: setParentIndex,
  onDoubleTap,
}: CustomImageSliderProps) => {
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(
    Dimensions.get("window").width
  );
  const prevImagesLengthRef = useRef(images.length); //ref to track previous length

  const containerHeight = useMemo(
    () => containerWidth * (aspectRatio[1] / aspectRatio[0]),
    [containerWidth, aspectRatio]
  );

  useEffect(() => {
    const updateLayout = ({ window }: { window: { width: number } }) => {
      setContainerWidth(window.width);
    };
    const subscription = Dimensions.addEventListener("change", updateLayout);
    return () => subscription?.remove();
  }, []);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 70 }).current;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const newIndex = viewableItems[0].index;
        if (newIndex !== null && newIndex !== activeIndex) {
          //update state only if the viewable index changes and is valid
          setActiveIndex(newIndex);
          setParentIndex(newIndex);
        }
      }
    },
    [activeIndex, setParentIndex]
  );

  //effect for Image Addition
  useEffect(() => {
    const currentLength = images.length;
    const previousLength = prevImagesLengthRef.current;

    // Check if the number of images has increased
    if (currentLength > previousLength) {
      const newIndex = currentLength - 1;

      // Update state to the new index
      setActiveIndex(newIndex);
      setParentIndex(newIndex);

      // Scroll FlatList to the new index after a short delay
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          animated: true,
          index: newIndex,
        });
      }, 100); // Delay allows FlatList to render the new item
    }

    // Update the ref to store the current length for the next comparison
    prevImagesLengthRef.current = currentLength;
  }, [images, setParentIndex]);

  useEffect(() => {
    const maxIndex = images.length - 1;
    if (images.length > 0 && activeIndex > maxIndex) {
      const newCorrectIndex = maxIndex;
      setActiveIndex(newCorrectIndex);
      setParentIndex(newCorrectIndex);
    } else if (images.length === 0 && activeIndex !== 0) {
      setActiveIndex(0);
      setParentIndex(0);
    }
  }, [images.length, activeIndex, setParentIndex]);

  const handleRemoveImage = useCallback(
    (indexToRemove: number) => {
      onRemoveImage(indexToRemove);
    },
    [onRemoveImage]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <ImageSlide
        uri={item}
        index={index}
        onRemove={handleRemoveImage}
        isFirstSlide={index === 0}
        isFeedPage={isFeedPage}
        postId={postId}
        onDoubleTap={onDoubleTap}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
      />
    ),
    [
      handleRemoveImage,
      isFeedPage,
      postId,
      onDoubleTap,
      containerWidth,
      containerHeight,
    ]
  );

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => item || `slide-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        style={[styles.flatListContainer, { height: containerHeight }]}
        contentContainerStyle={styles.flatListContentContainer}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        getItemLayout={(_, index) => ({
          length: containerWidth,
          offset: containerWidth * index,
          index,
        })}
      />

      {images.length > 1 && (
        <View style={styles.paginationContainer}>
          <AnimatedDotsCarousel
            length={images.length}
            currentIndex={activeIndex}
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
                config: {
                  color: "#FFFFFF",
                  margin: 3,
                  opacity: 0.5,
                  size: 5,
                },
                quantity: 1,
              },
              {
                config: {
                  color: "#FFFFFF",
                  margin: 3,
                  opacity: 0.5,
                  size: 4,
                },
                quantity: 1,
              },
              {
                config: {
                  color: "#FFFFFF",
                  margin: 3,
                  opacity: 0.5,
                  size: 3,
                },
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
  wrapper: {},
  flatListContainer: {
    overflow: "visible",
    backgroundColor: "#111",
  },
  flatListContentContainer: {},
  slide: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  touchableInner: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  imageErrorPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 9999,
    padding: 4,
    zIndex: 10,
  },
  paginationContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
});

export default memo(CustomImageSlider);
