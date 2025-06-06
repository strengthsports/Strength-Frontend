import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import {
  resetCount,
  setHasNewNotification,
} from "~/reduxStore/slices/notification/notificationSlice";
import NotificationCardLayout from "~/components/notificationPage/NotificationCardLayout";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";
import { Notification, NotificationType } from "~/types/others";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsVisitedMutation,
  useMarkNotificationsAsReadMutation,
} from "~/reduxStore/api/notificationApi";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NotificationNotFound from "~/components/notfound/notificationNotFound";
import TextScallingFalse from "~/components/CentralText";
import TooltipBox, { TooltipOption } from "~/components/ui/atom/TooltipBox";

// Tab configuration
const tabs = [
  { id: "All", label: "All" },
  { id: "Teams", label: "Teams" },
  { id: "My Posts", label: "My Posts" },
  { id: "Mentions", label: "Mentions" },
];

const getTypesForTab = (tab: any) => {
  switch (tab) {
    case "Teams":
      return ["JoinTeamRequest", "TeamInvitation"];
    case "Mentions":
      return ["Tag"];
    case "My Posts":
      return ["Like", "Comment", "Report"];
    default:
      return [
        "JoinTeamRequest",
        "TeamInvitation",
        "Follow",
        "Like",
        "Comment",
        "Reply",
        "Report",
        "PageInvitation",
        "JoinPageRequest",
        "Tag",
      ];
  }
};

type SortType = "latest" | "unread";

const NotificationPage = () => {
  const { hasNewNotification } = useSelector(
    (state: RootState) => state.notification
  );
  const dispatch = useDispatch<AppDispatch>();

  // ──── Pagination / Sorting State ─────────────────────────────────────
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortType>("latest");
  const [activeTab, setActiveTab] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  // ──── RTK Query: fetch notifications based on (page, sortBy) ─────────
  const { data, isLoading, isError, isSuccess, refetch } =
    useGetNotificationsQuery({
      page,
      limit: 10,
      sortBy,
    });

  const [markAsRead] = useMarkNotificationsAsReadMutation();
  const [markAsVisited] = useMarkNotificationAsVisitedMutation();

  // ──── Single useEffect to update `allNotifications` + pagination ───────
  useEffect(() => {
    if (!isSuccess || !data?.data?.notifications) return;

    const incomingList: Notification[] = data.data.notifications;

    if (page === 1) {
      // Page 1: replace everything
      setAllNotifications(incomingList);
      setRefreshing(false);
    } else {
      // Page > 1: append only new IDs
      setAllNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n._id));
        const onlyNew = incomingList.filter((n) => !existingIds.has(n._id));
        return [...prev, ...onlyNew];
      });
    }

    // Update hasMorePages exactly once
    if (data.data.pagination) {
      setHasMorePages(data.data.pagination.page < data.data.pagination.pages);
    } else {
      setHasMorePages(false);
    }

    // Turn off loading flags
    setLoadingMore(false);
    setIsFetching(false);
  }, [data, isSuccess, page]);

  // ──── Mark all unread notifications as read if `hasNewNotification` is true ─
  useEffect(() => {
    if (allNotifications.length === 0) return;

    const markNotificationsRead = async () => {
      const unreadIds = allNotifications
        .filter((n) => !n.isNotificationRead)
        .map((n) => n._id);

      if (unreadIds.length > 0 || hasNewNotification) {
        try {
          await markAsRead(null).unwrap();
          dispatch(setHasNewNotification(false));
          dispatch(resetCount());
        } catch (error) {
          console.error("Failed to mark notifications as read:", error);
        }
      }
    };

    markNotificationsRead();
  }, [hasNewNotification, allNotifications, dispatch, markAsRead]);

  // ──── Mark a notification as visited
  const handleMarkNotificationVisited = useCallback(
    async (notificationId: string) => {
      try {
        await markAsVisited({ notificationId }).unwrap();
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    },
    []
  );

  // ──── Reset to page 1 when sortBy changes (no manual refetch()) ──────────
  useEffect(() => {
    setPage(1);
    // setAllNotifications([]);
  }, [sortBy]);

  // ──── Pull‐to‐refresh: set page = 1, clear list ────────────────────────
  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    if (page === 1) {
      refetch()
        .unwrap()
        .finally(() => setRefreshing(false));
    } else {
      setPage(1);
      setAllNotifications([]);
      // RTK Query will fetch page 1 automatically, so wait for data/isSuccess below:
      // In your `useEffect` that watches `isSuccess && data`, you could then:
      //   useEffect(() => {
      //     if (isSuccess && page === 1) {
      //       setRefreshing(false);
      //     }
      //   }, [isSuccess, page]);
    }
  }, [page, refetch]);

  // ──── Infinite scroll: increment `page` if there are more ─────────────
  const handleLoadMore = useCallback(() => {
    if (!isFetching && hasMorePages && !loadingMore) {
      setLoadingMore(true);
      setIsFetching(true);
      setPage((prev) => prev + 1);
    }
  }, [hasMorePages, isFetching, loadingMore]);

  // ──── Filter + sort locally before rendering ─────────────────────────
  const filtered = useMemo(
    () =>
      allNotifications
        .filter((n) => getTypesForTab(activeTab).includes(n.type))
        .sort(
          (a, b) =>
            moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
        ),
    [allNotifications, activeTab]
  );

  // ──── Render each notification card ─────────────────────────────────────
  const renderItem = useCallback(({ item }: { item: Notification }) => {
    return (
      <NotificationCardLayout
        _id={item._id}
        date={item.createdAt}
        type={item.type as NotificationType}
        sender={item.sender}
        target={item.target}
        isNew={!item.isNotificationVisited} // highlight unread ones
        comment={item.comment}
        handleMarkNotificationVisited={handleMarkNotificationVisited}
      />
    );
  }, []);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-5 flex items-center justify-center">
        <ActivityIndicator size="small" color="gray" />
      </View>
    );
  };

  // ──── Tooltip options for “Sort By” ───────────────────────────────────
  const tooltipConfig: TooltipOption[] = [
    {
      label: "Sort by Latest",
      onPress: () => {
        setSortBy("latest");
      },
      type: "radio",
      selected: sortBy === "latest",
    },
    {
      label: "Sort by Unread",
      onPress: () => {
        setSortBy("unread");
      },
      type: "radio",
      selected: sortBy === "unread",
    },
  ];

  return (
    <SafeAreaView className="flex-1 pt-6 bg-black">
      <View>
        <View className="w-full flex-row justify-between items-center px-5">
          <TextScallingFalse className="text-6xl font-normal text-white">
            Notifications
          </TextScallingFalse>
          <MaterialCommunityIcons
            name="tune-variant"
            color="#fff"
            size={20}
            onPress={() => setIsTooltipVisible(true)}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row",
            justifyContent: "flex-start",
            columnGap: 12,
            paddingBottom: 12,
            paddingLeft: 15,
            marginTop: 16,
          }}
          className="border-b border-[#121212]"
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-xl border border-[#2c2c2c] ${
                activeTab === tab.id ? "bg-neutral-800" : ""
              }`}
              activeOpacity={0.7}
            >
              <TextScallingFalse
                className={`text-lg font-medium ${
                  activeTab === tab.id ? "text-white" : "text-[#BFBFBF]"
                }`}
              >
                {tab.label}
              </TextScallingFalse>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading && page === 1 && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="gray" />
        </View>
      )}

      {isError && (
        <View className="flex-1 justify-center items-center">
          <TextScallingFalse className="text-red-500">
            Failed to load notifications.{" "}
            <TextScallingFalse className="underline" onPress={handleRefresh}>
              Try again
            </TextScallingFalse>
          </TextScallingFalse>
        </View>
      )}

      {!isLoading && filtered.length > 0 ? (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.themeColor, "#6E7A81"]}
              tintColor="#6E7A81"
              progressBackgroundColor="#181A1B"
            />
          }
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        page !== 1 && (
          <View className="flex-1 justify-center items-center">
            <NotificationNotFound type={activeTab} />
          </View>
        )
      )}

      {isTooltipVisible ? (
        <TooltipBox
          config={tooltipConfig}
          onDismiss={() => setIsTooltipVisible(false)}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default NotificationPage;
