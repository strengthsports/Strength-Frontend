import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import {
  useLazyFetchFollowersQuery,
  useLazyFetchFollowingsQuery,
} from "~/reduxStore/api/profile/profileApi.follow";
import { useLazyFetchLikersQuery } from "~/reduxStore/api/feed/features/feedApi.getLiker";
import TextScallingFalse from "../CentralText";
import UserCard from "../Cards/UserCard";
import { useSelector } from "react-redux";
import { RootState } from "~/reduxStore";

export type PageType = "Likers" | "Followers" | "Followings";

interface UserListProps {
  targetId: string;
  type: PageType;
}

const ITEM_HEIGHT = 60;

const UserList = memo(({ targetId, type }: UserListProps) => {
  const currentUserId = useSelector(
    (state: RootState) => state.profile.user?._id
  );
  const [userData, setUserData] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isPaginating, setIsPaginating] = useState(false);

  // Add this ref at the top of your component
  const lastDataRef = useRef<any>();

  // Unified lazy hooks
  const [fetchFollowers, followersResult] = useLazyFetchFollowersQuery();
  const [fetchFollowings, followingsResult] = useLazyFetchFollowingsQuery();
  const [fetchLikers, likersResult] = useLazyFetchLikersQuery();

  const { fetchFn, result } = useMemo(() => {
    switch (type) {
      case "Followers":
        return { fetchFn: fetchFollowers, result: followersResult };
      case "Followings":
        return { fetchFn: fetchFollowings, result: followingsResult };
      case "Likers":
        return { fetchFn: fetchLikers, result: likersResult };
      default:
        return { fetchFn: fetchFollowers, result: followersResult };
    }
  }, [
    type,
    fetchFollowers,
    fetchFollowings,
    fetchLikers,
    followersResult,
    followingsResult,
    likersResult,
  ]);

  const isInitialLoading = result.isLoading && userData.length === 0;
  const isFetchingMore = result.isFetching && userData.length > 0;

  useEffect(() => {
    const loadInitial = async () => {
      setUserData([]);
      setCursor(null);
      setHasMore(true);

      const baseParams =
        type === "Likers" ? { targetId } : { targetUserId: targetId };

      await fetchFn(baseParams);
    };

    loadInitial();
  }, [type, targetId]);

  useEffect(() => {
    if (!result.data) return;

    // Skip if data hasn't changed
    if (JSON.stringify(result.data) === JSON.stringify(lastDataRef.current))
      return;

    console.log("\n\nUsers : ", result.data);
    const newUsers = result.data.users || [];
    const next = result.data.nextCursor ?? null;

    setUserData((prev) => (isPaginating ? [...prev, ...newUsers] : newUsers));
    setCursor(next);
    setHasMore(Boolean(next));
    setIsPaginating(false);

    // Store the last data for comparison
    lastDataRef.current = result.data;
  }, [result.data]);

  const fetchMore = async () => {
    if (!hasMore || isFetchingMore || isPaginating) return;

    const moreParams =
      type === "Likers"
        ? { targetId, cursor }
        : { targetUserId: targetId, cursor };

    setIsPaginating(true);
    await fetchFn(moreParams);
  };

  return (
    <View
      onStartShouldSetResponder={() => true}
      className="flex-1 bg-black px-2"
    >
      {isInitialLoading ? (
        <ActivityIndicator size="large" color="#12956B" />
      ) : (
        <FlatList
          data={userData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <UserCard user={item} isOwnProfile={currentUserId === item._id} />
          )}
          contentContainerStyle={{ flexGrow: 1, padding: 10 }}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          onEndReached={fetchMore}
          onEndReachedThreshold={0.6}
          initialNumToRender={6}
          windowSize={5}
          removeClippedSubviews={true}
          maxToRenderPerBatch={6}
          ListFooterComponent={
            isFetchingMore && hasMore ? (
              <ActivityIndicator size="small" color="#12956B" />
            ) : null
          }
          ListEmptyComponent={
            <TextScallingFalse className="text-white text-center">
              No {type} Found!
            </TextScallingFalse>
          }
        />
      )}
    </View>
  );
});

export default UserList;
