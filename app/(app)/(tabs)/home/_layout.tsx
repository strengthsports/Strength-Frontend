import { Slot } from "expo-router";
import React from "react";
import PageThemeView from "~/components/PageThemeView";
import HomeLayout from "~/components/feedPage/HomeLayout";
import { View } from "moti";

const HomeLayoutPage = () => {
  const menuItems = [
    {
      label: "Edit Team",
      onPress: () => console.log("/teams/edit/editTeam"), // Example function for "Home"
    },
    {
      label: "Members",
      onPress: () => console.log("/teams/edit/members"), // Example function for "Settings"
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
    <HomeLayout menuItems={menuItems}>
      <Slot />
    </HomeLayout>
  );
};

export default HomeLayoutPage;
