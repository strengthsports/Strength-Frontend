import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TextInput } from "react-native";
import { Avatar, Divider, IconButton } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import PageThemeView from "~/components/PageThemeView";
import TextScallingFalse from "~/components/CentralText";
import { AppDispatch, RootState } from "@/reduxStore";
import { fetchTeamDetails } from "~/reduxStore/slices/team/teamSlice";

interface Message {
  id: number;
  text: string;
  userId: string;
  timestamp: string;
}

const TeamForum: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const router = useRouter();
  const { teamId } = useLocalSearchParams(); // Extract teamId from route params
  const dispatch = useDispatch<AppDispatch>();
  const { team, loading } = useSelector((state: RootState) => state.team);
  const {user} = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    if (teamId) {
      dispatch(fetchTeamDetails(teamId as string)); // Fetch team details based on teamId
    }
  }, [teamId]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem(`teamForumMessages-${teamId}`);
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };
    loadMessages();
  }, [teamId]);

  useEffect(() => {
    if (messages.length > 0) {
      AsyncStorage.setItem(`teamForumMessages-${teamId}`, JSON.stringify(messages));
    }
  }, [messages, teamId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now(),
        text: newMessage.trim(),
        userId: "user123", // Replace with the actual user ID from auth state
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage("");
    }
  };

  const getUserDetails = (userId: string) => {
    return team?.members.find((member) => member.id === userId) || {
      name: "Unknown",
      profileImage: null,
    };
  };

  return (
    <PageThemeView>
      {/* Header Section */}
      <View className="flex-row items-center justify-between py-2 px-4">
        <IconButton icon="arrow-left" color="white" onPress={() => router.back()} />
        <View className="flex-row items-center  space-x-3">
          {team?.logo ? (
            <Image source={{ uri: team.logo.url }} className="w-12 h-12 mr-3 rounded-full bg-gray-500" />
          ) : (
            <Avatar.Text size={48} label={team?.name ? team.name[0] : "T"} className="bg-gray-600" />
          )}
          <TextScallingFalse className="text-white text-lg font-bold">
            {team?.name || "Team Chat"}
          </TextScallingFalse>
        </View>
        <IconButton icon="dots-vertical" color="white" />
      </View>
      <Divider className="bg-gray-600" />

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          // const user = getUserDetails(item.userId);
          return (
            <View className="flex-row items-start my-2 p-3 bg-gray-800 rounded-lg mx-4">
              {user?.profilePic ? (
                <Image source={{ uri: user.profilePic }} className="w-8 h-8 rounded-full mr-3" />
              ) : (
                <Avatar.Text size={32} label={user?.firstName} className="mr-3 bg-blue-500" />
              )}
              <View>
                <Text className="text-white font-semibold">{user?.firstName}{" "+user?.lastName}</Text>
                <Text className="text-white">{item.text}</Text>
                <Text className="text-gray-400 text-xs">{item.timestamp}</Text>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Message Input Box */}
      <View className="flex-row items-center bg-gray-800 rounded-full m-4 px-4">
        <TextInput
          placeholder="Type a message..."
          placeholderTextColor="gray"
          className="flex-1 text-white"
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={handleSendMessage}
        />
        <IconButton icon="send" color="white" onPress={handleSendMessage} />
      </View>
    </PageThemeView>
  );
};

export default TeamForum;
