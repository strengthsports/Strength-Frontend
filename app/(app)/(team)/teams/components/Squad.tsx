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

interface PotentialMember {
  id: string;
  name: string;
  role: string;
  image: string;
  selected?: boolean;
}

interface SquadProps {
  teamDetails: any;
}

const Squad: React.FC<SquadProps> = ({ teamDetails }) => {
  const [fontsLoaded] = useFonts({
    "Sansation-Regular": require("../../../../../assets/fonts/Sansation_Bold_Italic.ttf"),
  });
  const { error, loading, user } = useSelector((state: any) => state?.profile);
  const [proper, setProper] = useState<string[]>([]);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const userId = user?._id;

  useEffect(() => {
    // Check if teamDetails and teamDetails.sport exist before accessing properties
    if (teamDetails && teamDetails.sport && teamDetails.sport.playerTypes) {
      setProper(teamDetails.sport.playerTypes.map((item: any) => item.name));
      const adminCheck = teamDetails.admin.some(
        (admin) => admin._id === userId,
      );
      setIsAdmin(adminCheck);
      console.log("isAdmin", isAdmin);
    } else {
      console.log("teamDetails is missing required data:", teamDetails);
      setProper([]); // Set to empty array if data is not available
    }
  }, [teamDetails]);

  // Loading state
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="white" />;
  }

  // If teamDetails is not loaded yet, show loading indicator
  if (!teamDetails) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white mt-4">Loading team details...</Text>
      </View>
    );
  }

  const dummyMembers: PotentialMember[] = [
    {
      id: "1",
      name: "Prathik Jha",
      role: "Cricketer | Ranji Trophy Player",
      image: "https://picsum.photos/id/1/100/100",
      selected: false,
    },
    {
      id: "2",
      name: "Rohan Deb Nath",
      role: "Cricketer | Right-Hand Batsman",
      image: "https://picsum.photos/id/2/100/100",
      selected: false,
    },
    {
      id: "3",
      name: "Aditi Mehra",
      role: "Cricketer | Left-Hand Batsman",
      image: "https://picsum.photos/id/3/100/100",
      selected: false,
    },
    {
      id: "4",
      name: "Arjun Kapoor",
      role: "All-Rounder | State Team Player",
      image: "https://picsum.photos/id/4/100/100",
      selected: false,
    },
    {
      id: "5",
      name: "Sneha Roy",
      role: "Cricketer | Wicket-Keeper",
      image: "https://picsum.photos/id/5/100/100",
      selected: false,
    },
    {
      id: "6",
      name: "Rajesh Kumar",
      role: "Bowler | Swing Specialist",
      image: "https://picsum.photos/id/6/100/100",
      selected: false,
    },
    {
      id: "7",
      name: "Priya Singh",
      role: "All-Rounder | District Team Player",
      image: "https://picsum.photos/id/7/100/100",
      selected: false,
    },
    {
      id: "8",
      name: "Vikram Joshi",
      role: "Cricketer | Opening Batsman",
      image: "https://picsum.photos/id/8/100/100",
      selected: false,
    },
    {
      id: "9",
      name: "Tanya Sharma",
      role: "Cricketer | Spin Bowler",
      image: "https://picsum.photos/id/9/100/100",
      selected: false,
    },
    {
      id: "10",
      name: "Karan Patel",
      role: "Bowler | Fast Bowling Specialist",
      image: "https://picsum.photos/id/10/100/100",
      selected: false,
    },
  ];

  const handleInvite = (selectedUsers: any) => {
    console.log("Inviting users:", selectedUsers);
    setShowMembersModal(false);
  };

  return (
    <ScrollView className="flex-1 max-w-screen-lg px-4">
      {proper.length > 0 ? (
        proper.map((property) => (
          <View key={property}>
            <View className="flex flex-row justify-between items-center px-4 mt-2">
              <Text
                style={{
                  fontFamily: "Sansation-Regular",
                  color: "white",
                  fontSize: 24,
                }}
              >
                {property}
              </Text>
              <View>
                <Icon name="dots-three-horizontal" size={30} color="white" />
              </View>
            </View>

            {/* Displaying team members */}
            <View className="flex flex-row flex-wrap">
              {teamDetails.members && teamDetails.members.length > 0 ? (
                teamDetails.members
                  .filter((member: any) => member.role === property)
                  .map((member: any) => {
                    const user = member.user; // Extract user from member
                    return (
                      <View
                        key={
                          user?._id || member._id || Math.random().toString()
                        }
                        className="w-1/2 p-2"
                      >
                        <TeamMember
                          imageUrl={user?.profilePic}
                          name={`${user?.firstName || "Unknown"} ${
                            user?.lastName || ""
                          }`}
                          description={
                            user?.headline || "No description available"
                          }
                          isAdmin={isAdmin}
                          onRemove={() =>
                            console.log("Remove user:", user?._id)
                          }
                        />
                      </View>
                    );
                  })
              ) : (
                <Text className="text-gray-400 ml-4 mb-2">
                  No members in this category
                </Text>
              )}

              {/* Card for adding new member */}
              <TouchableOpacity
                className="w-1/2 p-2"
                onPress={() => setShowMembersModal(true)}
              >
                <View className="flex justify-center h-[180] w-[170] border border-gray-700 items-center rounded-lg">
                  <Text
                    style={{
                      color: "white",
                      fontSize: 30,
                      fontFamily: "Sansation-Regular",
                    }}
                  >
                    +
                  </Text>
                  <Text
                    style={{ color: "white", fontFamily: "Sansation-Regular" }}
                  >
                    Add Member
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View className="flex items-center justify-center p-8">
          <Text className="text-white text-lg">No player types available</Text>
        </View>
      )}

      {/* Modal to add new members */}
      <AddMembersModal
        onInvite={handleInvite}
        visible={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        buttonName="Invite"
        multiselect={true}
        player={dummyMembers}
      />
    </ScrollView>
  );
};

export default Squad;
