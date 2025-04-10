import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useMemo } from "react";
import TextScallingFalse from "~/components/CentralText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetSportArticleByIdQuery } from "~/reduxStore/api/explore/article/sportArticleByIdApi";

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
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const validId = typeof id === "string" ? id : id?.[0] ?? "";
  const {
    data: article,
    error,
    isLoading,
  } = useGetSportArticleByIdQuery(validId);

  const formattedArticle = useMemo(() => {
    if (!article || !id) return null;

    const { date, time } = formatDateTime(article.updatedAt);
    const hoursAgo = getHoursAgo(article.updatedAt);
    return { ...article, date, time, hoursAgo };
  }, [article, id]);

  // console.log("Clicked Article:", article);

  if (isLoading) {
    return (
      <View className="my-6 items-center">
        <TextScallingFalse className="text-white">
          Article loading...
        </TextScallingFalse>
      </View>
    );
  }

  if (error) {
    return (
      <View className="my-6 items-center">
        <TextScallingFalse className="text-white">
          Error fetching article
        </TextScallingFalse>
      </View>
    );
  }

  return (
    <View className="mt-4">
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          className="ml-1"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <TextScallingFalse className="text-white text-4xl font-bold">
            Today's top news
          </TextScallingFalse>
        </View>
      </View>

      <View className="w-full h-60 mt-4 overflow-hidden rounded-xl border border-[#181818]">
        <Image
          source={{ uri: formattedArticle?.imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <View className="mt-6 mx-4">
        <View className="flex-row">
          <TextScallingFalse className="text-white text-base">
            Posted at {formattedArticle?.date} •{" "}
          </TextScallingFalse>
          <TextScallingFalse className="text-[#12956B] font-bold text-base">
            {formattedArticle?.sportsName}
          </TextScallingFalse>
        </View>
        <TextScallingFalse className="text-white text-6xl mt-3">
          {formattedArticle?.title}
        </TextScallingFalse>
        <TextScallingFalse className="text-white mt-2 text-base">
          by Editor at Strength
        </TextScallingFalse>
        <TextScallingFalse className="text-white mt-4">
          {formattedArticle?.content}
        </TextScallingFalse>
      </View>
    </View>
  );
};

export default ArticlePage;

const styles = StyleSheet.create({});
