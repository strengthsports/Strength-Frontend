import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
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
import { useRouter } from "expo-router";

interface ActivityPageProps {
  userId: string;
  type: string;
}

type PostType = "all" | "thoughts" | "polls" | "clips" | "mentions";

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
  mentions: {
    currentUser: {
      title: "Your Mentions - See Who's Talking About You!",
      buttonText: "Make Your Move",
    },
    otherUser: {
      title: "No mentions yet",
      buttonText: undefined,
    },
  },
};

const ActivityPage = ({ userId, type }: ActivityPageProps) => {
  console.log("Page rendered ");
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.profile);
  const router = useRouter();
  const isCurrentUser = user?._id === userId;

  const selectUserPosts = useMemo(
    () => makeSelectUserPosts(userId, type),
    [userId, type]
  );

  const posts = useSelector(selectUserPosts);
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
      onPress={() => router.push("/add-post")}
      activeOpacity={0.7}
      className="w-auto bg-[#262626] rounded-full py-3 px-4 flex-row items-center justify-center mb-2"
      style={{ borderColor: "#313131", borderWidth: 1 }}
    >
      <TextScallingFalse className="text-[#c0c0c0] font-normal text-2xl">
        {label}
      </TextScallingFalse>
    </TouchableOpacity>
  ));

  if (initialLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.themeColor} />
      </View>
    );
  }

  if (!posts || posts.length === 0) {
    const config = EMPTY_STATE_CONFIG[type as PostType];
    const { title, buttonText } = isCurrentUser
      ? config.currentUser
      : config.otherUser;
    return (
      <View className="w-full items-center mt-8 gap-y-2">
        <TextScallingFalse className="text-[#808080] font-normal text-4xl mb-3 text-center">
          {title}
        </TextScallingFalse>
        {isCurrentUser && buttonText && (
          <EmptyComponentButton label={buttonText} />
        )}
      </View>
    );
  }

  return (
    <View>
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
