import React, { useMemo, useState } from "react";
import { View, ActivityIndicator, Image, Pressable } from "react-native";
// import { Image } from "expo-image";
import Swiper from "react-native-swiper";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "~/constants/Colors"; // Ensure this path is correct
import TextScallingFalse from "@/components/CentralText"; // Ensure this path is correct
import { useRouter } from "expo-router";
import {
  ExploreImageBanner,
  hashtagData,
  fetchSwipper,
} from "~/constants/hardCodedFiles";

interface SwipperSlide {
  _id: string;
  imageUrl: string;
  title: string;
  sportsName: string;
  isTrending: boolean;
  content: string;
  createdAt: string;
  date?: string; // Add date & time fields
  time?: string;
}

interface SwiperTopProps {
  swiperData: SwipperSlide[];
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

const SwiperTop: React.FC<SwiperTopProps> = ({ swiperData }) => {
  // const [swipperData, setSwipperData] = useState<SwipperSlide[]>([]);
  // const {
  //   data: swipperSlides,
  //   isLoading,
  //   error,
  // } = useGetTrendingSwipperSlidesQuery();

  // useEffect(() => {
  //   if (swipperData.length === 0) {
  //     fetchSwipper().then((slides) => {
  //       const formattedData = slides.map((item: SwipperSlide) => ({
  //         ...item,
  //         ...formatDateTime(item.createdAt), // Add formatted date & time
  //       }));
  //       setSwipperData(formattedData);
  //     });
  //   }
  // }, []);
  const router = useRouter();

  const formattedData = useMemo(
    () =>
      swiperData.map((item) => ({
        ...item,
        ...formatDateTime(item.createdAt),
      })),
    [swiperData]
  );

  const [numberOfLinesTitle, setNumberOfLinesTitle] = useState(2);

  return (
    <Swiper
      autoplay={true}
      loop={true} // Ensure continuous sliding
      autoplayTimeout={3}
      showsPagination={true}
      key={swiperData.length} // Ensures re-render on data change
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
      style={{ height: 220, marginTop: 0.5 }}
    >
      {formattedData.length > 0 ? (
        formattedData.map((slide) => (
          <Pressable
            onPress={() => {
              router.push({
                pathname: `/(app)/(tabs)/articlePage`,
                params: {
                  id: slide._id,
                  sportsName: slide.sportsName,
                },
              });
            }}
            key={slide._id}
            className="flex-1"
          >
            {/* <View
              style={{
                width: "100%", // make sure it's full width
                height: "100%", // enough height to show the image
                justifyContent: "center",
                alignItems: "center",
              }}
            > */}
            <Image
              source={{ uri: slide.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* <LinearGradient
                colors={[
                  "rgba(0,0,0,0.95)",
                  "rgba(0,0,0,0.98)",
                  "rgba(0,0,0,1)",
                ]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                className="absolute bottom-0 left-0 right-0 h-64"
              /> */}
            <View className="absolute bottom-9 pl-5">
              <TextScallingFalse
                className="text-white text-6xl font-bold"
                numberOfLines={numberOfLinesTitle}
              >
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
            {/* </View> */}
          </Pressable>
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
