import React, { useEffect, useRef } from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions
} from "react-native";
import {
  useRouter,
  useLocalSearchParams,
  RelativePathString,
} from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTeam,
  fetchTeamDetails,
} from "~/reduxStore/slices/team/teamSlice";
import { AppDispatch, RootState } from "~/reduxStore";

import TeamCard from "~/components/teamPage/TeamCard";
import SubCategories from "~/components/teamPage/SubCategories";
import CombinedDrawer from "~/components/teamPage/CombinedDrawer";
import SettingsIcon from "~/components/SvgIcons/teams/SettingsIcon";
import InviteMembers from "~/components/SvgIcons/teams/InviteMembers";
import LeaveTeam from "~/components/SvgIcons/teams/LeaveTeam";
import TextScallingFalse from "~/components/CentralText";
import { Modalize } from "react-native-modalize";

const roles = ["Batter", "Bowler", "All-Rounder"];
const { height } = Dimensions.get("window");

const TeamPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useLocalSearchParams();
  const teamId = params.teamId ? String(params.teamId) : "";
  const teamDetails = useSelector((state: RootState) => state.team.team);
  const modalRef = useRef<Modalize>(null);

  useEffect(() => {
    if (teamId) handleFetchTeam();
  }, [teamId]);

  const handleFetchTeam = async () => {
    try {
      await dispatch(fetchTeamDetails(teamId)).unwrap();
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      const message = await dispatch(deleteTeam(teamId)).unwrap();
      Alert.alert("Success", message);
      router.push("/(app)/(tabs)/home");
    } catch (error) {
      Alert.alert("Error", "Failed to delete team");
    }
  };

  const handleInvitePress = (role: string) => {
    modalRef.current?.close();
    router.push(
      `/(app)/(team)/teams/${teamId}/InviteMembers?role=${role.toLowerCase()}` as RelativePathString
    );
  };

  const menuItems = [
    {
      label: "Settings",
      logo: SettingsIcon,
      color: "white",
      onPress: () =>
        router.push(
          `/(app)/(team)/teams/${teamId}/settings` as RelativePathString
        ),
    },
    {
      label: `Members                  [${teamDetails?.members?.length || 0}]`,
      logo: () => null,
      color: "white",
      onPress: () =>
        router.push(
          `/(app)/(team)/teams/${teamId}/members` as RelativePathString
        ),
    },
    {
      label: "Invite Members",
      logo: InviteMembers,
      color: "white",
      onPress: () => modalRef.current?.open(),
    },
    {
      label: "Leave Team",
      logo: LeaveTeam,
      color: "red",
      onPress: handleDeleteTeam,
    },
  ];

  return (
    <>
      <CombinedDrawer menuItems={menuItems} teamId={teamId}>
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
          sportLogo={
            teamDetails?.sport?.logo || "https://picsum.photos/200/200"
          }
        />
        <SubCategories teamDetails={teamDetails} />
      </CombinedDrawer>

      {/* Swipeable Invite Role Drawer */}
      <Modalize
     
        ref={modalRef}
        adjustToContentHeight
        modalStyle={styles.modal}
        handleStyle={{ backgroundColor: "#888" }}
      >
        <TextScallingFalse style={styles.title}>Invite</TextScallingFalse>
        <ScrollView>
          {roles.map((role) => (
            <TouchableOpacity
              key={role}
              style={styles.roleButton}
              onPress={() => handleInvitePress(role)}
            >
              <Text style={styles.roleText}>{role}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Modalize>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#1C1D23",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 1.2, // 90% of screen height (ideal for a large modal)
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "white",
  },
  roleButton: {
    paddingVertical: 18,
    backgroundColor: "black",
    marginVertical: 6,
    padding: 20,
    borderRadius: 10,
  },
  roleText: {
    fontSize: 17,
    color: "#CFCFCF",
  },
});


export default TeamPage;
