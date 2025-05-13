import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import PageThemeView from "~/components/PageThemeView";
import SuggestionCard from "~/components/Cards/SuggestionCard";
import PageSuggestionCard from "~/components/Cards/PageSuggestionCard";
import TeamSuggestionCard from "~/components/Cards/TeamSuggestionCard";
import TextScallingFalse from "~/components/CentralText";
import {
  useSuggestUsersQuery,
  useGetPagesToFollowQuery,
  useGetTeamsToSupportQuery,
} from "~/reduxStore/api/community/communityApi";
import { AntDesign } from "@expo/vector-icons";
import { debounce } from "~/utils/debounce";

const More = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const suggestionType = (params.filter as string) || "user";
  const limit = 10;
  const [offset, setOffset] = useState<number>(0);
  const [items, setItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const isInitialMount = useRef(true);
  const [refreshing, setRefreshing] = useState(false);

  // Memoize query parameters to prevent unnecessary re-renders
  const baseParams = useMemo(
    () => ({
      limit,
      start: offset,
      city: params.city as string,
    }),
    [offset, params.city]
  );

  const userParams = useMemo(
    () => ({
      ...baseParams,
      sports: Boolean(params.sports),
    }),
    [baseParams, params.sports, params.popularUser]
  );

  const teamParams = useMemo(
    () => ({
      ...baseParams,
      sport: params.sport as string,
      gender: params.gender as string,
    }),
    [baseParams, params.sport, params.gender]
  );

  // Queries with stable parameters
  const userQuery = useSuggestUsersQuery(userParams, {
    skip: suggestionType !== "user",
  });
  const pageQuery = useGetPagesToFollowQuery(baseParams, {
    skip: suggestionType !== "page",
  });
  const teamQuery = useGetTeamsToSupportQuery(teamParams, {
    skip: suggestionType !== "team",
  });

  const queryResponse = useMemo(() => {
    return suggestionType === "user"
      ? userQuery
      : suggestionType === "page"
      ? pageQuery
      : teamQuery;
  }, [suggestionType, userQuery, pageQuery, teamQuery]);

  const { data, isLoading, isFetching, refetch } = queryResponse;

  useEffect(() => {
    if (data) {
      const fetched =
        data.users ||
        data.pages ||
        data.teams ||
        (Array.isArray(data) ? data : []);

      setItems((prev) => {
        if (isInitialMount.current) {
          isInitialMount.current = false;
          return fetched;
        }

        const existingIds = new Set(prev.map((item) => item._id));
        return [
          ...prev,
          ...fetched.filter((item: any) => !existingIds.has(item._id)),
        ];
      });

      setOffset(data.nextOffset ?? offset);
      setHasMore(data.hasMore ?? false);
    }
  }, [data]);

  // Reset state when params change - FIXED VERSION
  useEffect(() => {
    if (!isInitialMount.current) {
      setItems([]);
      setOffset(0);
      setHasMore(true);
      isInitialMount.current = true;
    }
  }, [suggestionType]); // Removed other dependencies

  // Stable loadMore function with debouncing
  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      // Triggered by FlatList's onEndReached
    }
  }, [isFetching, hasMore]);

  // Memoized render items
  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      switch (suggestionType) {
        case "user":
          return (
            <SuggestionCard
              user={item}
              size="regular"
              removeSuggestion={() => {}}
            />
          );
        case "page":
          return (
            <PageSuggestionCard
              user={item}
              size="regular"
              removeSuggestion={() => {}}
            />
          );
        case "team":
          return (
            <TeamSuggestionCard
              team={item}
              size="regular"
              removeSuggestion={() => {}}
            />
          );
        default:
          return null;
      }
    },
    [suggestionType]
  );

  // Store the debounced function in a ref to maintain it between renders
  const debouncedRefetch = useRef(
    debounce(async () => {
      try {
        await refetch();
      } finally {
        setRefreshing(false);
      }
    }, 500)
  ).current;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    debouncedRefetch();
  }, [debouncedRefetch]);

  // Memoized key extractor
  const keyExtractor = useCallback((item: any) => item._id, []);

  return (
    <PageThemeView>
      {/* Header */}
      <View className="flex-row w-full justify-start items-center px-3 py-1.5 relative text-center border-b border-[#181818]">
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            router.back();
            setOffset(0);
          }}
          className="mr-4 rounded-full p-2 active:bg-neutral-950"
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <View>
          <TextScallingFalse className="text-white text-4xl font-light">
            {suggestionType === "user"
              ? "People to follow"
              : suggestionType === "page"
              ? "Pages to follow"
              : "Teams to support"}
          </TextScallingFalse>
        </View>
      </View>

      {isLoading && items.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#12956B" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetching && hasMore ? (
              <ActivityIndicator
                size="small"
                color="#12956B"
                style={{ marginVertical: 20 }}
              />
            ) : null
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 10,
            paddingHorizontal: 10,
            paddingBottom: hasMore ? 120 : 0,
          }}
          numColumns={suggestionType === "user" ? 2 : 1}
          columnWrapperStyle={
            suggestionType === "user"
              ? {
                  justifyContent: "space-evenly",
                  width: "auto",
                  marginTop: 16,
                  gap: 8,
                }
              : undefined
          }
          removeClippedSubviews
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
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
            <View className="flex-1 justify-center items-center">
              <TextScallingFalse className="text-[#808080]">
                No suggestions found
              </TextScallingFalse>
            </View>
          }
        />
      )}
    </PageThemeView>
  );
};

export default More;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
