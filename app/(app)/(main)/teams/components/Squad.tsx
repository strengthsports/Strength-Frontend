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

const Squad: React.FC = () => {
  const [fontsLoaded] = useFonts({
    "Sansation-Regular": require("../../../../../assets/fonts/Sansation_Bold_Italic.ttf"),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="white" />;
  }
  const [showMembersModal, setShowMembersModal] = useState(false);
  const properties = [
    "Batter",
    "Bowler",
    "Fielding",
    "Wicket Keeper",
    "All-Rounder",
  ];

  const dummyUsers = [
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

  const handleInvite = (selectedUsers: any) => {
    console.log("Inviting users:", selectedUsers);
    setShowMembersModal(false);
  };

  return (
    <ScrollView className="flex-1 bg-black p-4">
      {properties.map((property) => (
        <View key={property}>
          <View className="flex flex-row justify-between items-center mb-4 px-4 mt-2">
            <Text
              style={{
                fontFamily: "Sansation-Regular",
                color: "white",
                fontSize: 32,
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
            {dummyUsers
              .filter((user) => user.position === property)
              .map((user) => (
                <View key={user.id} className="w-1/2 p-2">
                  {/* Each team member takes up half the width */}
                  <TeamMember
                    imageUrl={user.imageUrl}
                    name={user.name}
                    description={user.description}
                  />
                </View>
              ))}

            {/* Card for adding new member */}
            <TouchableOpacity
              className="w-1/2 p-2"
              onPress={() => setShowMembersModal(true)} // Opens modal to add a new member
            >
              <View className="flex justify-center h-[200] border border-gray-700 items-center rounded-lg">
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
      {showMembersModal && (
        <AddMembersModal
          onInvite={handleInvite}
          visible={showMembersModal}
          onClose={() => setShowMembersModal(false)}
        />
      )}
    </ScrollView>
  );
};

export default Squad;
