import React, { useState } from "react";
import { View, Text, SectionList, ActivityIndicator } from "react-native";
import { useGetNotificationsQuery } from "~/reduxStore/api/notificationApi";
import NotificationCardLayout from "~/components/notificationPage/NotificationCardLayout";
import moment from "moment";
import { Colors } from "~/constants/Colors";
import debounce from "lodash.debounce";
import { RefreshControl } from "react-native";

const Notification = () => {
  // RTK Query hook that now subscribes to real-time notifications via Socket.IO
  const { data, isLoading, isError, refetch } = useGetNotificationsQuery(null);
  console.log("Notifications:", data);
  const [refreshing, setRefreshing] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState(Date.now().toString());

  // Group notifications by time periods: Today, Yesterday, 1 Week Ago, 2 Weeks Ago
  const groupNotificationsByTime = (notifications = []) => {
    const grouped = [
      { title: "Today", data: [] },
      { title: "Yesterday", data: [] },
      { title: "1 Week Ago", data: [] },
      { title: "2 Weeks Ago", data: [] },
    ];

    const now = moment();
    notifications.forEach((notification) => {
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

    // Remove empty sections
    return grouped.filter((section) => section.data.length > 0);
  };

  const notificationsData = data || [];
  const groupedNotifications = groupNotificationsByTime(notificationsData);

  // Handler to refresh the list (pull-to-refresh)
  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      setLastTimestamp(Date.now().toString());
      // dispatch(feedPostApi.util.invalidateTags(["FeedPost"]));
      console.log("Refetching feed data on refresh...");
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const debouncedRefresh = debounce(handleRefresh, 1000);

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: "black" }}>
      <Text style={{ fontSize: 24, color: "white", marginBottom: 16 }}>
        Notifications
      </Text>

      {isLoading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors.themeColor} />
        </View>
      )}

      {isError && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "red" }}>Failed to load notifications.</Text>
        </View>
      )}

      {groupedNotifications.length > 0 ? (
        <SectionList
          sections={groupedNotifications}
          keyExtractor={(item) =>
            item.notificationId
              ? item.notificationId.toString()
              : item._id.toString()
          }
          renderItem={({ item }) => (
            <NotificationCardLayout
              date={item.createdAt}
              type={item.type}
              sender={item.sender}
              target={item.target}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#808080",
                marginVertical: 8,
              }}
            >
              {title}
            </Text>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={debouncedRefresh}
              colors={["#12956B", "#6E7A81"]}
              tintColor="#6E7A81"
              title="Refreshing Your Feed..."
              titleColor="#6E7A81"
              progressBackgroundColor="#181A1B"
            />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        !isLoading && (
          <Text style={{ color: "#808080", textAlign: "center", fontSize: 24 }}>
            No notifications found
          </Text>
        )
      )}
    </View>
  );
};

export default Notification;
