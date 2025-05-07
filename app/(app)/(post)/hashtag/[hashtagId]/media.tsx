import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { memo } from "react";
import { FlatList } from "react-native";
import { useGetHashtagContentsQuery } from "~/reduxStore/api/feed/features/feedApi.hashtag";
import { useLocalSearchParams } from "expo-router";
import TextScallingFalse from "~/components/CentralText";
import { Colors } from "~/constants/Colors";

const MediaScreen = ({ hashtag }: { hashtag: string }) => {
  const { data, isLoading, isError } = useGetHashtagContentsQuery({
    hashtag,
    limit: 10,
    type: "media",
  });

  console.log("\n\nMedia", data?.data);

  const memoizedEmptyComponent = memo(() => (
    <TextScallingFalse className="text-white text-center p-4">
      No images available
    </TextScallingFalse>
  ));

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center">
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
            source={{ uri: item.assets[0].url }}
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
    width: width / 2 - 10,
    height: 105,
    margin: 5,
  },
});

export default MediaScreen;
