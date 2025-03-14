import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TextScallingFalse from '~/components/CentralText';
// Import the base config but we'll override some properties
import { swiperConfig as baseSwiperConfig } from '~/utils/swiperConfig';

interface CustomImageSliderProps {
  images: string[];
  aspectRatio: [number, number];
  onRemoveImage: (index: number) => void;
  onAddImage: () => void;
  maxImages?: number;
}

const RemoveButton = memo(({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    className="absolute top-2 right-2 bg-black/50 rounded-full p-1 z-10"
  >
    <MaterialCommunityIcons
      name="close"
      size={20}
      color="white"
    />
  </TouchableOpacity>
));

const ImageCounter = memo(({ current, total }: { current: number; total: number }) => (
  <View className="absolute bottom-2 right-2 bg-black/50 rounded-full px-3 py-1">
    <TextScallingFalse className="text-white text-sm">
      {current}/{total}
    </TextScallingFalse>
  </View>
));

const AddMoreButton = memo(({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity 
    className="flex-row items-center bg-neutral-800/50 rounded-full px-3 py-1 absolute bottom-2 left-2"
    onPress={onPress}
  >
    <MaterialCommunityIcons 
      name="plus" 
      size={18} 
      color="white" 
    />
    <TextScallingFalse className="text-white ml-1 text-base">
      Add more
    </TextScallingFalse>
  </TouchableOpacity>
));

const ImageSlide = memo(({ uri, index, onRemove }: { uri: string, index: number, onRemove: (index: number) => void }) => (
  <View className="flex-1 relative">
    <Image
      source={{ uri }}
      className="w-full h-full"
      resizeMode="cover"
    />
    <RemoveButton onPress={() => onRemove(index)} />
  </View>
));

const CustomImageSlider = ({
  images,
  aspectRatio,
  onRemoveImage,
  onAddImage,
  maxImages = 10
}: CustomImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width - 48);

  // Memoized container height calculation
  const containerHeight = useMemo(() => 
    containerWidth * (aspectRatio[1] / aspectRatio[0]), 
    [containerWidth, aspectRatio]
  );

  // Optimized dimension update handler
  useEffect(() => {
    const updateLayout = () => {
      setContainerWidth(Dimensions.get('window').width - 48);
    };

    const dimensionsHandler = Dimensions.addEventListener('change', updateLayout);
    return () => {
      dimensionsHandler.remove();
    };
  }, []);

  // Memoized index change handler - Fixed to properly update the index
  const handleIndexChange = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);
  
  // Create a modified version of the swiperConfig that works with our custom counter
  const customSwiperConfig = useMemo(() => ({
    ...baseSwiperConfig,
    showsPagination: false, // Disable built-in pagination as we're using our own counter
  }), []);

  // Memoized onRemoveImage wrapper
  const handleRemoveImage = useCallback((index: number) => {
    onRemoveImage(index);
    // If removing current image and it's the last one, adjust index
    if (currentIndex === images.length - 1 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, images.length, onRemoveImage]);

  // If no images, show nothing
  if (images.length === 0) {
    return null;
  }

  return (
    <View className="my-3">
      <View
        className="w-full rounded-2xl overflow-hidden bg-slate-400"
        style={{ height: containerHeight }}
      >
        <Swiper
          {...customSwiperConfig}
          onIndexChanged={handleIndexChange}
          index={currentIndex}
          removeClippedSubviews={true}
        >
          {images.map((uri, index) => (
            <ImageSlide 
              key={uri + index} 
              uri={uri} 
              index={index} 
              onRemove={handleRemoveImage} 
            />
          ))}
        </Swiper>
      </View>
      
      {/* Image counter positioned correctly */}
      <View className="absolute bottom-2 right-2 bg-black/50 rounded-full px-3 py-1 z-20">
        <TextScallingFalse className="text-white text-sm">
          {currentIndex + 1}/{images.length}
        </TextScallingFalse>
      </View>
      
      {images.length < maxImages && (
        <AddMoreButton onPress={onAddImage} />
      )}
    </View>
  );
};

export default memo(CustomImageSlider);