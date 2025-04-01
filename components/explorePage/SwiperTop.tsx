import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import Swiper from "react-native-swiper";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "~/constants/Colors"; // Ensure this path is correct
import TextScallingFalse from "@/components/CentralText"; // Ensure this path is correct
import {
  ExploreImageBanner,
  hashtagData,
  fetchSwipper,
} from "~/constants/hardCodedFiles";
import { useGetTrendingSwipperSlidesQuery } from "~/reduxStore/api/explore/swipper/trendingSlide.Api";

interface SwipperSlide {
  _id: string;
  imageUrl: string;
  title: string;
  sportsName: string;
  type: string;
  createdAt: string;
  date?: string; // Add date & time fields
  time?: string;
}

// Function to format date & time
const formatDateTime = (isoString: string) => {
  const dateObj = new Date(isoString);
  const formattedDate = dateObj
    .toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
    .replace(",", ""); // Remove extra comma

  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return { date: formattedDate, time: formattedTime };
};

const SwiperTop = () => {
  const [swipperData, setSwipperData] = useState<SwipperSlide[]>([]);
  // const {
  //   data: swipperSlides,
  //   isLoading,
  //   error,
  // } = useGetTrendingSwipperSlidesQuery();

  useEffect(() => {
    if (swipperData.length === 0) {
      fetchSwipper().then((slides) => {
        const formattedData = slides.map((item: SwipperSlide) => ({
          ...item,
          ...formatDateTime(item.createdAt), // Add formatted date & time
        }));
        setSwipperData(formattedData);
      });
    }
  }, []);

  return (
    <Swiper
      autoplay={true}
      loop={true} // Ensure continuous sliding
      autoplayTimeout={3}
      showsPagination={true}
      key={swipperData.length} // Ensures re-render on data change
      paginationStyle={{ bottom: 8, gap: 4 }}
      dotStyle={{
        backgroundColor: Colors.greyText,
        width: 6,
        height: 6,
        marginHorizontal: 20,
      }}
      activeDotStyle={{
        backgroundColor: "white",
        width: 7,
        height: 7,
        marginHorizontal: 20,
      }}
      style={{ height: 250, marginTop: 0.5 }}
    >
      {swipperData.length > 0 ? (
        swipperData.map((slide, index) => (
          <View key={slide._id} className="flex-1">
            <Image
              source={{ uri: slide.imageUrl }}
              className="w-full h-72"
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
              className="absolute bottom-0 left-0 right-0 h-40"
            />
            <View className="absolute bottom-9 pl-5">
              <TextScallingFalse className="text-white text-6xl font-bold">
                {slide.title}
              </TextScallingFalse>
              <View className="flex-row items-center">
                <TextScallingFalse className="text-[#12956B] text-xl font-bold text-start">
                  {slide.sportsName}
                </TextScallingFalse>
                <TextScallingFalse className="text-white text-xl">
                  {" "}
                  • {slide.date}
                </TextScallingFalse>
                <TextScallingFalse className="text-white text-xl">
                  {" "}
                  • {slide.time}
                </TextScallingFalse>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View className="h-full flex justify-center self-center items-center">
          <ActivityIndicator size="large" color={Colors.themeColor} />
        </View>
      )}
    </Swiper>
  );
};

export default SwiperTop;
