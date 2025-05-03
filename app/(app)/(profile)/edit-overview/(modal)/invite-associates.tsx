// InviteAssociates.tsx
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useMemo, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import TextScallingFalse from "~/components/CentralText";
import SearchBar from "~/components/search/searchbar";
import InviteUser from "~/components/common/InviteUser";
import PageThemeView from "~/components/PageThemeView";
import { useSuggestUsersQuery } from "~/reduxStore/api/community/communityApi";
import { Colors } from "~/constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { inviteAssociates } from "~/reduxStore/slices/user/profileSlice";
import { showFeedback } from "~/utils/feedbackToast";
import { AppDispatch, RootState } from "~/reduxStore";

const InviteAssociates = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.profile);
  const { searchRole } = useLocalSearchParams();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isInvitationSending, setInvitationSending] = useState(loading);

  const { data: users, isLoading: loadingUsers } = useSuggestUsersQuery({
    limit: 20,
    start: 0,
  });

  console.log("Users : ", users);

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
      showFeedback("No Users Selected");
      return;
    }

    setInvitationSending(true);
    await dispatch(
      inviteAssociates({
        receiverIds: selectedUsers,
        roleInPage: searchRole as string,
      })
    );

    setInvitationSending(false);
    showFeedback(
      `${selectedUsers.length} ${searchRole}es invited successfully`,
      "success"
    );
  };

  // Filter users based on search text.
  const filteredUsers = useMemo(() => {
    if (!users?.users) return [];
    return users.users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchText.toLowerCase());
    });
  }, [users, searchText]);

  return (
    <PageThemeView>
      <View className="flex-row justify-between items-center h-16 px-5 border-b border-[#2B2B2B]">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="close" size={24} color="white" />
        </TouchableOpacity>
        <TextScallingFalse className="text-white text-5xl font-normal">
          Invite {searchRole}
          {searchRole === "Coach" ? `es` : `s`}
        </TextScallingFalse>
        <TouchableOpacity
          onPress={handleSendInvites}
          disabled={selectedUsers.length === 0}
        >
          {isInvitationSending ? (
            <ActivityIndicator size="small" color={Colors.themeColor} />
          ) : (
            <TextScallingFalse
              className={`${
                selectedUsers.length === 0 ? "text-[#808080]" : "text-[#12956B]"
              } text-4xl font-medium`}
            >
              Send
            </TextScallingFalse>
          )}
        </TouchableOpacity>
      </View>
      <View>
        <SearchBar
          mode="search"
          searchText={searchText}
          onChangeSearchText={setSearchText}
        />
        {/* FlatList of InviteUser components */}
        {loadingUsers ? (
          <ActivityIndicator size="large" color={Colors.themeColor} />
        ) : (
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
        )}
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
