import React from "react";
import { View, Text, FlatList, ActivityIndicator, Image } from "react-native";
import { useGetNotificationsQuery } from "~/reduxStore/api/notificationApi";
import { ThemedText } from "@/components/ThemedText";

const Notification = () => {
  const {
    data: notifications,
    isLoading,
    isError,
  } = useGetNotificationsQuery(null);

  console.log(notifications);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <ThemedText>Loading Notifications...</ThemedText>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <ThemedText style={{ color: "red" }}>
          Failed to load notifications.
        </ThemedText>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-black">
      <ThemedText className="text-4xl font-bold text-white mb-4">
        Notifications
      </ThemedText>

      {notifications?.length === 0 ? (
        <View className="justify-center items-center mt-10">
          <ThemedText className="text-gray-400">
            No new notifications
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View className="flex-row items-center p-3 border-b border-gray-700">
              {/* Sender Profile Picture */}
              <Image
                source={{
                  uri: item.sender?._id?.profilePic,
                }}
                className="w-12 h-12 rounded-full mr-3"
              />
              {/* Notification Details */}
              <View>
                <ThemedText className="text-white font-medium">
                  {item.sender?._id?.firstName} {item.sender?._id?.lastName}
                </ThemedText>
                <Text className="text-gray-400">{item.message}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Notification;
