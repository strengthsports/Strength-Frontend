import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import Swiper from "react-native-swiper";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "~/constants/Colors"; // Ensure this path is correct
import TextScallingFalse from "@/components/CentralText"; // Ensure this path is correct
import { ExploreImageBanner, hashtagData } from "~/constants/hardCodedFiles";

const SwiperTop = () => {
  return (
    <Swiper
      autoplay={true}
      autoplayTimeout={3}
      showsPagination={true}
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
      {ExploreImageBanner.map((item, index) => (
        <View key={index} className="flex-1">
          <Image
            source={{ uri: item.url }}
            style={{ width: "100%", height: 250 }}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
            className="absolute bottom-0 left-0 right-0 h-40"
          />
          <View className="absolute bottom-9 pl-5">
            <TextScallingFalse className="text-white text-6xl font-bold">
              {item.title}
            </TextScallingFalse>
            <View className="flex-row items-center">
              <TextScallingFalse className="text-[#12956B] text-xl font-bold text-start">
                {item.game}
              </TextScallingFalse>
              <TextScallingFalse className="text-white text-xl">
                {" "}
                • {item.date}
              </TextScallingFalse>
              <TextScallingFalse className="text-white text-xl">
                {" "}
                • {item.time}
              </TextScallingFalse>
            </View>
          </View>
        </View>
      ))}
    </Swiper>
  );
};

export default SwiperTop;
