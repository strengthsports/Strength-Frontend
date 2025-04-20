import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import TextScallingFalse from "~/components/CentralText";
import PageThemeView from "~/components/PageThemeView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetSportArticleQuery } from "~/reduxStore/api/explore/article/sportArticleApi";

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

const getHoursAgo = (isoString: string): number => {
  const updatedTime = new Date(isoString);
  const currentTime = new Date();
  const diffInMs = currentTime.getTime() - updatedTime.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  return Math.floor(diffInHours); // or Math.round(diffInHours) if preferred
};

//artile page for the articles when clicked on them
const ArticlePage = () => {
  const screenWidth = Dimensions.get("window").width;

  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { id, sportsName } = useLocalSearchParams();
  const validId = typeof id === "string" ? id : id?.[0] ?? "";
  const validSportsName =
    typeof sportsName === "string" ? sportsName : sportsName?.[0] ?? "";

  const {
    data: articles,
    error,
    isLoading,
  } = useGetSportArticleQuery(validSportsName);

  const { width } = useWindowDimensions();

  const renderItem = ({ item }: any) => {
    const { date, time } = formatDateTime(item.updatedAt);
    // const hoursAgo = getHoursAgo(item.updatedAt);
    return (
      <ScrollView
        style={{ width }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View className="w-full h-[220px] overflow-hidden border-[#181818]">
          <Image
            source={{ uri: item.imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="mt-6 mx-4">
          <View className="flex-row">
            <TextScallingFalse className="text-[#12956B] font-bold text-base">
              {item.sportsName}
            </TextScallingFalse>
            <TextScallingFalse className="text-[#919191] text-base">
              {"  "}• {date}
            </TextScallingFalse>
          </View>
          <TextScallingFalse className="text-white font-bold text-6xl mt-3">
            {item.title}
          </TextScallingFalse>
          <TextScallingFalse className="text-[#919191] mt-2 text-base">
            By Editor at Strength
          </TextScallingFalse>
          <TextScallingFalse className="text-white mt-5 text-[15px] leading-normal">
            {item.content}
          </TextScallingFalse>
        </View>
      </ScrollView>
    );
  };

  if (isLoading) {
    return (
      <View className="my-6 items-center">
        <TextScallingFalse className="text-white">
          Article loading...
        </TextScallingFalse>
      </View>
    );
  }

  if (error || !articles) {
    return (
      <View className="my-6 items-center">
        <TextScallingFalse className="text-white">
          Error fetching article
        </TextScallingFalse>
      </View>
    );
  }

  return (
    <PageThemeView>
      <View className="flex-1 bg-black">
        <View className="flex-row items-center justify-between px-4 pt-3">
          <TouchableOpacity onPress={() => router.back()} className="ml-1">
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <TextScallingFalse className="text-white text-3xl font-bold">
            {validSportsName} articles
          </TextScallingFalse>
          <TouchableOpacity onPress={() => console.log("Share button")}>
            <MaterialCommunityIcons name="share" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {/* 👇 Dot Indicators */}
        <View className="flex-row justify-center items-center mt-1">
          {articles?.map((_, index) => (
            <View
              key={index}
              style={{
                width: 5,
                height: 5,
                borderRadius: 5,
                backgroundColor: currentIndex === index ? "#fff" : "#000",
                borderColor: "#fff",
                borderWidth: 1,
                marginHorizontal: 4,
                opacity: currentIndex === index ? 1 : 0.7,
              }}
            />
          ))}
        </View>

        <View className="h-[0.8px] bg-[#404040] mt-3" />

        <FlatList
          data={articles}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          initialScrollIndex={
            articles?.findIndex((item) => item._id === String(id)) ?? 0
          }
          getItemLayout={(data, index) => ({
            length: screenWidth, // width of each item
            offset: screenWidth * index, // offset from the start
            index,
          })}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / screenWidth
            );
            setCurrentIndex(index);
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </PageThemeView>
  );
};

export default ArticlePage;

const styles = StyleSheet.create({});
