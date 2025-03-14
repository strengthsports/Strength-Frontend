import React, { useEffect, useState } from "react";
import { View } from "react-native";
import TeamCard from "../components/teamCard";
import SubCategories from "../components/subCategories";
import CombinedDrawer from "../components/combinedDrawer";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamDetails } from "../../../../../reduxStore/slices/team/teamSlice";
import { RootState } from "~/reduxStore";

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
      // console.log("Fetched Team Data:", teamDetails);
      setTeam(teamDetails);
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  };
  const handleEditTeam = () => {
    router.push({
      pathname: `/teams/${teamId}/edit/editTeam`,
      params: { teamDetails: JSON.stringify(team) }, // Convert object to string
    });
  };

  const menuItems = [
    {
      label: "Edit Team",
      onPress: () => handleEditTeam(),
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
      onPress: () => console.log("Delete Team clicked!"),
    },
  ];

  return (
    <CombinedDrawer menuItems={menuItems}>
      <View>
        <TeamCard
          teamName={team?.name || "Loading..."}
          sportCategory={team?.sport.name || "Loading..."}
          captain={team?.captain || " "} // Placeholder (You may fetch it dynamically)
          viceCapt={team?.viceCaptain || " "} // Placeholder
          location={
            `${team?.address?.city}, ${team?.address?.country}` || "Unknown"
          }
          teamLogo={team?.logo?.url || "https://picsum.photos/200/200"}
          sportLogo={team?.sport?.logo || "https://picsum.photos/200/200"}
        />
        <SubCategories teamDetails={team} />
      </View>
    </CombinedDrawer>
  );
};

export default TeamPage;
