import { useLocalSearchParams } from "expo-router";
import { memo, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
} from "react-native";
import { FlatList } from "react-native";
import { View } from "react-native";
import TextScallingFalse from "~/components/CentralText";
import { useLazyGetSpecificUserPostQuery } from "~/reduxStore/api/profile/profileApi.post";

const UserPostsImages = () => {
  const params = useLocalSearchParams();

  const fetchedUserId = useMemo(() => {
    return params.userId
      ? JSON.parse(decodeURIComponent(params?.userId as string))
      : null;
  }, [params.userId]);
  const [getPostImages, { data: posts, isLoading, isError }] =
    useLazyGetSpecificUserPostQuery();

  useEffect(() => {
    getPostImages({
      postedBy: fetchedUserId?.id,
      postedByType: fetchedUserId?.type,
      limit: 10,
      skip: 0,
    });
  }, []);

  const memoizedEmptyComponent = memo(() => (
    <Text className="text-white text-center p-4">No images available</Text>
  ));

  if (isLoading)
    return (
      <View className="flex justify-center items-center">
        <ActivityIndicator color="#12956B" size={22} />
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

  // Extract URLs from posts
  const imageUrls = posts
    ?.flatMap((post: any) => post.assets) // Flatten assets from all posts
    ?.map((asset: any) => asset.url) // Extract URLs
    ?.filter((url: any) => url); // Remove empty values

  return (
    <View className="h-full">
      <FlatList
        data={imageUrls}
        keyExtractor={(item, index) => `${item}-${index}`}
        numColumns={2} // Adjusts for responsiveness
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
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

export default UserPostsImages;
