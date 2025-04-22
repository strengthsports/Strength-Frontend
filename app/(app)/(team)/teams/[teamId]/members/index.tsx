import { View, Text, TouchableOpacity, TextInput, FlatList, Image } from "react-native";
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
import SearchIcon from "~/components/SvgIcons/navbar/SearchIcon";
import DownwardDrawer from "@/components/teamPage/DownwardDrawer";
import nopic from "../../../../../../assets/images/nopic.jpg";
import { fetchTeamDetails } from "~/reduxStore/slices/team/teamSlice";
import TextScallingFalse from "~/components/CentralText";

// Define TypeScript Interfaces
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  headline: string;
}

interface Member {
  user: User;
  role: string;
}

const Members: React.FC = () => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.profile);
  const { team, loading } = useSelector((state: RootState) => state.team);
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDownwardDrawer, setShowDownwardDrawer] = useState(false);

  const isAdmin = user?._id === team?.admin?.[0]?._id;

  // Normalize roles to categories
  const normalizeRole = (role: string): string => {
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
         
    if (team?.members) {
      setFilteredMembers(team.members);
    }
  }, [team]);

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

  return (
    <PageThemeView>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-black">
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrowleft" size={28} color="white" />
        </TouchableOpacity>
        <TextScallingFalse className="text-white text-2xl font-bold">Members</TextScallingFalse>
        {isAdmin && (
          <TouchableOpacity onPress={() => router.push("/teams/settings/edit-members")}>
            <View className="flex-row items-center space-x-2">
              <Image source={require("../../../../../../assets/images/edit.png")} style={{ width: 20, height: 20 }} />
              <TextScallingFalse className="text-white text-lg">Edit</TextScallingFalse>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <Divider className="bg-gray-600" />

      {/* Search */}
      <View className="px-4 py-4">
        <View className="flex-row items-center bg-[#262626] rounded-full px-4 py-2">
          <SearchIcon className="w-5 h-5 text-gray-400" />
          <TextInput
            placeholder="Search members..."
            placeholderTextColor="gray"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="text-white TextScallingFalse-lg flex-1 ml-2"
          />
        </View>
      </View>

      {/* Members List */}
      <FlatList
        data={Object.keys(groupedMembers)}
        keyExtractor={(role) => role}
        renderItem={({ item: role }) => (
          <View className="py-1 rounded-sm mb-0 mx-1">
            <TextScallingFalse className="text-gray-500 text-4xl font-bold mb-2">{role}</TextScallingFalse>
            <View className="bg-[#121212] rounded-2xl py-2">
              {groupedMembers[role].map((member) => (
                <TouchableOpacity
                  key={member.user._id}
                  className="flex-row items-center py-3 px-3 border-gray-800 rounded-lg"
                  onPress={() => {
                    if (isAdmin && team?._id && member?.user?._id) {
                      router.push({
                        pathname: `/teams/${team._id}/members/${member.user._id}` as RelativePathString,
                        params: {
                          // memberId: member.user._id,
                          member: JSON.stringify(member.user),
                          role: JSON.stringify(member.role),
                        },
                      });
                    } else {
                      setSelectedMember(member);
                      setShowDownwardDrawer(true);
                    }
                  }}
                >
                  <Avatar.Image size={50} source={member.user.profilePic ? { uri: member.user.profilePic } : nopic} />
                  <View className="ml-4 mt-2 flex-1 border-b pb-3 bottom-2 border-[#3B3B3B]">
                    <TextScallingFalse className="text-white text-2xl font-medium">
                      {member.user.firstName} {member.user.lastName}
                    </TextScallingFalse>
                    <TextScallingFalse className="text-gray-400 text-sm">{member.user.headline}</TextScallingFalse>
                  </View>
                  <Icon name="right" size={12} color="gray" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />

      {/* Downward Drawer for Non-Admin */}
      {showDownwardDrawer && selectedMember && (
        <DownwardDrawer
          visible={showDownwardDrawer}
          member={selectedMember}
          onClose={() => setShowDownwardDrawer(false)}
        />
      )}
    </PageThemeView>
  );
};

export default Members;
