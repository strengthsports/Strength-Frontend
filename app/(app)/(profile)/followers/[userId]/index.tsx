import { StyleSheet, RefreshControl, ScrollView } from "react-native";
import React, { useState, useCallback, memo, useRef, useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import UserList, { PageType } from "~/components/ui/UserList";
import TopBar from "~/components/TopBar";
import PageThemeView from "~/components/PageThemeView";
import { debounce } from "@/utils/debounce";

const DEBOUNCE_DELAY = 1000;

const FollowerFollowing = memo(() => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const type = useMemo(() => {
    if (typeof params.pageType === "string") {
      return params.pageType.charAt(0).toUpperCase() + params.pageType.slice(1);
    }
    return "";
  }, [params.pageType]);

  const targetData = useMemo(() => {
    return params.userId
      ? JSON.parse(decodeURIComponent(params.userId as string))
      : null;
  }, [params.userId]);

  console.log("Target data ", params.userId);

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

  if (!params.userId) return null;

  return (
    <PageThemeView>
      <TopBar heading={type} backHandler={() => router.push("..")} />

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
          targetId={targetData.userId}
          type={type as PageType}
        />
      </ScrollView>
    </PageThemeView>
  );
});

export default FollowerFollowing;

const styles = StyleSheet.create({});
