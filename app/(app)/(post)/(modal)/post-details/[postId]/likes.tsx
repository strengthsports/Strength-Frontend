import {
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useState, useCallback, memo, useRef, useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import UserList from "~/components/ui/UserList";
import TopBar from "~/components/TopBar";
import PageThemeView from "~/components/PageThemeView";
import { debounce } from "@/utils/debounce";

const DEBOUNCE_DELAY = 1000;
const { height } = Dimensions.get("window");

const Likes = memo(() => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  console.log(params);

  const targetData = useMemo(() => {
    return params.postId
      ? JSON.parse(decodeURIComponent(params.postId as string))
      : null;
  }, [params.postId]);
  const refreshTrigger = useRef(0);

  const debouncedRefresh = useRef(
    debounce(() => {
      refreshTrigger.current += 1; // change key to trigger refetch
      setRefreshing(false);
    }, DEBOUNCE_DELAY)
  ).current;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    debouncedRefresh();
  }, [debouncedRefresh]);

  if (!targetData) return null;

  return (
    <PageThemeView>
      <TopBar heading="Likes" backHandler={() => router.push("..")} />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#12956B", "#6E7A81"]}
            tintColor="#6E7A81"
            progressBackgroundColor="#181A1B"
          />
        }
      >
        <UserList
          key={refreshTrigger.current}
          targetId={targetData.id}
          type="Likers"
        />
      </ScrollView>
    </PageThemeView>
  );
});

export default Likes;

const styles = StyleSheet.create({});
