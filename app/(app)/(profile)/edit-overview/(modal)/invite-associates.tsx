// InviteAssociates.tsx
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import TextScallingFalse from "~/components/CentralText";
import SearchBar from "~/components/search/searchbar";
import InviteUser from "~/components/common/InviteUser";
import PageThemeView from "~/components/PageThemeView";

// Sample users data – replace with real data as needed.
const sampleUsers = [
  {
    _id: "user1",
    firstName: "John",
    lastName: "Doe",
    profilePic: "",
    headline: "Software Engineer",
    type: "associate",
  },
  {
    _id: "user2",
    firstName: "Jane",
    lastName: "Smith",
    profilePic: "",
    headline: "Product Manager",
    type: "associate",
  },
  // Add more users as needed.
];

const InviteAssociates = () => {
  const router = useRouter();
  const { searchRole } = useLocalSearchParams();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");

  // Toggle selection for a user ID.
  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handler for Send button to call API with selected IDs.
  const handleSendInvites = async () => {
    if (!selectedUsers.length) {
      Alert.alert("No Users Selected", "Please select at least one user.");
      return;
    }

    try {
      // Replace the URL and payload structure with what your API expects.
      const response = await fetch("https://your-api-url.com/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds: selectedUsers }),
      });

      if (response.ok) {
        Alert.alert("Success", "Invitations sent successfully.");
        router.back();
      } else {
        Alert.alert("Error", "Failed to send invitations.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while sending invitations.");
    }
  };

  // Filter users based on search text.
  const filteredUsers = sampleUsers.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchText.toLowerCase());
  });

  return (
    <PageThemeView>
      <View className="flex-row justify-between items-center h-16 px-5 border-b border-[#2B2B2B]">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="close" size={24} color="white" />
        </TouchableOpacity>
        <TextScallingFalse className="text-white text-5xl font-normal">
          Invite {searchRole}
        </TextScallingFalse>
        <TouchableOpacity onPress={handleSendInvites}>
          <TextScallingFalse className="text-[#12956B] text-4xl font-medium">
            Send
          </TextScallingFalse>
        </TouchableOpacity>
      </View>
      <View>
        <SearchBar
          mode="search"
          searchText={searchText}
          onChangeSearchText={setSearchText}
        />
        {/* FlatList of InviteUser components */}
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <InviteUser
              user={item}
              selected={selectedUsers.includes(item._id)}
              onSelect={handleSelectUser}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </PageThemeView>
  );
};

export default InviteAssociates;

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 10,
  },
});
