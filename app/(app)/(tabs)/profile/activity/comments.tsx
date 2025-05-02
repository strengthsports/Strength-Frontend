import React, { useEffect, useCallback, memo } from "react";
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
import { Href, router } from "expo-router";

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

    // console.log(item);
    const firstName = item.postedBy?.firstName || "";
    const lastName = item.postedBy?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    const commenterName = fullName || "You";
    const originalPosterName = item.postInfo?.originalPoster?.username;
    const postId = item.postInfo?._id;

    const handlePress = () => {
      if (postId) {
        navigateToPost(postId);
      } else {
        console.warn("Cannot navigate: Post ID is missing for this comment.");
      }
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
              {"commented on "}
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

  const { user } = useSelector((state: RootState) => state.profile);
  const loggedInUserId = user?._id;

  const comments = useSelector((state: RootState) =>
    selectCommentsForUser(state, loggedInUserId ?? "")
  );
  const loading = useSelector((state: RootState) =>
    selectLoadingForUser(state, loggedInUserId ?? "")
  );
  const loadingMore = useSelector((state: RootState) =>
    selectLoadingMoreForUser(state, loggedInUserId ?? "")
  );
  const error = useSelector((state: RootState) =>
    selectErrorForUser(state, loggedInUserId ?? "")
  );
  const hasNextPage = useSelector((state: RootState) =>
    selectHasNextPageForUser(state, loggedInUserId ?? "")
  );

  const isAndroid = Platform.OS === "android";
  // console.log("Comments -------> ", comments);

  useEffect(() => {
    if (loggedInUserId && comments.length === 0) {
      dispatch(fetchCommentsByUserId({ userId: loggedInUserId }));
    }
  }, [dispatch, loggedInUserId]);

  const handleRefresh = useCallback(() => {
    if (loggedInUserId && !loading) {
      dispatch(fetchCommentsByUserId({ userId: loggedInUserId }));
    }
  }, [dispatch, loggedInUserId, loading]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasNextPage && loggedInUserId) {
      dispatch(fetchMoreCommentsByUserId({ userId: loggedInUserId }));
    }
  }, [dispatch, loadingMore, hasNextPage, loggedInUserId]);

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
        You haven't commented on any post yet.
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

  if (loading && comments.length === 0) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#12956B" />
      </View>
    );
  }

  if (error && comments.length === 0 && !loading) {
    return (
      <View style={styles.loading}>
        <TextScallingFalse className="text-red-500 mb-4 text-center">
          Error loading comments: {error}
        </TextScallingFalse>
        <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
          <TextScallingFalse style={styles.retryButtonText}>
            Retry
          </TextScallingFalse>
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
