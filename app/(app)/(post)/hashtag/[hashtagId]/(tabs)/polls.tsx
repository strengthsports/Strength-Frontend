import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import HashtagNotFound from "~/components/notfound/hashtagNotFound";

const Polls = () => {
  const { hashtagId } = useLocalSearchParams(); // Get the hashtag from params
  const hashtag =
    typeof hashtagId === "string" ? hashtagId : hashtagId?.[0] || "";
  return (
    <View className="mt-3 w-full h-full items-center justify-center">
      <HashtagNotFound text={hashtag} />
    </View>
  );
};

export default Polls;
