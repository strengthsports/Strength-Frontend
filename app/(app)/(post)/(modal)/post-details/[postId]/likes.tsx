import {
  ActivityIndicator,
  StyleSheet,
  Text,
  RefreshControl,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useCallback, memo, useRef } from "react";
import { useFetchLikersQuery } from "~/reduxStore/api/feed/features/feedApi.getLiker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LikerCard } from "~/components/feedPage/LikerModal";
import TopBar from "~/components/TopBar";
import PageThemeView from "~/components/PageThemeView";
import { debounce } from "@/utils/debounce";
import TextScallingFalse from "~/components/CentralText";
import { View } from "react-native";
import { Image } from "expo-image";
import emptyLike from "@/assets/images/emptyLike.jpg";
import { AntDesign } from "@expo/vector-icons";
import LikeNotFound from "~/components/notfound/likeNotFound";

const DEBOUNCE_DELAY = 1000;
const { height } = Dimensions.get("window");

const Likes = memo(() => {
  const { postId } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const { data, error, isLoading, refetch } = useFetchLikersQuery({
    targetId: postId.toString(),
    targetType: "Post",
  });

  // Store the debounced function in a ref to maintain it between renders
  const debouncedRefetch = useRef(
    debounce(async () => {
      try {
        await refetch();
      } finally {
        setRefreshing(false);
      }
    }, DEBOUNCE_DELAY)
  ).current;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    debouncedRefetch();
  }, [debouncedRefetch]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => <LikerCard liker={item.liker} />,
    []
  );

  const keyExtractor = useCallback((item: any) => item.liker._id, []);

  return (
    <PageThemeView>
      <TopBar heading="Likes" backHandler={() => router.push("..")} />

      {isLoading && !refreshing ? (
        <ActivityIndicator size="large" color="#12956B" />
      ) : (
        <FlatList
          data={data?.data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 5 }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews
          updateCellsBatchingPeriod={100}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#12956B", "#6E7A81"]}
              tintColor="#6E7A81"
              progressBackgroundColor="#181A1B"
            />
          }
          ListEmptyComponent={
            <View
              className="justify-center items-center"
              style={{
                paddingTop: height / 2.5,
              }}
            >
              <LikeNotFound />
            </View>
          }
        />
      )}
    </PageThemeView>
  );
});

export default Likes;

const styles = StyleSheet.create({});
