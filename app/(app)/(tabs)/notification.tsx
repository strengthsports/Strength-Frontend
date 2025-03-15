import React from "react";
import { View, Text, SectionList, ActivityIndicator } from "react-native";
import { useGetNotificationsQuery } from "~/reduxStore/api/notificationApi";
import NotificationCardLayout from "~/components/notificationPage/NotificationCardLayout";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";

const Notification = () => {
  const { data, isLoading, isError } = useGetNotificationsQuery(null);
  console.log("Notifications : ", data);

  // Function to group notifications by time periods
  const groupNotificationsByTime = (notifications: any[]) => {
    const grouped: { title: string; data: any[] }[] = [
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

  const groupedNotifications = data?.formattedNotifications
    ? groupNotificationsByTime(data.formattedNotifications)
    : [];

  return (
    <SafeAreaView className="flex-1 p-6 bg-black">
      <Text className="text-6xl font-normal text-white mb-4">
        Notifications
      </Text>

      {isLoading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white">Loading Notifications...</Text>
        </View>
      )}

      {isError && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500">Failed to load notifications.</Text>
        </View>
      )}

      {groupedNotifications.length > 0 ? (
        <SectionList
          sections={groupedNotifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <NotificationCardLayout
              key={item._id}
              date={item.createdAt}
              type={item.type}
              sender={item.sender}
              target={item.target}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-3xl font-bold text-[#808080] my-2">
              {title}
            </Text>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        !isLoading && (
          <Text className="text-[#808080] text-center text-3xl">
            No notifications found
          </Text>
        )
      )}
    </SafeAreaView>
  );
};

export default Notification;
