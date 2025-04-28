import { View, Text, TouchableOpacity, TextInput, FlatList, Image, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import PageThemeView from "~/components/PageThemeView";
import Icon from "react-native-vector-icons/AntDesign";
// import { RelativePathString, useRouter } from "expo-router";
import { Divider, Avatar, ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
// import { useSelector } from "react-redux";
import { useRouter, useLocalSearchParams, RelativePathString } from "expo-router";
// import { RootState } from "@/reduxStore";
import SearchIcon from "~/components/SvgIcons/Common_Icons/SearchIcon";
import DownwardDrawer from "@/components/teamPage/DownwardDrawer";
import nopic from "../../../../../../assets/images/nopic.jpg";
import { fetchTeamDetails } from "~/reduxStore/slices/team/teamSlice";
import TextScallingFalse from "~/components/CentralText";
import BackIcon from "~/components/SvgIcons/Common_Icons/BackIcon";
import Edit from "../../../../../../components/SvgIcons/teams/Edit"
import { Colors } from "~/constants/Colors";
import SearchBar from "~/components/search/searchbar";
import { AntDesign } from "@expo/vector-icons";
import InviteUser from "~/components/common/InviteUser";
import MembersSection from "~/components/profilePage/MembersSection";
import { Member } from "~/types/user";
import UserInfoModal from "~/components/modals/UserInfoModal";
import { AssociateProvider, useAssociate } from "~/context/UseAssociate";


// Define TypeScript Interfaces
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  headline: string;
}


const Members: React.FC = () => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.profile);
  const { team, loading } = useSelector((state: RootState) => state.team);
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  // const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDownwardDrawer, setShowDownwardDrawer] = useState(false);
  const [searchText, setSearchText] = useState("");

  const {
      setSelectMode,
      isSelectModeEnabled,
      selectedMembers,
      openInviteModal,
      isModalOpen,
      selectedMember,
      isInviteModalOpen,
      closeModal,
      closeInviteModal,
    } = useAssociate();

  const isAdmin = user?._id === team?.admin?.[0]?._id;

  // Normalize roles to categories
  const normalizeRole = (role: string | undefined): string => {
    if (!role) return "All-Rounders"; // or whatever default you prefer
    
    const lower = role.toLowerCase();
    if (lower.includes("bowl")) return "Bowlers";
    if (lower.includes("bat")) return "Batters";
    if (lower.includes("allround")) return "Allrounders";
    if (lower.includes("wicket")) return "Wicketkeepers";
    return role;
  };

  const groupMembersByRole = (members: Member[]): Record<string, Member[]> => {
    return members.reduce((acc, member) => {
      const roleKey = normalizeRole(member.role);
      acc[roleKey] = acc[roleKey] || [];
      acc[roleKey].push(member);
      return acc;
    }, {} as Record<string, Member[]>);
  };

  useEffect(() => {
     dispatch(fetchTeamDetails(team?._id));
        //  console.log("Team:---->",team?.members);
    if (team?.members) {
      setFilteredMembers(team.members);
    }
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMembers(team?.members || []);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = team?.members?.filter(
        (m) =>
          m.user.firstName.toLowerCase().includes(query) ||
          m.user.lastName.toLowerCase().includes(query)
      ) || [];
      setFilteredMembers(filtered);
    }
  }, [searchQuery, team?.members]);

  if (loading) {
    return (
      <PageThemeView>
        <ActivityIndicator animating color="white" size="large" />
      </PageThemeView>
    );
  }

  const groupedMembers = groupMembersByRole(filteredMembers);
  // console.log("Gtjfugf",groupedMembers);
  return (
    <><PageThemeView>
        {/* Header */}
        <View className="flex-row justify-between items-center h-16 px-5 border-b border-[#2B2B2B]">
          <View className="flex-row items-center">
              <TouchableOpacity onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={24} color="white" />
              </TouchableOpacity>
          </View>
          <TextScallingFalse className="text-white text-5xl">
            Members
          </TextScallingFalse>
            <TouchableOpacity
              // onPress={handleRemoveSelected}
              // disabled={selectedMembers.length === 0}
            >
              <TextScallingFalse
                className={`text-4xl`}
              >
                Edit
              </TextScallingFalse>
            </TouchableOpacity>
        </View>

        <View>
          <SearchBar
            mode="search"
            placeholder="Search associated members..."
            searchText={searchText}
            onChangeSearchText={setSearchText}
          />

{filteredMembers.length > 0 && (
  <>
    {Object.entries(groupedMembers).map(([role, members]) => {
      // Filter out null users and extract just the user objects
      const users = members
        .filter(member => member.user !== null)
        .map(member => member.user);
      
      return (
        <React.Fragment key={role}>
          <TextScallingFalse
            className="text-[#8A8A8A]"
            style={{
              fontFamily: "Montserrat",
              fontWeight: "600",
              fontSize: 16,
              marginLeft: 20,
              marginBottom: 10,

            }}
          >
            {role}
          </TextScallingFalse>
          <MembersSection 
            members={users} 
            isEditView={true}
            isAdmin={user._id === team.admin[0]._id}
          />
        </React.Fragment>
      );
    })}
  </>
)}        
</View>

      </PageThemeView>
      <UserInfoModal
        visible={isModalOpen}
        onClose={closeModal}
        member={selectedMember}
      />
      </>
  );
};

export const Associates = () => {
  return (
    <PageThemeView>
      <AssociateProvider>
        <Members />
      </AssociateProvider>
    </PageThemeView>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 10,
  },
});

export default Members;
