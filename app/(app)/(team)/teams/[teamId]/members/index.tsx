import { View, Text, TouchableOpacity, TextInput, FlatList,Image } from "react-native";
import React, { useState, useEffect } from "react";
import PageThemeView from "~/components/PageThemeView";
import Icon from "react-native-vector-icons/AntDesign";
import { RelativePathString, useRouter } from "expo-router";
import { Divider, Avatar, ActivityIndicator } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxStore";
import SearchIcon from "~/components/SvgIcons/navbar/SearchIcon";
import nopic from "../../../../../../assets/images/nopic.jpg"
// import Edit from "~/components/SvgIcons/teams/Edit";
import Edit from "../../../../../../assets/images/edit.png"

// Define TypeScript Interfaces
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  headline:string;
}

interface Member {
  user: User;
  role: string;
}

const Members: React.FC = () => {
  const router = useRouter();
  const { team, loading } = useSelector((state: RootState) => state.team);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);

  console.log(team);
  const normalizeRole = (role: string): string => {
    const lowerRole = role?.toLowerCase() || "";
    if (lowerRole.includes("bowl")) return "Bowlers";
    if (lowerRole.includes("bat")) return "Batters";
    if (lowerRole.includes("allround")) return "Allrounders";
    if (lowerRole.includes("wicket")) return "Wicketkeepers";
    return role;
  };

  const groupMembersByRole = (members: Member[]): Record<string, Member[]> => {
    const grouped: Record<string, Member[]> = {};
    members.forEach((member) => {
      const roleKey = normalizeRole(member.role);
      if (!grouped[roleKey]) {
        grouped[roleKey] = [];
      }
      grouped[roleKey].push(member);
    });
    return grouped;
  };

  useEffect(() => {
    if (team?.members) {
      setFilteredMembers(team.members);
    }
  }, [team]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMembers(team?.members || []);
    } else {
      const filtered = team?.members?.filter(
        (member) =>
          member.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];
      setFilteredMembers(filtered);
    }
  }, [searchQuery, team?.members]);

  if (loading) {
    return (
      <PageThemeView>
        <ActivityIndicator animating={true} color="white" size="large" />
      </PageThemeView>
    );
  }

  const groupedMembers = groupMembersByRole(filteredMembers);

  return (
    <PageThemeView>
      {/* Header Section */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-black">
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrowleft" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Members</Text>
        <TouchableOpacity onPress={() => router.push("/teams/settings/edit-members")}>
          <View className="flex-row items-center space-x-2">
          <Image 
          src={require("../../../../../../assets/images/edit.png") || ""} 
          alt="Edit Icon" 
          width={20}
         height={20}

          />
    
            <Text className="text-white text-lg">Edit</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Divider className="bg-gray-600" />

      {/* Search Bar */}
      <View className="px-4 py-4">
        <View className="flex-row items-center bg-[#262626] rounded-full px-4 py-2">
          <SearchIcon className="w-5 h-5 text-gray-400" />
          <TextInput
            placeholder="Search members..."
            placeholderTextColor="gray"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            className="text-white text-lg flex-1 ml-2"
          />
        </View>
      </View>

      {/* Members List */}
      <FlatList
        data={Object.keys(groupedMembers)}
        keyExtractor={(role) => role}
        renderItem={({ item: role }) => (
          <View className="py-1 rounded-sm mb-0 mx-1">
            {/* Role Header */}
            <Text className="text-gray-500 text-4xl font-bold mb-2">{role}</Text>
            <View className="bg-[#121212]  rounded-2xl  py-2">
              {/* Members List */}
              {groupedMembers[role].map((member) => (
                <TouchableOpacity
                  key={member.user._id}
                  className="flex-row items-center py-3 px-3 border-gray-800 rounded-lg"
                  onPress={() => {

                    if (team?._id && member?.user?._id) {
                      router.push({
                        pathname: `/teams/${team._id}/members/${member.user._id}` as RelativePathString, 
                        params: {
                          memberId: member.user._id,
                          member: JSON.stringify(member.user),
                          role: JSON.stringify(member.role),
                    
                          
                        },
                      });
                    } else {
                      console.error("Team ID or Member ID is missing.");
                    }
                  }}

                >
                 <Avatar.Image 
                 size={50} 
                  source={member?.user?.profilePic ? { uri: member.user.profilePic } : nopic} 
                  />
                  <View className="ml-4 mt-2 flex-1 border-b pb-3 bottom-2 border-[#3B3B3B]">
                    <Text className="text-white text-2xl font-medium">
                      {member.user.firstName} {member.user.lastName}
                    </Text>
                    <Text className="text-gray-400 text-sm">{member.user.headline}</Text>
                    
                  </View>
                  <Icon name="right" size={12} color="gray" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />
    </PageThemeView>
  );
};

export default Members;
