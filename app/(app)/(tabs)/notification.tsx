import React from "react";
import { View, Text, FlatList, ActivityIndicator, Image } from "react-native";
import { useGetNotificationsQuery } from "~/reduxStore/api/notificationApi";
import { ThemedText } from "@/components/ThemedText";
import LikeCard from "~/components/notifications/LikeCard";
import NotificationCardLayout from "~/components/notifications/NotificationCardLayout";
import nopic from "@/assets/images/nopic.jpg";

const Notification = () => {
  // const {
  //   data: notifications,
  //   isLoading,
  //   isError,
  // } = useGetNotificationsQuery(null);

  // console.log(notifications);

  // if (isLoading) {
  //   return (
  //     <View className="flex-1 justify-center items-center">
  //       <ActivityIndicator size="large" color="#ffffff" />
  //       <ThemedText>Loading Notifications...</ThemedText>
  //     </View>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <View className="flex-1 justify-center items-center">
  //       <ThemedText style={{ color: "red" }}>
  //         Failed to load notifications.
  //       </ThemedText>
  //     </View>
  //   );
  // }

  return (
    <View className="flex-1 p-4 bg-black">
      <Text className="text-6xl font-semibold text-white mb-4">
        Notifications
      </Text>
      {/* Dummy */}
      <View className="justify-center items-center mt-3 gap-y-2">
        {[
          "Like",
          "Comment",
          "TeamInvitation",
          "Follow",
          "Report",
          "JoinTeamRequest",
        ].map((card, index) => (
          <NotificationCardLayout
            key={index}
            date="50 days ago"
            type={card}
            user="User1"
          />
        ))}
      </View>
    </View>
  );
};

export default Notification;
