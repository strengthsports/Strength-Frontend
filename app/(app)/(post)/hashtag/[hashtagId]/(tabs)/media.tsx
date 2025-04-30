import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { memo } from "react";
import { FlatList } from "react-native";
import { useGetImagesByHashtagQuery } from "~/reduxStore/api/posts/postsApi.hashtag";
import { useLocalSearchParams } from "expo-router";
import TextScallingFalse from "~/components/CentralText";
import { Colors } from "~/constants/Colors";

const Photos = () => {
  const { hashtagId } = useLocalSearchParams(); // Get the hashtag from params
  const hashtag =
    typeof hashtagId === "string" ? hashtagId : hashtagId?.[0] || "";
  const { data, isLoading, isError } = useGetImagesByHashtagQuery({ hashtag });
  const memoizedEmptyComponent = memo(() => (
    <Text className="text-white text-center p-4">No images available</Text>
  ));

  if (isLoading)
    return (
      <View className="flex justify-center items-center">
        <ActivityIndicator size="large" color={Colors.themeColor} />
      </View>
    );

  if (isError)
    return (
      <View className="flex justify-center items-center">
        <TextScallingFalse className="text-red-500">
          {" "}
          Error loading posts
        </TextScallingFalse>
      </View>
    );

  return (
    <View className="h-full">
      <FlatList
        data={data?.data}
        keyExtractor={(item, index) => `${item}-${index}`}
        numColumns={2} // Adjusts for responsiveness
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.url }}
            resizeMode="cover" // Maintains aspect ratio
            style={styles.image}
          />
        )}
        ListEmptyComponent={memoizedEmptyComponent}
      />
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  image: {
    width: width / 2 - 10, // Responsive grid layout (2 columns)
    height: 105, // Fixed height (adjust if needed)
    margin: 5,
  },
});

export default Photos;
