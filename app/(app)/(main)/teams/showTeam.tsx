import React from "react";
import { View, ScrollView } from "react-native";
import TeamCard from "./components/teamCard";
import SubCategories from "./components/subCategories";
import Drawer from "./components/drawer";

const showTeam = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* Make Drawer fixed at top */}
      <Drawer
        style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 10, paddingTop: 60 }} // Adjust for the space taken by the drawer
      >
        <View style={{ flex: 1 }}>
          <TeamCard
            sportCategory="Cricket"
            captain="Rahul Sharma"
            viceCapt="Piyush Shukla"
            location="Kolkata, India"
          />
          <SubCategories />
        </View>
      </ScrollView>
    </View>
  );
};

export default showTeam;
