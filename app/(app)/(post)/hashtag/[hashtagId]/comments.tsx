import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const Comments = () => {
  const { hashtagId } = useLocalSearchParams();
  const hashtag = hashtagId.toString();
  return (
    <View className="mt-3 w-full h-full items-center justify-center">
      <Text className="text-white text-3xl text-center self-center align-middle">
        No results in Polls for "#{hashtag}"
      </Text>
    </View>
  );
};

export default Comments;
