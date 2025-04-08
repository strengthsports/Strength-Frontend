import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { Divider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";

import { AppDispatch, RootState } from "~/reduxStore";
import {
  sendInvitations,
  fetchMemberSuggestions,
} from "~/reduxStore/slices/team/teamSlice";
import TextScallingFalse from "~/components/CentralText";
import PageThemeView from "~/components/PageThemeView";

// Types
type Member = {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  headline?: string;
};

// Theme Colors
const colors = {
  background: "#000000",
  text: "#F9FAFB",
  mutedText: "#949494",
  border: "#374151",
  primary: "#12956B",
  cardBackground: "#000000",
  inputBackground: "#262626",
};

const InviteMember: React.FC = () => {
  // Hooks & Params
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { teamId = "" } = useLocalSearchParams<{ teamId: string }>();

  // Redux State
  const { user } = useSelector((state: RootState) => state.profile);
  const { members, loading, error } = useSelector(
    (state: RootState) => state.team.memberSuggestionsState
  );

  // Local State
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  // Handlers
  const handleSeeMore = () => {
    setPage((prev) => prev + 1);
    setLimit((prev) => prev + 1);
  };

  const toggleMemberSelection = useCallback((memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  }, []);

  const handleSendInvites = async () => {
    if (!teamId || selectedMemberIds.length === 0) {
      return Toast.show({
        type: "error",
        text1: "Invitation Error",
        text2: "Team ID and members are required.",
      });
    }

    try {
      setSending(true);

      const result = await dispatch(
        sendInvitations({
          teamId,
          receiverIds: selectedMemberIds,
          role: "All-Rounder",
          limit,
          page,
        })
      ).unwrap();

      const failed = result?.data?.failedInvitations || [];
      const alreadyInTeam = failed.filter(
        (f: any) => f.error === "User is already a team member"
      );

      if (alreadyInTeam.length > 0) {
        Toast.show({
          type: "error",
          text1: "Invite Failed",
          text2: `${alreadyInTeam.length} user(s) already in the team.`,
        });
      }

      const successCount = selectedMemberIds.length - failed.length;
      if (successCount > 0) {
        Toast.show({
          type: "success",
          text1: "Invitations Sent!",
          text2: `Successfully invited ${successCount} user(s).`,
        });
        navigation.goBack();
      }

      if (successCount === 0 && failed.length > 0) {
        Toast.show({
          type: "info",
          text1: "No Invitations Sent",
          text2: "All selected users could not be invited.",
        });
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Failed to Send Invites",
        text2: err?.message || "Something went wrong.",
      });
    } finally {
      setSending(false);
    }
  };

  // Search Effect
  useEffect(() => {
    // setPage(searchQuery.trim().length > 0 ? 0 : 1);
    setLimit(searchQuery.trim().length > 0 ? 1000 : 10);
  }, [searchQuery]);

  // Fetch Suggestions
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (teamId && user?._id) {
        dispatch(fetchMemberSuggestions({ teamId, userId: user._id, page, limit }));
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, dispatch, teamId, user, page, limit]);

  // Filtered List
  const filteredMembers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return members?.filter((m) =>
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(query)
    ) || [];
  }, [members, searchQuery]);

  // Render Member
  const renderMember = useCallback(
    ({ item }: { item: Member }) => {
      const fullName = `${item.firstName} ${item.lastName}`;
      const isSelected = selectedMemberIds.includes(item._id);

      return (
       <>
       
        <TouchableOpacity
          style={styles.card}
          onPress={() => toggleMemberSelection(item._id)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: item.profilePic || "https://via.placeholder.com/100" }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <TextScallingFalse style={styles.name}>{fullName}</TextScallingFalse>
            {item.headline && (
              <TextScallingFalse style={styles.headline}>
                {item.headline}
              </TextScallingFalse>
            )}
            <View style={styles.dividerLine} />
          </View>
          <Ionicons
            name={isSelected ? "checkbox" : "square-outline"}
            size={24}
            color={isSelected ? colors.primary : colors.mutedText}
          />
        </TouchableOpacity>
        </>
        
      );
    },
    [selectedMemberIds, toggleMemberSelection]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <TextScallingFalse style={styles.headerTitle}>Invite Member</TextScallingFalse>
        <TouchableOpacity onPress={handleSendInvites} disabled={sending}>
          <TextScallingFalse style={[styles.sendBtn, sending && { opacity: 0.5 }]}>
            {sending ? "Sending..." : "Send"}
          </TextScallingFalse>
        </TouchableOpacity>
      </View>

      <Divider style={styles.divider} />

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={20} color={colors.mutedText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search members..."
          placeholderTextColor={colors.mutedText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* List */}
      {loading ? (
        <Text style={styles.status}>Loading suggestions...</Text>
      ) : error ? (
        <TextScallingFalse style={[styles.status, { color: "red" }]}>{error}</TextScallingFalse>
      ) : (
        <>
          <FlatList
            data={filteredMembers}
            keyExtractor={(item) => item._id}
            renderItem={renderMember}
            contentContainerStyle={styles.list}
          />

          {filteredMembers.length >= limit && (
            <TouchableOpacity style={styles.seeMoreButton} onPress={handleSeeMore}>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default InviteMember;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  sendBtn: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  status: {
    textAlign: "center",
    color: colors.mutedText,
    marginTop: 10,
  },
  list: {
    paddingBottom: 24,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: colors.border,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "500",
  },
  headline: {
    color: colors.mutedText,
    fontSize: 12,
    marginTop: 2,
  },
  dividerLine: {
    height: 0.5,
    backgroundColor: "#313131",
    marginTop: 8,
    width: "100%",
  },
  seeMoreButton: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 22,
  },
  seeMoreText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "200",
  },
});
