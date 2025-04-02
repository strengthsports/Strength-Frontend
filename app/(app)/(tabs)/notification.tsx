import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  SectionList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useGetNotificationsQuery } from "~/reduxStore/api/notificationApi";
import NotificationCardLayout from "~/components/notificationPage/NotificationCardLayout";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";
import debounce from "lodash.debounce";
import { Notification } from "~/types/others";

type GroupedNotification = {
  title: string;
  data: Notification[];
};

const TIME_CATEGORIES = {
  TODAY: "Today",
  YESTERDAY: "Yesterday",
  ONE_WEEK_AGO: "1 Week Ago",
  TWO_WEEKS_AGO: "2 Weeks Ago",
} as const;

const NotificationPage = () => {
  const { data = [], isLoading, isError, refetch } = useGetNotificationsQuery(null);
  const [refreshing, setRefreshing] = useState(false);

  const groupNotificationsByTime = (notifications: Notification[]): GroupedNotification[] => {
    const now = moment();
    const grouped: Record<string, Notification[]> = {
      [TIME_CATEGORIES.TODAY]: [],
      [TIME_CATEGORIES.YESTERDAY]: [],
      [TIME_CATEGORIES.ONE_WEEK_AGO]: [],
      [TIME_CATEGORIES.TWO_WEEKS_AGO]: [],
    };

    notifications.forEach((notification) => {
      const createdAt = moment(notification.createdAt);
      const daysDiff = now.diff(createdAt, "days");

      if (daysDiff === 0) grouped[TIME_CATEGORIES.TODAY].push(notification);
      else if (daysDiff === 1) grouped[TIME_CATEGORIES.YESTERDAY].push(notification);
      else if (daysDiff <= 7) grouped[TIME_CATEGORIES.ONE_WEEK_AGO].push(notification);
      else if (daysDiff <= 14) grouped[TIME_CATEGORIES.TWO_WEEKS_AGO].push(notification);
    });

    return Object.entries(grouped)
      .filter(([_, data]) => data.length > 0)
      .map(([title, data]) => ({ title, data }));
  };

  const handleRefresh = useCallback(
    debounce(async () => {
      if (refreshing) return;
      setRefreshing(true);
      try {
        await refetch();
      } finally {
        setRefreshing(false);
      }
    }, 1000),
    [refreshing]
  );

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <NotificationCardLayout
      _id={item._id}
      type={item.type}
      date={item.createdAt}
      sender={item.sender}
      target={item.target}
    />
  );

  const renderSectionHeader = ({ section }: { section: GroupedNotification }) => (
    <Text style={styles.sectionHeader}>
      {section.title} {section.data.length === 0 ? "(No notifications)" : ""}
    </Text>
  );

  const groupedNotifications = groupNotificationsByTime(data);

  if (isLoading && data.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.themeColor} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load notifications.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      {groupedNotifications.length > 0 ? (
        <SectionList
          sections={groupedNotifications}
          keyExtractor={(item) => item._id}
          renderItem={renderNotificationItem}
          renderSectionHeader={renderSectionHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#12956B", "#6E7A81"]}
              tintColor="#6E7A81"
              title="Refreshing Your Feed..."
              titleColor="#6E7A81"
              progressBackgroundColor="#181A1B"
            />
          }
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
        />
      ) : (
        <Text style={styles.emptyText}>No notifications found</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:-40,
    flex: 1,
    padding: 24,
    backgroundColor: Colors.black,
  },
  title: {
    fontSize: 48,
    fontWeight: "400",
    color: Colors.white,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: Colors.red500,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.gray500,
    marginVertical: 8,
  },
  emptyText: {
    color: Colors.gray500,
    textAlign: "center",
    fontSize: 18,
  },
});

export default NotificationPage;