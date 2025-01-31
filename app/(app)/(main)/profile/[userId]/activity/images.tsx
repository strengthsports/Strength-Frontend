import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import { Dimensions, Image, StyleSheet } from "react-native";
import { FlatList } from "react-native";
import { View } from "react-native";
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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts</div>;

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
