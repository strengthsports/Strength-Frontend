import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import React, { useMemo } from "react";
import TextScallingFalse from "../../CentralText";
import { LinearGradient } from "expo-linear-gradient";
import { useGetSportArticleQuery } from "~/reduxStore/api/explore/article/sportArticleApi";
import { RelativePathString, useRouter } from "expo-router";

interface ArticleData {
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

interface ArticleProps {
  articleData: ArticleData[];
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

const ArticleContent: React.FC<ArticleProps> = ({ articleData }) => {
  const router = useRouter();
  const formattedData = useMemo(
    () =>
      articleData.map((item: ArticleData) => ({
        ...item,
        ...formatDateTime(item.createdAt),
      })),
    [articleData]
  );

  const renderItem = ({ item }: { item: (typeof formattedData)[0] }) => {
    return (
      <View className="">
        <Pressable
          onPress={() => {
            router.push({
              pathname: `/(app)/articlePage`,
              params: {
                id: item._id,
                sportsName: item.sportsName,
              },
            });
          }}
          className="flex-row pt-2 h-28 gap-4 px-2 mt-2"
        >
          <View className="w-[125px] h-[80px] overflow-hidden rounded-xl border-[1px] border-[#181818] bg-[#000]">
            <Image
              source={{ uri: item.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          <View className="flex-column justify-between">
            <TextScallingFalse
              className="text-white text-2xl font-semibold"
              numberOfLines={3}
              ellipsizeMode="tail"
              style={{ maxWidth: 235 }}
            >
              {item.title}
            </TextScallingFalse>

            <View className="flex-row items-center pb-3">
              <TextScallingFalse className="text-[#12956B] font-bold text-start text-base">
                {item.sportsName}
              </TextScallingFalse>
              <TextScallingFalse className="text-white text-base">
                {" "}
                • {item.date}
              </TextScallingFalse>
              <TextScallingFalse className="text-white text-base">
                {" "}
                • {item.time}
              </TextScallingFalse>
            </View>
          </View>
        </Pressable>
        <View className=" h-[0.6px] bg-[#313131] m-3" />
      </View>
    );
  };

  return (
    <View>
      <Text>Article</Text>
      <FlatList
        data={formattedData}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default ArticleContent;

const styles = StyleSheet.create({});
