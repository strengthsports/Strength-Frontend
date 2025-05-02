import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { memo, useCallback, useEffect, useMemo } from "react";
import TextScallingFalse from "~/components/CentralText";
import PostContainer from "~/components/Cards/postContainer";
import { Post } from "~/types/post";
import { useLazyGetSpecificUserPostQuery } from "~/reduxStore/api/profile/profileApi.post";
import { useLocalSearchParams } from "expo-router";

const Clips = () => {
  const params = useLocalSearchParams();
  const isAndroid = Platform.OS === "android";

  const fetchedUserId = useMemo(() => {
    try {
      const userIdParam = params.userId as string;
      if (userIdParam) {
        return JSON.parse(decodeURIComponent(userIdParam));
      }
      return null;
    } catch (e) {
      console.error("[OtherUserClips] Failed to parse userId param:", e);
      return null;
    }
  }, [params.userId]);

  const [
    getUserSpecificPost,
    {
      data: postsData,
      isLoading: postsIsLoading,
      isFetching: postsIsFetching,
      error: postsError,
      isError: postsIsError,
    },
  ] = useLazyGetSpecificUserPostQuery();

  useEffect(() => {
    if (fetchedUserId?.id && fetchedUserId?.type) {
      getUserSpecificPost({
        postedBy: fetchedUserId.id,
        postedByType: fetchedUserId.type,
        limit: 30,
        skip: 0,
      });
    }
  }, [fetchedUserId?.id, fetchedUserId?.type, getUserSpecificPost]);

  const videoPosts = useMemo(() => {
    const allPosts: Post[] = postsData || [];
    return allPosts.filter((post: Post) => post?.isVideo === true);
  }, [postsData]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View style={styles.postItemContainer}>
        <PostContainer item={item} isVisible={true} />
      </View>
    ),
    []
  );

  const MemoizedEmptyComponent = memo(() => (
    <View style={styles.centerContent}>
      <TextScallingFalse style={styles.emptyText}>
        No clips available
      </TextScallingFalse>
    </View>
  ));

  const isLoading = postsIsLoading || postsIsFetching;

  if (isLoading && videoPosts.length === 0) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator color="#12956B" size={22} />
      </View>
    );
  }

  if (postsIsError && videoPosts.length === 0) {
    //  console.error("[OtherUserClips] Error loading user clips:", postsError);
    return (
      <View style={styles.centerContent}>
        <TextScallingFalse style={styles.errorText}>
          Error loading videos
        </TextScallingFalse>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videoPosts}
        keyExtractor={(item) => item._id}
        initialNumToRender={3}
        removeClippedSubviews={isAndroid}
        windowSize={7}
        renderItem={renderItem}
        ListEmptyComponent={MemoizedEmptyComponent}
        bounces={false}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

export default Clips;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 4,
    backgroundColor: "#000",
  },
  postItemContainer: {
    width: "100%",
    marginBottom: 10,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#FFF",
    textAlign: "center",
    padding: 4,
  },
  errorText: {
    color: "#F87171",
    textAlign: "center",
  },
  listContentContainer: {
    paddingBottom: 40,
  },
});
