import React, { useState, useEffect, useRef, useCallback } from "react";
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
import debounce from "lodash.debounce";
import { RefreshControl as RControl } from "react-native";
import { Notification, NotificationType } from "~/types/others";
import {
  useGetNotificationsQuery,
  useMarkNotificationsAsReadMutation,
} from "~/reduxStore/api/notificationApi";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import NotificationNotFound from "~/components/notfound/notificationNotFound";
import TextScallingFalse from "~/components/CentralText";

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
        "Report",
        "PageInvitation",
        "JoinPageRequest",
        "Tag",
      ];
  }
};

const NotificationPage = () => {
  const { hasNewNotification } = useSelector(
    (state: RootState) => state.notification
  );
  const dispatch = useDispatch<AppDispatch>();

  const { data, isLoading, isError, isSuccess, refetch } =
    useGetNotificationsQuery();
  const [markAsRead] = useMarkNotificationsAsReadMutation();

  const [newNotificationIds, setNewNotificationIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const initialLoad = useRef(true);
  const previousData = useRef<Notification[]>([]);

  // Mark unread notifications as read when new notification flag is set
  useEffect(() => {
    if (!hasNewNotification) return;

    const markNotificationsRead = async () => {
      const unreadIds =
        data?.notifications
          ?.filter((n) => !n.isNotificationRead)
          ?.map((n) => n._id) || [];

      dispatch(resetCount());
      if (unreadIds?.length > 0) {
        await markAsRead({ notificationIds: unreadIds }).unwrap();
        dispatch(setHasNewNotification(false));
        dispatch(resetCount());
      }
    };

    markNotificationsRead();
  }, [hasNewNotification, data]);

  // Track new notifications for highlighting
  useEffect(() => {
    if (isSuccess && !initialLoad.current) {
      const newNotifications = data.notifications.filter(
        (n) => !previousData.current.some((prev) => prev._id === n._id)
      );

      if (newNotifications?.length > 0) {
        const newIds = newNotifications.map((n) => n._id);
        setNewNotificationIds((prev) => [...prev, ...newIds]);
        const timeout = setTimeout(() => {
          setNewNotificationIds((prev) =>
            prev.filter((id) => !newIds.includes(id))
          );
        }, 5000);
        return () => clearTimeout(timeout);
      }
    }

    if (isSuccess) {
      previousData.current = data.notifications;
      initialLoad.current = false;
    }
  }, [data, isSuccess]);

  const handleRefresh = debounce(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, 1000);

  // Filter and sort notifications
  const allNotifications = data?.notifications || [];
  const filtered = allNotifications
    .filter((n) => getTypesForTab(activeTab).includes(n.type))
    .sort(
      (a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
    );

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationCardLayout
        _id={item._id}
        date={item.createdAt}
        type={item.type as NotificationType}
        sender={item.sender}
        target={item.target}
        isNew={newNotificationIds.includes(item._id)}
        comment={item.comment}
      />
    ),
    [newNotificationIds]
  );

  return (
    <SafeAreaView className="flex-1 pt-6 bg-black">
      <View>
        <View className="w-full flex-row justify-between items-center px-5">
          <TextScallingFalse className="text-6xl font-normal text-white">
            Notifications
          </TextScallingFalse>
          <MaterialCommunityIcons name="tune-variant" color="#fff" size={20} />
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

      {isLoading && <ActivityIndicator size="large" color="gray" />}
      {isError && (
        <Text className="text-red-500">Failed to load notifications.</Text>
      )}

      {!isLoading && filtered?.length > 0 ? (
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
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        !isLoading && (
          <View className="flex-1 justify-center items-center">
            <NotificationNotFound type={activeTab} />
          </View>
        )
      )}
    </SafeAreaView>
  );
};

export default NotificationPage;
