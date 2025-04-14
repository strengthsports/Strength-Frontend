import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import React, { useMemo, useState, useEffect } from "react";
import TextScallingFalse from "~/components/CentralText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetSportArticleByIdQuery } from "~/reduxStore/api/explore/article/sportArticleByIdApi";
import { useGetSportArticleQuery } from "~/reduxStore/api/explore/article/sportArticleApi";
import { SafeAreaView } from "react-native-safe-area-context";
import PageThemeView from "~/components/PageThemeView";

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
  // console.log("Fetched Articles:", articles);
  // console.log("Article ID:", id);

  useEffect(() => {
    if (articles && articles.length > 0 && id) {
      const index = articles.findIndex((item) => item._id === String(id));
      setCurrentIndex(index !== -1 ? index : 0);
    }
  }, [articles, id]);

  const currentArticle = articles?.[currentIndex];

  const formattedArticle = useMemo(() => {
    if (!currentArticle) return null;
    const { date, time } = formatDateTime(currentArticle.updatedAt);
    return { ...currentArticle, date, time };
  }, [currentArticle]);

  // const formattedArticle = useMemo(() => {
  //   if (!articles || !id) return null;

  //   const found = articles.find((item) => item._id === String(id));

  //   if (!found) return null;

  //   const { date, time } = formatDateTime(found.updatedAt);
  //   const hoursAgo = getHoursAgo(found.updatedAt);
  //   return { ...found, date, time, hoursAgo };
  // }, [articles, id]);

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
    <PageThemeView>
    <ScrollView
      className="mt-4"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center justify-between px-4">
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          className="ml-1"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View className="">
          <TextScallingFalse className="text-white text-4xl font-bold">
            Today's top news
          </TextScallingFalse>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (articles && currentIndex < articles.length - 1) {
              setCurrentIndex(currentIndex + 1);
            } else setCurrentIndex(0);
          }}
          className="ml-2"
        >
          <MaterialCommunityIcons
            name="arrow-right-top"
            size={24}
            color="white"
          />
        </TouchableOpacity>
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
    </ScrollView>
    </PageThemeView>
  );
};

export default ArticlePage;

const styles = StyleSheet.create({});
