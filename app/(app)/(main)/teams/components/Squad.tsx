import React from "react";
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
import { useState } from "react";


interface PotentialMember {
  id: string;
  name: string;
  role: string;
  image: string;
  selected?: boolean;
}
const Squad: React.FC = () => {
  const [fontsLoaded] = useFonts({
    "Sansation-Regular": require("../../../../../assets/fonts/Sansation_Bold_Italic.ttf"),
  });

  const [showMembersModal, setShowMembersModal] = useState(false);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="white" />;
  }

  const properties = [
    "Batter",
    "Bowler",
    "Fielding",
    "Wicket Keeper",
    "All-Rounder",
  ];

  const teamMembers = [
    {
      id: "1",
      name: "Rahul Sharma",
      position: "Batter",
      imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
      uid: "user-001",
      description: "A powerful batsman with great consistency.",
    },
    {
      id: "2",
      name: "Piyush Shukla",
      position: "Bowler",
      imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
      uid: "user-002",
      description: "A fast bowler known for his pace and accuracy.",
    },
    {
      id: "3",
      name: "Alok Verma",
      position: "All-rounder",
      imageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
      uid: "user-003",
      description: "An all-rounder who excels with both bat and ball.",
    },
    {
      id: "4",
      name: "Sneha Roy",
      position: "Wicket Keeper",
      imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
      uid: "user-004",
      description: "A wicketkeeper with exceptional reflexes and skill.",
    },
    {
      id: "5",
      name: "Ravi Kumar",
      position: "Batter",
      imageUrl: "https://randomuser.me/api/portraits/men/4.jpg",
      uid: "user-005",
      description: "A reliable batter who can anchor the innings.",
    },
    {
      id: "6",
      name: "Meera Singh",
      position: "Bowler",
      imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
      uid: "user-006",
      description: "A left-arm spinner with great variations.",
    },
    {
      id: "7",
      name: "Ajay Patel",
      position: "All-rounder",
      imageUrl: "https://randomuser.me/api/portraits/men/5.jpg",
      uid: "user-007",
      description: "A versatile all-rounder with skills in both departments.",
    },
    {
      id: "8",
      name: "Nisha Sharma",
      position: "Wicket Keeper",
      imageUrl: "https://randomuser.me/api/portraits/women/3.jpg",
      uid: "user-008",
      description: "An agile wicketkeeper with a sharp eye.",
    },
    {
      id: "9",
      name: "Karan Desai",
      position: "Batter",
      imageUrl: "https://randomuser.me/api/portraits/men/6.jpg",
      uid: "user-009",
      description: "An aggressive batsman known for his power hitting.",
    },
    {
      id: "10",
      name: "Simran Kaur",
      position: "Bowler",
      imageUrl: "https://randomuser.me/api/portraits/women/4.jpg",
      uid: "user-010",
      description: "A talented bowler with excellent control and flight.",
    },
  ];
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
    <ScrollView className="flex-1 bg-black p-1 max-w-screen-lg mx-auto">
      {properties.map((property) => (
        <View key={property}>
          <View className="flex flex-row justify-between items-center  px-4 mt-2">
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

          {/* Displaying two team members per row */}
          <View className="flex flex-row flex-wrap">
            {teamMembers
              .filter((user) => user.position === property)
              .map((user) => (
                <View key={user.id} className="w-1/2 p-2">
                  {/* Each team member takes up half the width */}
                  <TeamMember
                    imageUrl={user.imageUrl}
                    name={user.name}
                    description={user.description}
                    isCaptain={user.id === "1"}
                    isViceCaptain={user.id === "2"}
                    isAdmin={true}
                    onRemove={() => console.log("Removing user:", user)}
                  />
                </View>
              ))}

            {/* Card for adding new member */}
            <TouchableOpacity
              className="w-1/2 p-2"
              onPress={() => setShowMembersModal(true)} // Opens modal to add a new member
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
      ))}

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
