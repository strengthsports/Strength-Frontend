import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import PageThemeView from "~/components/PageThemeView";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import { useRouter, useLocalSearchParams } from "expo-router";
import { fetchTeamDetails } from "~/reduxStore/slices/team/teamSlice";
import TextScallingFalse from "~/components/CentralText";
import { Colors } from "~/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import MembersSection from "~/components/profilePage/MembersSection";
import { Member } from "~/types/user";
import UserInfoModal from "~/components/modals/UserInfoModal";
import { AssociateProvider, useAssociate } from "~/context/UseAssociate";
import BackIcon from "~/components/SvgIcons/Common_Icons/BackIcon";
import { useFocusEffect } from "@react-navigation/native";

// Interface for our section data structure
interface SectionData {
  key: string;
  title: string;
  data: any[];
}

// Interface for our rendered item
interface RenderItemData {
  item: SectionData;
}

const Members: React.FC = () => {
  const router = useRouter();
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const { user } = useSelector((state: RootState) => state.profile);
  const { team, loading } = useSelector((state: RootState) => state.team);
  const dispatch = useDispatch<AppDispatch>();
  const [searchText, setSearchText] = useState("");
  const { isModalOpen, selectedMember, closeModal } = useAssociate();

  const isAdmin = user?._id === team?.admin?.[0]?._id;

  // Fetch team details only once when component mounts or team ID changes
  useEffect(() => {
    if (team?._id) {
      dispatch(fetchTeamDetails(team._id));
    }
  }, [team?._id, dispatch]);

  useFocusEffect(
    useCallback(() => {
      if (teamId) {
        dispatch(fetchTeamDetails(teamId));
      }
    }, [teamId, dispatch])
  );
  
  // Function to capitalize first letter of each word
  const capitalizeWords = (str: string): string => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Normalize roles to categories based on team's playerTypes
  const normalizeRole = useCallback((role: string | undefined): string => {
    if (!role) return "All-Rounders";
    
    // Get available player types from team details
    const playerTypes = team?.playerTypes || [];
    
    // Find matching player type (case-insensitive)
    const matchedType = playerTypes.find(
      (type: string) => type.toLowerCase() === role.toLowerCase()
    );
    
    // If exact match found in playerTypes, use that
    if (matchedType) {
      return capitalizeWords(matchedType);
    }
    
    // Otherwise, try to match common variations
    const lowerRole = role.toLowerCase();
    
    if (lowerRole.includes("bowl")) return "Bowlers";
    if (lowerRole.includes("bat")) return "Batters";
    if (lowerRole.includes("all") || lowerRole.includes("round")) return "All-Rounders";
    if (lowerRole.includes("keep")) return "Keepers";
    
    // If no match found, capitalize the original role
    return capitalizeWords(role);
  }, [team?.playerTypes]);

  // Memoize the filtered members based on search text
  const filteredMembers = useMemo(() => {
    if (!team?.members) return [];
    
    if (!searchText.trim()) {
      return team.members;
    }
    
    const query = searchText.toLowerCase();
    return team.members.filter((m: any) => {
      if (!m.user) return false;
      const fullName = `${m.user.firstName} ${m.user.lastName}`.toLowerCase();
      return (
        m.user.firstName.toLowerCase().includes(query) ||
        m.user.lastName.toLowerCase().includes(query) ||
        fullName.includes(query)
      );
    });
  }, [searchText, team?.members]);

  // Transform the filtered members into a format suitable for FlatList
  const sectionsData = useMemo(() => {
    if (!filteredMembers.length) return [];

    const groupedMembers: Record<string, Member[]> = {};
    
    // Group members by normalized role
    filteredMembers.forEach((member: any) => {
      const roleKey = normalizeRole(member.role);
      groupedMembers[roleKey] = groupedMembers[roleKey] || [];
      groupedMembers[roleKey].push(member);
    });

    // Convert to array format for FlatList
    return Object.keys(groupedMembers).map(role => {
      const members = groupedMembers[role];
      const users = members
        .filter(member => member.user !== null)
        .map(member => ({
          ...member.user,
          role: member.role,
          position: member.position,
        }));

      return {
        key: role,
        title: role,
        data: users
      };
    });
  }, [filteredMembers, normalizeRole]);

  // Clear search function
  const clearSearch = useCallback(() => {
    setSearchText("");
  }, []);

  // Render a section (role header + members)
  const renderSection = useCallback(({ item }: RenderItemData) => {
    return (
      <View>
        <TextScallingFalse
          className="text-[#8A8A8A]"
          style={{
            fontFamily: "Montserrat",
            fontWeight: "600",
            fontSize: 16,
            marginLeft: 20,
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          {item.title}
        </TextScallingFalse>
        <MembersSection
          members={item.data}
          isEditView={true}
          isAdmin={isAdmin}
        />
      </View>
    );
  }, [isAdmin]);

  // Render empty component
  const renderEmptyList = useCallback(() => (
    <View style={styles.noResultsContainer}>
      <TextScallingFalse style={styles.noResultsText}>No members found</TextScallingFalse>
    </View>
  ), []);

  if (loading) {
    return (
      <PageThemeView>
        <ActivityIndicator animating color="white" size="large" />
      </PageThemeView>
    );
  }

  return (
    <>
      <PageThemeView>
        {/* Header */}
        <View className="flex-row justify-between items-center h-14 px-5 border-b border-[#2B2B2B]">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <BackIcon/>
            </TouchableOpacity>
          </View>
          <TextScallingFalse style={{ color: 'white', fontSize: 16, fontWeight: "600" }}>
            Members
          </TextScallingFalse>

          <TouchableOpacity>
            <TextScallingFalse style={{ color: 'black', fontSize: 16 }}>Edit</TextScallingFalse>
          </TouchableOpacity>
        </View>

        {/* Custom Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <AntDesign
              name="search1"
              size={20}
              color="#8A8A8A"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search members..."
              placeholderTextColor="#8A8A8A"
              value={searchText}
              onChangeText={setSearchText}
              autoCapitalize="none"
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={clearSearch}
                style={styles.clearButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <AntDesign name="close" size={16} color="#8A8A8A" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <FlatList
            data={sectionsData}
            renderItem={renderSection}
            keyExtractor={(item) => item.key}
            ListEmptyComponent={renderEmptyList}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            initialNumToRender={5}
            maxToRenderPerBatch={3}
            windowSize={5}
            contentContainerStyle={{ paddingBottom: 400 }}
          />
        </View>
      </PageThemeView>
      <UserInfoModal
        visible={isModalOpen}
        onClose={closeModal}
        member={selectedMember}
        isTeam={true}
      />
    </>
  );
};

const Associates = () => {
  return (
    <PageThemeView>
      <AssociateProvider>
        <Members />
      </AssociateProvider>
    </PageThemeView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: "black",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#262626",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 38,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#B4B4B4",
    fontSize: 14,
    fontFamily: "Sanas",
  },
  clearButton: {
    padding: 5,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 90,
  },
  noResultsText: {
    color: "#8A8A8A",
    fontSize: 14,
    fontFamily: "Sanas",
  },
});

export default Associates;