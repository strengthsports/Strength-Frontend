import React from "react";
import { View, Image, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Swiper from "react-native-swiper";
import TextScallingFalse from "~/components/CentralText"; 
import { Colors } from "~/constants/Colors";
import { ExploreImageBanner, hashtagData } from "~/constants/hardCodedFiles";


const TrendingAll = () => {
  return (
    <ScrollView >
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
              className="w-full h-72" 
              resizeMode="cover"
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
      <View className="h-[0.6px] bg-neutral-600 " />

        {/* hashtags */}
        <View style={{ paddingTop: 20 }}>
        {hashtagData.map((item, index) => (
          <Hashtag
            key={index}
            index={index + 1}
            hashtag={item.hashtag}
            postsCount={item.postsCount}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default TrendingAll;

// hashtag UI
const Hashtag = ({ hashtag, postsCount, index }: {hashtag : string, postsCount : string, index : number}) => {
  return (
    <>
      <View className="px-5 flex-row">
        {/* Index */}
        <TextScallingFalse className="text-theme text-5xl mt-1 font-bold mr-5">
          {index}
        </TextScallingFalse>

        {/* Hashtag and Posts Count */}
        <View className="flex-col justify-center">
          <TextScallingFalse className="text-white text-4xl font-bold ">{hashtag}</TextScallingFalse>
          <TextScallingFalse className="text-[#ABABAB] text-2xl mt-1">{postsCount} posts</TextScallingFalse>
        </View>
      </View>

      {/* Divider */}
      <View
        className=" h-[0.6px] bg-neutral-500 my-3 ml-14 mr-6"
      />

    </>
  );
};