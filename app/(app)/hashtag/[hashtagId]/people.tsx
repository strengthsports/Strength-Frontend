import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "~/reduxStore";
import TextScallingFalse from "~/components/CentralText";
import UserCard from "~/components/Cards/UserCard";
import { Colors } from "~/constants/Colors";
import {
  fetchHashtagPeople,
  HashtagPerson,
} from "~/reduxStore/slices/post/hooks";

const ITEM_HEIGHT = 60;

const PeopleScreen = ({ hashtag }: { hashtag: string }) => {
  const userId = useSelector((state: RootState) => state.profile.user?._id);
  const [people, setPeople] = useState<HashtagPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [fetchingMore, setFetchingMore] = useState(false);

  const fetchPeople = async ({
    isRefresh = false,
    cursor = null,
  }: {
    isRefresh?: boolean;
    cursor?: string | null;
  }) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await fetchHashtagPeople({
        hashtag,
        limit: 10,
        lastTimeStamp: cursor ?? undefined,
      });

      if (isRefresh) {
        setPeople(res.users);
      } else {
        setPeople((prev) => [...prev, ...res.users]);
      }

      setNextCursor(res.nextCursor);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch people");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPeople({ isRefresh: true });
  }, [hashtag]);

  const handleRefresh = () => {
    fetchPeople({ isRefresh: true });
  };

  const handleLoadMore = () => {
    if (nextCursor && !fetchingMore) {
      setFetchingMore(true);
      fetchPeople({ cursor: nextCursor }).finally(() => setFetchingMore(false));
    }
  };

  const renderFollowerItem = ({ item }: { item: HashtagPerson }) => (
    <UserCard user={item} isOwnProfile={userId === item._id} />
  );

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  if (loading && people.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator
          size="large"
          color={Colors.themeColor}
          style={styles.loader}
        />
      </View>
    );
  }

  if (error && people.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <TextScallingFalse style={styles.errorText}>
          Something went wrong.
        </TextScallingFalse>
        <TouchableOpacity activeOpacity={0.7} onPress={handleRefresh}>
          <TextScallingFalse style={styles.errorText} className="underline">
            Try Again!
          </TextScallingFalse>
        </TouchableOpacity>
      </View>
    );
  }

  if (!loading && people.length === 0) {
    return (
      <TextScallingFalse style={styles.emptyText}>
        No people found.
      </TextScallingFalse>
    );
  }

  return (
    <FlatList
      data={people}
      renderItem={renderFollowerItem}
      keyExtractor={(item, index) => item._id || index.toString()}
      contentContainerStyle={{ padding: 10 }}
      getItemLayout={getItemLayout}
      ListFooterComponent={<View style={{ marginTop: 30 }} />}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    marginTop: 30,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  emptyText: {
    color: "gray",
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
  },
});

export default PeopleScreen;
