import React, { useState, useEffect, useRef } from "react";
import { View, Text, SectionList, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/reduxStore";
import {
  fetchNotifications,
  setHasNewNotification,
} from "~/reduxStore/slices/notification/notificationSlice";
import NotificationCardLayout from "~/components/notificationPage/NotificationCardLayout";
import GroupedNotificationCard from "~/components/notificationPage/GroupedNotificationCard";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";
import debounce from "lodash.debounce";
import { RefreshControl } from "react-native";
import { Notification, NotificationType } from "~/types/others";
import { useGetNotificationsQuery } from "~/reduxStore/api/notificationApi";

type GroupedSection = {
  title: string;
  data: Cluster[];
};

export type Cluster = {
  type: string;
  target: any;
  notifications: Notification[];
  latestNotification: Notification;
};

const NotificationPage = () => {
  const { hasNewNotification } = useSelector(
    (state: RootState) => state.notification
  );

  const {
    data: notifications = [],
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useGetNotificationsQuery(null);

  const [newNotificationIds, setNewNotificationIds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const initialLoad = useRef(true);
  const previousData = useRef<Notification[]>([]);

  // Refetch if hasNewNotification
  useEffect(() => {
    if (hasNewNotification) {
      console.log("Refetching...");
      refetch();
      setHasNewNotification(false);
    }
  }, [hasNewNotification]);

  // Track new notifications
  useEffect(() => {
    if (isSuccess && !initialLoad.current) {
      // Find new notifications that weren't in previous data
      const newNotifications = notifications.filter(
        (notification: Notification) =>
          !previousData.current.some((n) => n._id === notification._id)
      );

      // Update new notification IDs
      if (newNotifications.length > 0) {
        const newIds = newNotifications.map((n) => n._id);
        setNewNotificationIds((prev) => [...prev, ...newIds]);

        // Clear highlight after 5 seconds
        const timeout = setTimeout(() => {
          setNewNotificationIds((prev) =>
            prev.filter((id) => !newIds.includes(id))
          );
        }, 5000);

        return () => clearTimeout(timeout);
      }
    }

    if (isSuccess) {
      previousData.current = notifications;
      initialLoad.current = false;
    }
  }, [notifications, isSuccess]);

  const groupNotifications = (
    notifications: Notification[]
  ): GroupedSection[] => {
    if (!Array.isArray(notifications)) {
      console.error("Expected array for notifications, got:", notifications);
      return [];
    }

    const now = moment();
    const grouped: GroupedSection[] = [
      { title: "Today", data: [] },
      { title: "Yesterday", data: [] },
      { title: "This Week", data: [] },
      { title: "2 Weeks Ago", data: [] },
    ];

    notifications.forEach((notification) => {
      if (!notification?.createdAt) return;

      const createdAt = moment(notification.createdAt);
      const daysDiff = now.diff(createdAt, "days");

      if (daysDiff === 0) {
        grouped[0].data.push(notification);
      } else if (daysDiff === 1) {
        grouped[1].data.push(notification);
      } else if (daysDiff <= 7) {
        grouped[2].data.push(notification);
      } else if (daysDiff <= 14) {
        grouped[3].data.push(notification);
      }
    });

    // Cluster notifications within each time group
    return grouped
      .map((section) => ({
        title: section.title,
        data: clusterNotifications(section.data),
      }))
      .filter((section) => section.data.length > 0);
  };

  const clusterNotifications = (notifications: Notification[]): Cluster[] => {
    if (!Array.isArray(notifications)) {
      console.error("Expected array for clustering, got:", notifications);
      return [];
    }

    const clusterMap = new Map<string, Notification[]>();

    notifications.forEach((notification) => {
      if (!notification?.type || !notification?.target?._id) return;

      const key = `${notification.type}-${notification.target._id}`;
      const cluster = clusterMap.get(key) || [];
      clusterMap.set(key, [...cluster, notification]);
    });

    return Array.from(clusterMap.entries()).map(([key, notifications]) => {
      const sorted = [...notifications].sort(
        (a, b) =>
          moment(b?.createdAt).valueOf() - moment(a?.createdAt).valueOf()
      );

      return {
        type: sorted[0]?.type || "",
        target: sorted[0]?.target || null,
        notifications: sorted,
        latestNotification: sorted[0],
      };
    });
  };

  const handleRefresh = debounce(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, 1000);

  const groupedNotifications = groupNotifications(notifications);

  return (
    <SafeAreaView className="flex-1 p-6 pb-16 bg-black">
      <Text className="text-6xl font-normal text-white mb-4">
        Notifications
      </Text>

      {isLoading && <LoadingIndicator />}
      {isError && <ErrorIndicator />}

      {groupedNotifications.length > 0 ? (
        <SectionList
          sections={groupedNotifications}
          keyExtractor={(item) => item.latestNotification._id}
          renderItem={({ item: cluster }) => (
            <NotificationCluster
              cluster={cluster}
              isNew={cluster.notifications.some((n) =>
                newNotificationIds.includes(n._id)
              )}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <SectionHeader title={title} />
          )}
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
        />
      ) : (
        <EmptyState />
      )}
    </SafeAreaView>
  );
};

const NotificationCluster = ({
  cluster,
  isNew,
}: {
  cluster: Cluster;
  isNew: boolean;
}) => {
  if (!cluster?.notifications || !Array.isArray(cluster.notifications)) {
    return null;
  }

  if (cluster.notifications.length > 1) {
    return <GroupedNotificationCard cluster={cluster} isNew={isNew} />;
  }

  const notification = cluster.notifications[0];
  return (
    <NotificationCardLayout
    _id={notification?._id}
      date={notification?.createdAt}
      type={notification?.type as NotificationType}
      sender={notification?.sender}
      target={notification?.target}
      isNew={isNew}
    />
  );
};

const LoadingIndicator = () => (
  <View className="flex-1 justify-center items-center">
    <ActivityIndicator size="large" color={Colors.themeColor} />
  </View>
);

const ErrorIndicator = () => (
  <View className="flex-1 justify-center items-center">
    <Text className="text-red-500">Failed to load notifications.</Text>
  </View>
);

const SectionHeader = ({ title }: { title: string }) => (
  <Text className="text-[#808080] text-2xl font-bold my-2">{title}</Text>
);

const EmptyState = () => (
  <Text className="text-gray-500 text-center text-base">
    No notifications found
  </Text>
);

export default NotificationPage;
