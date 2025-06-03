import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  fetchLikers,
  fetchFollowers,
  fetchFollowings,
} from "~/api/user/fetchUsers";
import TextScallingFalse from "../CentralText";
import UserCard from "../Cards/UserCard";
import { useSelector } from "react-redux";
import { RootState } from "~/reduxStore";

export type PageType = "Likers" | "Followers" | "Followings";

interface UserListProps {
  targetId: string;
  type: PageType;
  [key: string]: any;
}

const ITEM_HEIGHT = 60;

const UserList = memo(
  ({ targetId, type, refreshing, onRefresh }: UserListProps) => {
    const currentUserId = useSelector(
      (state: RootState) => state.profile.user?._id
    );

    const [userData, setUserData] = useState<any[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isPaginating, setIsPaginating] = useState(false);
    const [localResult, setLocalResult] = useState({
      data: null,
      isLoading: false,
      isFetching: false,
    });

    const lastDataRef = useRef<any>();

    const fetchFn = useMemo(() => {
      switch (type) {
        case "Likers":
          return fetchLikers;
        case "Followers":
          return fetchFollowers;
        case "Followings":
          return fetchFollowings;
        default:
          return fetchFollowers;
      }
    }, [type]);

    const isInitialLoading = localResult.isLoading && userData.length === 0;
    const isFetchingMore = localResult.isFetching && userData.length > 0;

    const fetchData = async (params: {
      targetId: string;
      cursor?: string;
      targetUserId?: string;
    }) => {
      try {
        setLocalResult({
          data: null,
          isLoading: !userData.length,
          isFetching: !!userData.length,
        });

        const fullParams =
          type === "Likers"
            ? { targetId: params.targetId, limit: 15, cursor: params.cursor }
            : {
                targetUserId: params.targetUserId!,
                limit: 15,
                cursor: params.cursor,
              };

        const result = await fetchFn(fullParams);
        setLocalResult({ data: result, isLoading: false, isFetching: false });
      } catch (e) {
        console.error("Fetch error", e);
        setLocalResult((prev) => ({
          ...prev,
          isLoading: false,
          isFetching: false,
        }));
      }
    };

    useEffect(() => {
      // setUserData([]);
      setCursor(null);
      setHasMore(true);

      const baseParams =
        type === "Likers" ? { targetId } : { targetUserId: targetId };

      fetchData(baseParams);
    }, [type, targetId]);

    useEffect(() => {
      if (!localResult.data) return;

      if (
        JSON.stringify(localResult.data) === JSON.stringify(lastDataRef.current)
      )
        return;

      const newUsers = localResult.data.users || [];
      const next = localResult.data.nextCursor ?? null;

      setUserData((prev) => (isPaginating ? [...prev, ...newUsers] : newUsers));
      setCursor(next);
      setHasMore(Boolean(next));
      setIsPaginating(false);
      lastDataRef.current = localResult.data;
    }, [localResult.data]);

    const fetchMore = async () => {
      if (!hasMore || isFetchingMore || isPaginating) return;

      const moreParams =
        type === "Likers"
          ? { targetId, cursor }
          : { targetUserId: targetId, cursor };

      setIsPaginating(true);
      await fetchData(moreParams);
    };

    return (
      <View
        // onStartShouldSetResponder={() => true}
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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#12956B", "#6E7A81"]}
                tintColor="#6E7A81"
                progressBackgroundColor="#181A1B"
              />
            }
            onEndReached={fetchMore}
            onEndReachedThreshold={1}
            initialNumToRender={10}
            windowSize={10}
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
  }
);

export default UserList;
