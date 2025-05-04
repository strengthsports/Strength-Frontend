import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useState,
} from "react";
import { useSelector } from "react-redux";
import TextScallingFalse from "~/components/CentralText";
import { Divider } from "react-native-elements";
import PostContainer from "~/components/Cards/postContainer";
import { Post } from "~/types/post";
import { useLazyGetUserPostsByCategoryQuery } from "~/reduxStore/api/profile/profileApi.post"; // adjust path accordingly

const Posts = () => {
  const { user } = useSelector((state: any) => state?.profile);
  const isAndroid = Platform.OS === "android";
  const flatListRef = useRef<FlatList>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [trigger, { data, isLoading, isFetching, isError, error }] =
    useLazyGetUserPostsByCategoryQuery();

  console.log(data);

  const fetchPosts = async (isInitial = false) => {
    const res = await trigger({
      userId: user._id,
      type: "all", // or "recent" / "polls" etc.
      limit: 10,
      cursor: isInitial ? null : cursor,
    }).unwrap();

    if (res) {
      setPosts((prev) => (isInitial ? res.data : [...prev, ...res.data]));
      setCursor(res.nextCursor);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchPosts(true); // fetch first time
    }
  }, [user?._id]);

  const handleLoadMore = () => {
    if (!isFetching && cursor) {
      setIsFetchingMore(true);
      fetchPosts().finally(() => setIsFetchingMore(false));
    }
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

  const memoizedEmptyComponent = useCallback(() => {
    return (
      <View className="flex justify-center items-center flex-1 p-4">
        {isLoading ? (
          <ActivityIndicator color="#12956B" size={22} />
        ) : (
          <TextScallingFalse className="text-white text-center">
            No posts available
          </TextScallingFalse>
        )}
      </View>
    );
  }, [isLoading]);

  if (error || isError)
    return (
      <View className="flex justify-center items-center">
        <TextScallingFalse className="text-red-500">
          Error loading posts
        </TextScallingFalse>
      </View>
    );

  return (
    <View className="mt-4">
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        initialNumToRender={5}
        removeClippedSubviews={isAndroid}
        windowSize={11}
        renderItem={renderItem}
        ListEmptyComponent={memoizedEmptyComponent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator
              size="small"
              color="#12956B"
              style={{ marginVertical: 10 }}
            />
          ) : null
        }
      />
    </View>
  );
};

export default Posts;

const styles = StyleSheet.create({});
