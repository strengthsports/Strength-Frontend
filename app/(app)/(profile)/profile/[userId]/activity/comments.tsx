import React, { useEffect, useCallback, memo, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { formatDistanceToNowStrict } from "date-fns";

import { AppDispatch, RootState } from "~/reduxStore";
import {
  fetchCommentsByUserId,
  fetchMoreCommentsByUserId,
  selectCommentsForUser,
  selectLoadingForUser,
  selectLoadingMoreForUser,
  selectErrorForUser,
  selectHasNextPageForUser,
} from "~/reduxStore/slices/comments/userCommentsSlice";
import { CommentWithPostInfo } from "@/types/comments";
import TextScallingFalse from "~/components/CentralText";
import { Href } from "expo-router";

const MemoizedCommentItem = memo(
  ({
    item,
    navigateToPost,
  }: {
    item: CommentWithPostInfo;
    navigateToPost: (postId: string) => void;
  }) => {
    const timeAgo = item.createdAt
      ? formatDistanceToNowStrict(new Date(item.createdAt), {
          addSuffix: false,
        })
          .replace("about ", "")
          .replace(/ minutes?/, "m")
          .replace(/ hours?/, "h")
          .replace(/ days?/, "d")
          .replace(/ months?/, "mo")
          .replace(/ years?/, "y")
      : "";
    const commenterName = item.postedBy?.username || "Unknown User";
    const originalPosterName = item.postInfo?.originalPoster?.username;
    const postId = item.postInfo?._id;
    const handlePress = () => {
      if (postId) navigateToPost(postId);
      else console.warn("Cannot navigate: Post ID is missing.");
    };
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={styles.commentContainer}
        disabled={!postId}
        activeOpacity={postId ? 0.7 : 1.0}
      >
        <View style={styles.commentHeader}>
          <TextScallingFalse style={styles.commenterName}>
            {commenterName}
          </TextScallingFalse>
          {originalPosterName ? (
            <TextScallingFalse style={styles.commentMeta} numberOfLines={1}>
              {" commented on "}
              <TextScallingFalse style={styles.originalPosterName}>
                @{originalPosterName}
              </TextScallingFalse>
              {"'s post"}
            </TextScallingFalse>
          ) : (
            <TextScallingFalse style={styles.commentMeta}>
              {" "}
              commented on a post
            </TextScallingFalse>
          )}
          <TextScallingFalse style={styles.timestamp}>
            {" "}
            • {timeAgo}
          </TextScallingFalse>
        </View>
        <TextScallingFalse style={styles.commentText}>
          {item.text}
        </TextScallingFalse>
      </TouchableOpacity>
    );
  }
);

const Comments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const params = useLocalSearchParams<{ userId?: string }>();

  const parsedParams = useMemo(() => {
    try {
      if (params.userId && typeof params.userId === "string") {
        return JSON.parse(decodeURIComponent(params.userId));
      }
    } catch (e) {
      console.error(
        "Failed to parse userId param:",
        e,
        "Raw param:",
        params.userId
      );
    }
    return null;
  }, [params.userId]);

  const otherUserId = parsedParams?.id;

  const comments = useSelector((state: RootState) =>
    selectCommentsForUser(state, otherUserId ?? "")
  );
  const loading = useSelector((state: RootState) =>
    selectLoadingForUser(state, otherUserId ?? "")
  );
  const loadingMore = useSelector((state: RootState) =>
    selectLoadingMoreForUser(state, otherUserId ?? "")
  );
  const error = useSelector((state: RootState) =>
    selectErrorForUser(state, otherUserId ?? "")
  );
  const hasNextPage = useSelector((state: RootState) =>
    selectHasNextPageForUser(state, otherUserId ?? "")
  );

  const isAndroid = Platform.OS === "android";

  useEffect(() => {
    if (otherUserId && comments.length === 0) {
      dispatch(fetchCommentsByUserId({ userId: otherUserId }));
    }
  }, [dispatch, otherUserId]);

  const handleRefresh = useCallback(() => {
    if (otherUserId && !loading) {
      dispatch(fetchCommentsByUserId({ userId: otherUserId }));
    }
  }, [dispatch, otherUserId, loading]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasNextPage && otherUserId) {
      dispatch(fetchMoreCommentsByUserId({ userId: otherUserId }));
    }
  }, [dispatch, loadingMore, hasNextPage, otherUserId]);

  const navigateToPost = useCallback(
    (postId: string) => {
      router.push({
        pathname: "/post-details/[postId]",
        params: { postId: postId },
      } as Href);
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: CommentWithPostInfo }) => (
      <MemoizedCommentItem item={item} navigateToPost={navigateToPost} />
    ),
    [navigateToPost]
  );

  const renderEmptyComponent = () => (
    <View style={styles.centered}>
      <TextScallingFalse className="text-white text-center p-4">
        This user hasn't made any comments yet.
      </TextScallingFalse>
    </View>
  );

  const renderListFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <ActivityIndicator
        style={styles.footerLoader}
        size="small"
        color="#ccc"
      />
    );
  }, [loadingMore]);

  if (!otherUserId) {
    return (
      <View style={styles.centered}>
        <TextScallingFalse style={styles.emptyText}>
          User not found.
        </TextScallingFalse>
      </View>
    );
  }

  if (loading && comments.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#12956B" />
      </View>
    );
  }

  if (error && comments.length === 0 && !loading) {
    return (
      <View style={styles.centered}>
        <TextScallingFalse className="text-red-500 mb-4 text-center">
          Error loading comments: {error}
        </TextScallingFalse>
        <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={comments}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.7}
      ListFooterComponent={renderListFooter}
      ListEmptyComponent={renderEmptyComponent}
      refreshControl={
        <RefreshControl
          refreshing={loading && comments.length > 0}
          onRefresh={handleRefresh}
          colors={["#12956B"]}
          tintColor={"#12956B"}
        />
      }
      initialNumToRender={10}
      windowSize={15}
      removeClippedSubviews={isAndroid}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 10,
    paddingBottom: 50,
    flexGrow: 1,
  },
  commentContainer: {
    backgroundColor: "#000000",
    paddingVertical: 15,
    paddingHorizontal: 15,
    // marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "nowrap",
    overflow: "hidden",
  },
  commenterName: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  commentMeta: {
    color: "#CECECE",
    fontSize: 12,
    marginLeft: 4,
    flexShrink: 1,
  },
  originalPosterName: {
    color: "#12956B",
    fontWeight: "500",
    fontSize: 12,
  },
  timestamp: {
    color: "#8E8E93",
    fontSize: 12,
    marginLeft: "auto",
    paddingLeft: 5,
  },
  commentText: {
    color: "#E5E5EA",
    fontSize: 15,
    lineHeight: 20,
    marginTop: 2,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  footerLoader: {
    marginVertical: 20,
  },
  retryButton: {
    backgroundColor: "#12956B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  emptyText: {
    color: "#8E8E93",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Comments;
