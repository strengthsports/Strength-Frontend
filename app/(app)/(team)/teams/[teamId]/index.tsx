import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import TeamCard from "../components/teamCard";
import SubCategories from "../components/subCategories";
import CombinedDrawer from "../components/combinedDrawer";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { deleteTeam, fetchTeamDetails } from "../../../../../reduxStore/slices/team/teamSlice";
import { RootState } from "~/reduxStore";
import { SafeAreaView } from "react-native-safe-area-context";

const TeamPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useLocalSearchParams();
  const teamId = params.teamId; // Directly using it without state
  const [team, setTeam] = useState(null);

  useEffect(() => {
    if (teamId) {
      console.log("Fetching team details for ID:", teamId);
      handleFetchTeam();
    }
  }, [teamId, dispatch]);

  const handleFetchTeam = async () => {
    try {
      const teamDetails = await dispatch(fetchTeamDetails(teamId)).unwrap();
      console.log("Fetched Team Data:", teamDetails);
      setTeam(teamDetails);
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  };

 
  const handleDeleteTeam = async () => {
    try {
      const message = await dispatch(deleteTeam(teamId)).unwrap();
      Alert.alert("Success", message); // Show success message
      router.push("/(app)/(tabs)/home"); // Navigate to teams list after deletion
    } catch (error) {
      console.error("Error deleting team:", error);
      Alert.alert("Error", "Failed to delete team"); // Show error message
    }
  };

  const menuItems = [
    {
      label: "Edit Team",
      onPress: () => router.push("../edit/editTeam"),
    },
    {
      label: "Members",
      onPress: () => router.push("./edit/members"),
    },
    {
      label: "Add members",
      onPress: () => console.log("Add Members clicked!"),
    },
    {
      label: "Delete Team",
      onPress: handleDeleteTeam, // Trigger delete team on press
    },
  ];

  return (
    <CombinedDrawer menuItems={menuItems}>
     
       
          <TeamCard
            teamName={team?.name || "Loading..."}
            sportCategory={team?.sport?.name || "Loading..."}
            captain={team?.captain || "Not Assigned"}
            viceCapt={team?.viceCaptain || "Not Assigned"}
            location={`${team?.address?.city}, ${team?.address?.country}` || "Unknown"}
            teamLogo={team?.logo?.url || "https://picsum.photos/200/200"}
            sportLogo={team?.sport?.logo || "https://picsum.photos/200/200"}
          />
          <SubCategories teamDetails={team} />
     
     
    </CombinedDrawer>
  );
};

export default TeamPage;
