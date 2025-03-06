import React from "react";
import { View, ScrollView } from "react-native";
import TeamCard from "../components/teamCard";
import SubCategories from "../components/subCategories";
import CombinedDrawer from "../components/combinedDrawer";
import { useRouter } from "expo-router";

const TeamPage = () => {
  const router = useRouter();
  const menuItems = [
    {
      label: "Edit Team",
      onPress: () => router.push("./edit/editTeam"), // Example function for "Home"
    },
    {
      label: "Members",
      onPress: () => router.push("./edit/members"), // Example function for "Settings"
    },
    {
      label: "Add members",
      onPress: () => console.log("Profile clicked!"), // Example function for "Profile"
    },
    {
      label: "Delete Team",
      onPress: () => console.log("Logout clicked!"), // Example function for "Logout"
    },
  ];
  return (
    <CombinedDrawer menuItems={menuItems}>
      <View>
        <TeamCard
          teamName="Kolkata Knights Rider"
          sportCategory="Cricket"
          captain="Rahul Sharma"
          viceCapt="Piyush Shukla"
          location="Kolkata, India"
          teamLogo="https://picsum.photos/200/200"
        />
        <SubCategories />
      </View>
    </CombinedDrawer>
  );
};

export default TeamPage;
