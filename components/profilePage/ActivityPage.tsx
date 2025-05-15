import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextScallingFalse from "~/components/CentralText";
import { Divider } from "react-native-elements";
import PostContainer from "~/components/Cards/postContainer";
import { Post } from "~/types/post";
import { AppDispatch, RootState } from "~/reduxStore";
import {
  fetchNonFeedPosts,
  selectAllNonFeedPosts,
  selectNonFeedState,
} from "~/reduxStore/slices/feed/feedSlice";
import { Colors } from "~/constants/Colors";
import { setAddPostContainerOpen } from "~/reduxStore/slices/post/postSlice";

interface ActivityPageProps {
  userId: string;
  type: string;
}

type PostType = "all" | "thoughts" | "polls" | "clips";

const EMPTY_STATE_CONFIG: Record<
  PostType,
  {
    currentUser: { title: string; buttonText: string };
    otherUser: { title: string; buttonText?: string };
  }
> = {
  all: {
    currentUser: {
      title: "Share your sports moment with the world!",
      buttonText: "Create your first post",
    },
    otherUser: {
      title: "No posts yet",
      buttonText: undefined,
    },
  },
  thoughts: {
    currentUser: {
      title: "Let the Sports World Hear You Out!",
      buttonText: "Share thoughts",
    },
    otherUser: {
      title: "No thoughts shared yet",
      buttonText: undefined,
    },
  },
  polls: {
    currentUser: {
      title: "Drop a Poll, Settle the Debate!",
      buttonText: "Add your first poll",
    },
    otherUser: {
      title: "No polls created yet",
      buttonText: undefined,
    },
  },
  clips: {
    currentUser: {
      title: "Lights, Camera, Action --- In Sport Mode!",
      buttonText: "Share your first clip",
    },
    otherUser: {
      title: "No clips shared yet",
      buttonText: undefined,
    },
  },
};

const ActivityPage = ({ userId, type }: ActivityPageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAndroid = Platform.OS === "android";
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { user: currentUser } = useSelector(
    (state: RootState) => state.profile
  );
  const isCurrentUser = currentUser?._id === userId;

  const { nonFeedLoading, nonFeedError, nonFeedCursor, nonFeedHasMore } =
    useSelector(selectNonFeedState);
  const posts = useSelector(selectAllNonFeedPosts);

  const handleOpenAddPostContainer = () => {
    dispatch(setAddPostContainerOpen(true));
  };
  // Initial load or when userId/type changes
  useEffect(() => {
    setIsInitialLoad(true);
    if (userId) {
      console.log("User id : ", userId);
      dispatch(
        fetchNonFeedPosts({
          limit: 10,
          type: type || "all", // Default to "all" if not specified
          userId: userId,
          reset: true, // Always reset for new userId/type combination
        })
      );
    }
  }, [dispatch, userId, type]);

  // For subsequent loads
  const handleLoadMore = useCallback(() => {
    console.log("Load more conditions:", {
      cursor: nonFeedCursor,
      loading: nonFeedLoading,
    });
    setIsInitialLoad(false);
    if (nonFeedCursor && !nonFeedLoading && !isLoadingMore) {
      setIsLoadingMore(true);
      dispatch(
        fetchNonFeedPosts({
          limit: 10,
          cursor: nonFeedCursor,
          type: type || "all",
          userId: userId,
        })
      ).finally(() => setIsLoadingMore(false));
    }
  }, [nonFeedCursor, nonFeedLoading, isLoadingMore, type, userId]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View className="w-screen">
        <PostContainer
          isVisible={true}
          item={item}
          isMyActivity={isCurrentUser}
        />
        <Divider style={{ width: "100%" }} width={0.4} color="#282828" />
      </View>
    ),
    []
  );

  const EmptyComponentButton = React.memo(({ label }: { label: string }) => (
    <TouchableOpacity
      onPress={handleOpenAddPostContainer}
      activeOpacity={0.7}
      className="w-auto bg-[#262626] rounded-full py-3 px-4 flex-row items-center justify-center mb-2"
      style={{ borderColor: "#313131", borderWidth: 1 }}
    >
      <TextScallingFalse className="text-[#c0c0c0] font-normal text-2xl">
        {label}
      </TextScallingFalse>
    </TouchableOpacity>
  ));

  const MemoizedEmptyComponent = useCallback(() => {
    const config = EMPTY_STATE_CONFIG[type as PostType];
    const { title, buttonText } = isCurrentUser
      ? config.currentUser
      : config.otherUser;
    return (
      <View className="flex justify-center items-center flex-1 p-4">
        {nonFeedLoading ? (
          <ActivityIndicator color="#12956B" size={22} />
        ) : (
          <View className="w-full items-center mt-8 gap-y-2">
            <TextScallingFalse className="text-[#808080] font-normal text-4xl mb-3 text-center">
              {title}
            </TextScallingFalse>
            {isCurrentUser && buttonText && (
              <EmptyComponentButton label={buttonText} />
            )}
          </View>
        )}
      </View>
    );
  }, [type, nonFeedLoading, isCurrentUser]);

  if (nonFeedError)
    return (
      <View className="flex justify-center items-center">
        <TextScallingFalse className="text-red-500">
          Error loading posts
        </TextScallingFalse>
      </View>
    );

  return (
    <View className="mt-4">
      {isInitialLoad && nonFeedLoading ? (
        <View style={styles.fullScreenLoader}>
          <ActivityIndicator size="large" color={Colors.themeColor} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          initialNumToRender={5}
          removeClippedSubviews={isAndroid}
          windowSize={11}
          renderItem={renderItem}
          ListEmptyComponent={MemoizedEmptyComponent}
          onEndReached={({ distanceFromEnd }) => {
            if (distanceFromEnd < 0) return;
            handleLoadMore();
          }}
          onEndReachedThreshold={0.6}
          ListFooterComponent={
            nonFeedLoading || isLoadingMore ? (
              <ActivityIndicator
                style={{ marginVertical: 20 }}
                color={Colors.themeColor}
              />
            ) : null
          }
          bounces={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
};

export default ActivityPage;

const styles = StyleSheet.create({
  fullScreenLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
