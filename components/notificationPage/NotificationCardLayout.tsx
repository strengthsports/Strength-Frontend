import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { Dialog, Portal, Button } from "react-native-paper";
import TextScallingFalse from "../CentralText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { getToken } from "~/utils/secureStore";
import nopic from "@/assets/images/nopic.jpg";
import { formatTimeAgo } from "~/utils/formatTime";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  profilePic?: string | null;
  type?: string;
}

interface Target {
  _id: string;
  assets?: any[];
  caption?: string;
  type?: string;
  [key: string]: any;
}

interface NotificationCardProps {
  _id: string;
  type: string;
  date: string | Date;
  sender?: User;
  target?: Target;
  createdAt?: string | Date;
}

const NotificationCardLayout: React.FC<NotificationCardProps> = ({
  type = "",
  date = new Date(),
  sender = {},
  target = {},
  _id = "",
}) => {
  const router = useRouter();
  const currentUser = useSelector((state: any) => state?.profile?.user);
  const userId = currentUser?._id;
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const serializedUser = sender?._id
    ? encodeURIComponent(JSON.stringify({ id: sender._id, type: sender?.type }))
    : "";

  const renderTextsOnTypes = (notificationType: string): string => {
    switch (notificationType) {
      case "Like":
        return "liked your post";
      case "Comment":
        return "commented on your post";
      case "Follow":
        return "started following you";
      case "TeamInvitation":
        return "is inviting you to join the team";
      case "JoinTeamRequest":
        return "requested to join your team";
      case "Report":
        return "You are reported";
      default:
        return "";
    }
  };

 // Add this utility function at the top of your component
const withRetry = async (fn: () => Promise<any>, retries = 2, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise(res => setTimeout(res, delay));
    return withRetry(fn, retries - 1, delay);
  }
};

// Then modify your handleAccept to use it:
const handleAccept = async () => {
  setLoading(true);
  try {
    const token = await getToken("accessToken");
    if (!token) throw new Error("Authentication token missing");

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/accept-teamInvitation`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          teamId: target._id,
          notificationId: _id,
          senderId: sender._id,
          userId: userId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to accept invitation");
    }

    // Handle success response
    const data = await response.json();
    console.log("Invitation accepted successfully", data);
  } catch (error) {
    console.error("Error accepting invitation:", error);
  } finally {
    setLoading(false);
  }
};




  const handleReject = async () => {
    if (!_id) {
      Alert.alert("Error", "Missing notification ID");
      return;
    }
    
    setLoading(true);
    try {
      const token = await getToken("accessToken");
      if (!token) {
        throw new Error("Authentication token missing");
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/team/reject-invitation`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            notificationId: _id,
            userId: userId,
          }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to reject invitation");
      }

      Alert.alert("Success", "Team invitation rejected");
      setModalVisible(false);
    } catch (error: any) {
      console.error("Reject invitation error:", error);
      Alert.alert("Error", error.message || "An error occurred while rejecting the invitation");
    } finally {
      setLoading(false);
    }
  };

  if (!_id || !type || !date) {
    return (
      <View className="flex-row w-full min-w-[320px] lg:min-w-[400px] max-w-[600px] rounded-lg py-3">
        <View className="w-12 h-12 rounded-full bg-gray-700" />
        <View className="flex-1 pl-3 justify-center">
          <Text className="text-gray-400">Notification data unavailable</Text>
        </View>
      </View>
    );
  }

  if (!sender?._id) {
    return (
      <View className="flex-row w-full min-w-[320px] lg:min-w-[400px] max-w-[600px] rounded-lg py-3">
        <View className="w-12 h-12 rounded-full bg-gray-700" />
        <View className="flex-1 pl-3 justify-center">
          <Text className="text-gray-400">Sender information missing</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row w-full min-w-[320px] lg:min-w-[400px] max-w-[600px] rounded-lg py-3">
      {/* Profile Image */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (!sender._id) return;
          userId === sender._id
            ? router.push("/(app)/(tabs)/profile")
            : router.push(`../(profile)/profile/${serializedUser}`);
        }}
        className="w-12 h-12 rounded-full justify-center items-center flex-shrink-0"
      >
        <Image
          source={sender.profilePic ? { uri: sender.profilePic } : nopic}
          className="w-10 h-10 rounded-full"
          style={{ maxWidth: 50, maxHeight: 50 }}
        />
      </TouchableOpacity>

      {/* Notification Content */}
      <View className="flex-1 pl-3 justify-center">
        <View className="flex-row justify-between items-center">
          <TextScallingFalse className="text-white text-lg flex-1">
            {sender.firstName || ""} {sender.lastName || ""}{" "}
            <TextScallingFalse className="font-bold">
              {renderTextsOnTypes(type)}
            </TextScallingFalse>{" "}
            {formatTimeAgo(date)}
          </TextScallingFalse>

          {/* Action Buttons */}
          {type === "Follow" ? (
            <TouchableOpacity className="px-4 py-2 rounded-md bg-[#0d6e50]">
              <TextScallingFalse className="text-white text-base">
                Follow
              </TextScallingFalse>
            </TouchableOpacity>
          ) : type === "TeamInvitation" ? (
            <TouchableOpacity
              className="px-4 py-2 rounded-md bg-[#167b53]"
              onPress={() => setModalVisible(true)}
            >
              <TextScallingFalse className="text-white text-base">
                Join
              </TextScallingFalse>
            </TouchableOpacity>
          ) : (
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={18}
              color="#808080"
            />
          )}
        </View>
      </View>

      {/* Invitation Modal */}
      {modalVisible && (
        <Portal>
          <BlurView
            intensity={8}
            tint="dark"
            className="absolute inset-0 flex justify-center items-center"
          >
            <Dialog
              visible={modalVisible}
              onDismiss={() => !loading && setModalVisible(false)}
              style={{
                backgroundColor: "black",
                borderRadius: 20,
                padding: 15,
                marginHorizontal: 30,
              }}
            >
              <Dialog.Title
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Team Invitation
              </Dialog.Title>
              <Dialog.Content>
                <Text
                  style={{ color: "#ccc", fontSize: 16, textAlign: "center" }}
                >
                  {sender.firstName || ""} {sender.lastName || ""} has invited
                  you to join the team.
                </Text>
              </Dialog.Content>
              <Dialog.Actions
                style={{ justifyContent: "space-evenly", marginTop: 10 }}
              >
                <Button
                  onPress={handleReject}
                  mode="contained"
                  disabled={loading}
                  style={{
                    backgroundColor: "#e74c3c",
                    borderRadius: 10,
                    paddingVertical: 3,
                    paddingHorizontal: 9,
                  }}
                >
                  <Text className="text-white">Reject</Text>
                </Button>
                <Button
                  onPress={handleAccept}
                  mode="contained"
                  disabled={loading}
                  style={{
                    backgroundColor: "#27ae60",
                    borderRadius: 10,
                    paddingVertical: 3,
                    paddingHorizontal: 9,
                  }}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text className="text-white">Accept</Text>
                  )}
                </Button>
              </Dialog.Actions>
            </Dialog>
          </BlurView>
        </Portal>
      )}
    </View>
  );
};

export default NotificationCardLayout;