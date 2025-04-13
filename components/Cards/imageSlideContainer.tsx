import React, {
  useState,
  useEffect,
  memo,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { View, TouchableOpacity, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { swiperConfig } from "~/utils/swiperConfig";
import { RelativePathString, useRouter } from "expo-router";
import TouchableWithDoublePress from "../ui/TouchableWithDoublePress";
import { Image } from "expo-image";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
interface CustomImageSliderProps {
  images: string[];
  aspectRatio: [number, number];
  onRemoveImage: (index: number) => void;
  isFeedPage?: boolean;
  isMyActivity?: boolean;
  postId?: string;
  setIndex: (index: any) => any;
  onDoubleTap?: () => any;
}

const RemoveButton = memo(({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    className="absolute top-2 right-2 bg-black/50 rounded-full p-1 z-10"
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
          isFeedPage &&
            router.push({
              pathname: `/post-view/${postId}` as RelativePathString,
            });
        }}
        onDoublePress={onDoubleTap}
      >
        <Image
          source={{ uri }}
          contentFit="cover"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
            borderTopLeftRadius: isFirstSlide ? 16 : 0,
            borderBottomLeftRadius: isFirstSlide ? 16 : 0,
            borderTopWidth: isFirstSlide ? 0.5 : 0.4,
            borderBottomWidth: isFirstSlide ? 0.5 : 0.4,
            borderLeftWidth: isFirstSlide ? 0.5 : 0,
            borderColor: "#2F2F2F",
          }}
          placeholder={require("../../assets/images/nocover.png")}
          // placeholder={{ blurhash }}
          placeholderContentFit="cover"
          transition={500}
          cachePolicy="memory-disk"
          onError={(e) => {
            setIsError(true);
            console.log(e);
          }}
        />
        {!isFeedPage && <RemoveButton onPress={() => onRemove(index)} />}
      </TouchableWithDoublePress>
    );
  }
);

const CustomImageSlider = ({
  images,
  aspectRatio,
  onRemoveImage,
  isFeedPage,
  postId,
  setIndex,
  onDoubleTap,
}: // renderPagination
CustomImageSliderProps) => {
  const swiperRef = useRef(null);
  const prevImagesLengthRef = useRef(images.length);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(
    Dimensions.get("window").width
  );

  // Memoized container height calculation
  const containerHeight = useMemo(
    () => containerWidth * (aspectRatio[1] / aspectRatio[0]),
    [containerWidth, aspectRatio]
  );

  // Auto-scroll to the last image when a new image is added
  useEffect(() => {
    if (images.length > prevImagesLengthRef.current && swiperRef.current) {
      const newIndex = images.length - 1;
      setActiveIndex(newIndex);
      console.log("New Index : ", newIndex);
      // Using setTimeout to ensure the Swiper has updated its internal state
      setTimeout(() => {
        if (swiperRef.current && swiperRef.current.scrollBy) {
          swiperRef.current.scrollBy(newIndex - activeIndex, true);
        }
      }, 50);
    }
    prevImagesLengthRef.current = images.length;
  }, [images.length]);

  // Optimized dimension update handler
  useEffect(() => {
    const updateLayout = () => {
      setContainerWidth(Dimensions.get("window").width);
    };

    const dimensionsHandler = Dimensions.addEventListener(
      "change",
      updateLayout
    );
    return () => {
      dimensionsHandler.remove();
    };
  }, []);

  // Handle index change
  const handleIndexChange = useCallback((index: number) => {
    setActiveIndex(index);
    setIndex(index);
    console.log("Index", index);
  }, []);

  // Handle image removal
  const handleRemoveImage = useCallback(
    (index: number) => {
      onRemoveImage(index);
      // If removing current image and it's the last one, adjust index
      if (activeIndex === images.length - 1 && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
    },
    [activeIndex, images.length, onRemoveImage]
  );

  // If no images, show nothing
  if (images.length === 0) {
    return null;
  }

  // // Custom pagination component for Swiper
  // const renderPagination = (index: any, total: number) => {
  //   if (total <= 1) return null;

  //   return (
  //     <View className="absolute bottom-3 left-0 right-0 flex-row justify-center">
  //       {Array.from({ length: total }).map((_, i) => (
  //         <View
  //           key={`dot-${i}`}
  //           className={
  //             i === index
  //               ? "w-1.5 h-1.5 rounded-full bg-white mx-0.5"
  //               : "w-1.5 h-1.5 rounded-full bg-white/50 mx-0.5"
  //           }
  //         />
  //       ))}
  //     </View>
  //   );
  // };

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
          index={activeIndex}
          removeClippedSubviews={false}
          loop={false}
          showsPagination={images.length > 1}
          // renderPagination={renderPagination}
        >
          {images.map((uri, index) => (
            <ImageSlide
              key={`slide-${index}-${uri.slice(-8)}`}
              uri={uri}
              index={index}
              onRemove={handleRemoveImage}
              isFirstSlide={index === 0}
              totalSlides={images.length}
              isFeedPage={isFeedPage}
              postId={postId}
              onDoubleTap={onDoubleTap}
            />
          ))}
        </Swiper>
      </View>
    </View>
  );
};

export default memo(CustomImageSlider);
