import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useFetchLikersQuery } from "~/reduxStore/api/feed/features/feedApi.getLiker";
import { useSelector } from "react-redux";
import { RootState } from "~/reduxStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList } from "react-native";
import { LikerCard } from "~/components/feedPage/LikerModal";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "~/components/TopBar";

const Likes = () => {
  const { postId } = useLocalSearchParams();
  console.log(postId);
  const router = useRouter();
  const { data, error, isLoading, refetch } = useFetchLikersQuery({
    targetId: postId.toString(),
    targetType: "Post",
  });

  console.log(data);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <TopBar heading="Likes" backHandler={() => router.push("..")} />
      <Text>Likes</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#12956B" />
      ) : (
        <FlatList
          data={data?.data}
          keyExtractor={(item) => item.liker._id}
          renderItem={({ item }) => <LikerCard liker={item.liker} />}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          ListEmptyComponent={
            <Text className="text-white text-center">No Likes Found!</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Likes;

const styles = StyleSheet.create({});
