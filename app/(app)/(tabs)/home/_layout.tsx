import { Slot } from "expo-router";
import React from "react";
import PageThemeView from "~/components/PageThemeView";
import ProfileSidebar from "~/components/feedPage/profileSidebar";
import { View } from "moti";

const ProfileLayout = () => {
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
    <ProfileSidebar menuItems={menuItems}>
      <PageThemeView>
        <View style={{ flex: 1 }}>
          <Slot />
        </View>
      </PageThemeView>
    </ProfileSidebar>
  );
};

export default ProfileLayout;
