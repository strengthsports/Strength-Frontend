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
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTeam,
  fetchTeamDetails,
  TeamPayload
} from "~/reduxStore/slices/team/teamSlice";
import { AppDispatch, RootState } from "~/reduxStore";
import SettingsIcon from "~/components/SvgIcons/teams/SettingsIcon";
import InviteMembers from "~/components/SvgIcons/teams/InviteMembers";
import LeaveTeam from "~/components/SvgIcons/teams/LeaveTeam";
// import { ThemedView } from "~/components/ThemedView";


const TeamPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useLocalSearchParams();
  const teamId = params.teamId ? String(params.teamId) : ""; 
  const [team, setTeam] = useState<any>(null);
  const teamDetails = useSelector((state:RootState)=>state?.team.team)

  console.log("Team Details",teamDetails);

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
      logo:SettingsIcon,
      color:"white",
      onPress: () =>
        router.push(
          `/(app)/(team)/teams/${teamId}/settings` as RelativePathString
        ),
    },
    {
      label: "Members",
      logo:"",
      color:"white",
      onPress: () =>
        router.push(
          `/(app)/(team)/teams/${teamId}/members` as RelativePathString
        ),
    },
    {
      label: "Invite Members",
      logo:InviteMembers,
      color:"white",
      onPress: () => console.log("Invite Members Modal Will Open"),
    },
    {
      label: "Leave Team",
      logo:LeaveTeam,
      color:"red",
      onPress: () => handleDeleteTeam(),
    },
  ];

  return (
    
      <CombinedDrawer menuItems={menuItems} teamId={teamId} >
        <TeamCard
          teamName={teamDetails?.name || "Loading..."}
          sportCategory={teamDetails?.sport?.name || "Loading..."}
          captain={teamDetails?.captain || "Not Assigned"}
          viceCapt={teamDetails?.viceCaptain || "Not Assigned"}
          location={
            teamDetails?.address
              ? `${teamDetails.address.city}, ${teamDetails.address.country}`
              : "Unknown"
          }
          teamLogo={teamDetails?.logo?.url || "https://picsum.photos/200/200"}
          sportLogo={teamDetails?.sport?.logo || "https://picsum.photos/200/200"}
        />
        <SubCategories teamDetails={teamDetails} />
      </CombinedDrawer>
      
  
  );
};

export default TeamPage;
