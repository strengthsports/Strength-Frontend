import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, TextInput } from "react-native";
import { Avatar, Button, Divider } from "react-native-paper";
import { IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import PageThemeView from "~/components/PageThemeView";
import TextScallingFalse from "~/components/CentralText";
import Cover from "assets/images/cover.jpg"

const TeamForum: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const router = useRouter();

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <PageThemeView>
      <View className="flex-row items-center justify-between py-1 ">
        <IconButton icon="arrow-left" color="white" onPress={() => router.back()} />
        <View className="flex-row items-center justify-between space-x-3">
          <Image source={Cover} className="w-12 h-12 rounded-full mr-4 bg-gray-500" />
          <TextScallingFalse className="text-white text-lg font-bold">Hello Team</TextScallingFalse>
        </View>
        <IconButton icon="dots-vertical" color="white" onPress={() => {}} />
      </View>
      <Divider className="bg-gray-600" />
      
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="p-4 bg-gray-800 my-2 rounded-lg">
            <Text className="text-white text-base">{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View className="flex-row items-center bg-gray-700 rounded-full m-2 px-4 mt-4">
        <TextInput
          placeholder="Type a message..."
          placeholderTextColor="gray"
          className="flex-1 text-white py-2"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <IconButton icon="send" color="white" onPress={handleSendMessage} />
      </View>
    </PageThemeView>
  );
};

export default TeamForum;
