import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import TeamCard from "~/components/teamPage/TeamCard";
import SubCategories from "~/components/teamPage/SubCategories";
import CombinedDrawer from "~/components/teamPage/CombinedDrawer";
import {
  useRouter,
  useLocalSearchParams,
  RelativePathString,
} from "expo-router";
import { useDispatch } from "react-redux";
import {
  deleteTeam,
  fetchTeamDetails,
} from "~/reduxStore/slices/team/teamSlice";
// import { ThemedView } from "~/components/ThemedView";


const TeamPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useLocalSearchParams();
  const teamId = params.teamId ? String(params.teamId) : ""; 
  const [team, setTeam] = useState<any>(null); 
  

  useEffect(() => {
    if (teamId) {
      console.log("Fetching team details for ID:", teamId);
      handleFetchTeam();
    }
  }, [teamId, dispatch]);

  const handleFetchTeam = async () => {
    if (!teamId) return; // Avoid making API calls with an empty ID
    try {
      const teamDetails = await dispatch(fetchTeamDetails(teamId)).unwrap();
      console.log("Fetched Team Data:", teamDetails);
      setTeam(teamDetails);
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  };

  const handleDeleteTeam = async () => {
    if (!teamId) return;
    try {
      const message = await dispatch(deleteTeam(teamId)).unwrap();
      Alert.alert("Success", message);
      router.push("/(app)/(tabs)/home");
    } catch (error) {
      console.error("Error deleting team:", error);
      Alert.alert("Error", "Failed to delete team");
    }
  };

  const menuItems = [
    {
      label: "Settings",
      onPress: () =>
        router.push(
          `/(app)/(team)/teams/${teamId}/settings` as RelativePathString
        ),
    },
    {
      label: "Members",
      onPress: () =>
        router.push(
          `/(app)/(team)/teams/${teamId}/members` as RelativePathString
        ),
    },
    {
      label: "Invite Members",
      onPress: () => console.log("Invite Members Modal Will Open"),
    },
    {
      label: "Leave Team",
      onPress: () => handleDeleteTeam(),
    },
  ];

  return (
    
      <CombinedDrawer menuItems={menuItems} teamId={teamId}>
        <TeamCard
          teamName={team?.name || "Loading..."}
          sportCategory={team?.sport?.name || "Loading..."}
          captain={team?.captain || "Not Assigned"}
          viceCapt={team?.viceCaptain || "Not Assigned"}
          location={
            team?.address
              ? `${team.address.city}, ${team.address.country}`
              : "Unknown"
          }
          teamLogo={team?.logo?.url || "https://picsum.photos/200/200"}
          sportLogo={team?.sport?.logo || "https://picsum.photos/200/200"}
        />
        <SubCategories teamDetails={team} />
      </CombinedDrawer>
      
  
  );
};

export default TeamPage;
