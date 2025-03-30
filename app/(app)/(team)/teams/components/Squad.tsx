import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import TeamMember from "./teamMember";
import Icon from "react-native-vector-icons/Entypo";
import { useFonts } from "expo-font";
import AddMembersModal from "../addMembersModal";
import { useSelector } from "react-redux";
import Nopic from "@/assets/images/pro.jpg"

interface SquadProps {
  teamDetails: any;
}



const Squad: React.FC<SquadProps> = ({ teamDetails }) => {
  console.log("Console Form Squad side");
  console.log(teamDetails);
  const [fontsLoaded] = useFonts({
    "Sansation-Regular": require("../../../../../assets/fonts/Sansation_Bold_Italic.ttf"),
  });
  const { user } = useSelector((state: any) => state?.profile);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const userId = user?._id;

  useEffect(() => {
    if (teamDetails && teamDetails.admin) {
      const adminCheck = teamDetails.admin.some((admin) => admin._id === userId);
      setIsAdmin(adminCheck);
    }
  }, [teamDetails]);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="white" />;
  }

  if (!teamDetails) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white mt-4">Loading team details...</Text>
      </View>
    );
  }

  const categorizeMembers = (playerType: string) => {
    return teamDetails.members?.filter((member: any) => 
      member.role.toLowerCase().includes(playerType.toLowerCase())
    ) || [];
  };

  const renderMemberSection = (title: string, members: any[]) => (
    <View className="mb-4">
      <Text style={{ fontFamily: "Sansation-Regular", color: "white", fontSize: 20 }}>
        {title}
      </Text>
      <View className="flex flex-row flex-wrap">
        {members.length > 0 ? (
          members.map((member: any) => {
            const user = member.user;
            return (
              <View key={user?._id || member._id || Math.random().toString()} className="w-1/2 p-2">
                <TeamMember
                  imageUrl={user?.profilePic }
                  name={`${user?.firstName || "Unknown"} ${user?.lastName || ""}`}
                  description={user?.headline || "No description available"}
                  isAdmin={isAdmin}
                  onRemove={() => console.log("Remove user:", user?._id)}
                />
              </View>
            );
          })
        ) : (
          <View>
          <TouchableOpacity className="w-1/2 p-2" onPress={() => setShowMembersModal(true)}>
          <View className="flex justify-center h-[180] w-[170] border border-gray-700 items-center rounded-lg">
            <Text style={{ color: "white", fontSize: 30, fontFamily: "Sansation-Regular" }}>+</Text>
            <Text style={{ color: "white", fontFamily: "Sansation-Regular" }}>Add Member</Text>
          </View>
        </TouchableOpacity>
          
          </View>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 max-w-screen-lg px-4">
      <View className="flex flex-row justify-between items-center px-4 mt-2">
        <Text style={{ fontFamily: "Sansation-Regular", color: "white", fontSize: 24 }}>
         
        </Text>
        <Icon name="dots-three-horizontal" size={30} color="white" />
      </View>

      {teamDetails.sport.playerTypes.map((playerType: any) => (
        renderMemberSection(playerType.name, categorizeMembers(playerType.name))
      ))}

     

      <AddMembersModal
        onInvite={(selectedUsers: any) => {
          console.log("Inviting users:", selectedUsers);
          setShowMembersModal(false);
        }}
        visible={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        buttonName="Invite"
        multiselect={true}
        player={teamDetails.members || []}
      />
    </ScrollView>
  );
};

export default Squad;