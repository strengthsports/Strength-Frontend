import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type ArticleType = {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  sportsName: string;
  createdAt: string;
};

const ArticlePage = () => {
  const { article } = useLocalSearchParams<{
    article?: string;
  }>();

  const router = useRouter();

  const parsedArticle: ArticleType | null =
    typeof article === "string" ? JSON.parse(article) : null;

  if (!parsedArticle) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-white">Article data not available.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-4">
      {/* 🔙 Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="mb-4 flex-row items-center gap-2"
      >
        <MaterialCommunityIcons name="arrow-left" color="white" size={24} />
        <Text className="text-white text-base">Back</Text>
      </TouchableOpacity>

      <Image
        source={{ uri: parsedArticle.imageUrl }}
        className="w-full h-60 rounded-xl mb-4"
        resizeMode="cover"
      />

      <Text className="text-white text-3xl font-bold">
        {parsedArticle.title}
      </Text>

      <Text className="text-gray-400 mt-2">
        {parsedArticle.sportsName} •{" "}
        {new Date(parsedArticle.createdAt).toLocaleDateString()}
      </Text>

      <Text className="text-white mt-4 leading-6">{parsedArticle.content}</Text>
    </ScrollView>
  );
};

export default ArticlePage;

const styles = StyleSheet.create({});
