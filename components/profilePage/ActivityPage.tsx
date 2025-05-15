import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextScallingFalse from "~/components/CentralText";
import { Divider } from "react-native-elements";
import PostContainer from "~/components/Cards/postContainer";
import { Post } from "~/types/post";
import { AppDispatch, RootState } from "~/reduxStore";
import { Colors } from "~/constants/Colors";
import { makeSelectUserPosts } from "~/reduxStore/slices/post/selectors";
import { fetchUserPosts } from "~/reduxStore/slices/post/hooks";
import { RefreshControl } from "react-native";

interface ActivityPageProps {
  userId: string;
  type: string;
}

const ActivityPage = ({ userId, type }: ActivityPageProps) => {
  console.log("Page rendered ");
  const dispatch = useDispatch<AppDispatch>();

  const selectUserPosts = useMemo(
    () => makeSelectUserPosts(userId, type),
    [userId, type]
  );

  const posts = useSelector(selectUserPosts);
  console.log(posts);
  const nextCursor = useSelector(
    (state: RootState) => state.views.user[userId]?.[type]?.nextCursor ?? null
  );

  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadPosts = async (cursor?: string | null) => {
    await dispatch(fetchUserPosts({ userId, type, limit: 10, cursor }));
  };

  useEffect(() => {
    setInitialLoading(true);
    loadPosts().finally(() => setInitialLoading(false));
  }, [userId, type]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts(); // no cursor => refresh
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    await loadPosts(nextCursor);
    setLoadingMore(false);
  };

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View className="w-screen">
        <PostContainer isVisible={true} item={item} isMyActivity={true} />
        <Divider style={{ width: "100%" }} width={0.4} color="#282828" />
      </View>
    ),
    []
  );

  if (initialLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.themeColor} />
      </View>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <TextScallingFalse className="text-white">
        Posts not found
      </TextScallingFalse>
    );
  }

  return (
    <View className="mt-4">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.themeColor}
          />
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color={Colors.themeColor} />
          ) : null
        }
      />
    </View>
  );
};

export default React.memo(ActivityPage);

const styles = StyleSheet.create({
  fullScreenLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
