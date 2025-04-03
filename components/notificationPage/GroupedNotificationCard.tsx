import React from "react";
import { Cluster } from "~/app/(app)/(tabs)/notification";
import NotificationCardLayout from "./NotificationCardLayout";
import { NotificationType } from "~/types/others";

const GroupedNotificationCard = ({
  cluster,
  isNew,
}: {
  cluster: Cluster;
  isNew: boolean;
}) => {
  const { notifications, latestNotification, type, target } = cluster;
  const count = notifications.length;
  const latestSender = latestNotification.sender;

  return (
    <NotificationCardLayout
      isNew={isNew}
      sender={latestSender}
      target={target}
      type={type as NotificationType}
      count={count}
    />
  );
};

export default GroupedNotificationCard;
