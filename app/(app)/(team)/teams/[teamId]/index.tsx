import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert
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
import { sendTeamJoinRequest, resetJoinStatus } from '~/reduxStore/slices/team/teamJoinSlice';
import { AppDispatch, RootState } from "~/reduxStore";
import TeamCard from "~/components/teamPage/TeamCard";
import SubCategories from "~/components/teamPage/SubCategories";
import CombinedDrawer from "~/components/teamPage/CombinedDrawer";
import SettingsIcon from "~/components/SvgIcons/teams/SettingsIcon";
import InviteMembers from "~/components/SvgIcons/teams/InviteMembers";
import LeaveTeam from "~/components/SvgIcons/teams/LeaveTeam";
import TextScallingFalse from "~/components/CentralText";
import { Modalize } from "react-native-modalize";
import InviteModal from "~/components/teamPage/InviteModel"; 

const { height } = Dimensions.get("window");

const TeamPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const teamId = params.teamId ? String(params.teamId) : "";
  const { user } = useSelector((state: RootState) => state.profile);
  const teamDetails = useSelector((state: RootState) => state.team.team);
  console.log("Team ------>: ",teamDetails)
  const loading = useSelector((state: RootState) => state.team.loading);
  const [joining,setJoining] = useState(false);
  // const userId = useSelector((state: RootState) => state.auth.user?._id);
  
  // Safely access teamJoin state with fallback values
  const teamJoin = useSelector((state: RootState) => state.teamJoin);
  const[ isRequested,setIsRequested] = useState(teamDetails?.isRequested);
  const joinLoading = teamJoin?.loading || false;
  const joinError = teamJoin?.error || null;
  const joinSuccess = teamJoin?.success || false;
  
  // State to track if a request has been sent
  const [requestSent, setRequestSent] = useState(false);
  
  const modalRef = useRef<Modalize>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (teamId) dispatch(fetchTeamDetails(teamId));
  }, [teamId]);

  // Reset join status when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetJoinStatus());
    };
  }, []);

  // Handle join success or error with alerts
  useEffect(() => {
    if (joinSuccess) {
      setRequestSent(true);
      Alert.alert('Success', 'Join request sent successfully!');
      dispatch(resetJoinStatus());
    }
    
    if (joinError) {
      // Check if error message indicates request was already sent
      if (joinError.includes("already sent")) {
        // Set requestSent to true to disable the button
        setRequestSent(true);
        Alert.alert('Information', 'You have already sent a join request to this team.');
      } else {
        Alert.alert('Error', joinError);
      }
      dispatch(resetJoinStatus());
    }
  }, [joinSuccess, joinError]);

  const isMember = teamDetails?.members?.some(
    (member: any) => member.user?._id === user?._id
  );

  const roles = teamDetails?.sport?.playerTypes?.map((playerType: any) => playerType.name) || [];
  
  const captainMember = teamDetails?.members?.find(
    (member:any) => member?.position?.toLowerCase() === "captain"
  );
  const viceCaptainMember = teamDetails?.members?.find(
    (member:any) => member?.position?.toLowerCase() === "vicecaptain"
  );

  const captain = captainMember 
    ? `${captainMember.user?.firstName || ''} ${captainMember.user?.lastName || ''}`.trim()
    : `${teamDetails?.admin?.[0]?.firstName || ''} ${teamDetails?.admin?.[0]?.lastName || ''}`.trim() || "Loading...";

  const viceCapt = viceCaptainMember
    ? `${viceCaptainMember.user?.firstName || ''} ${viceCaptainMember.user?.lastName || ''}`.trim()
    : "Not assigned";

  const location = teamDetails?.address
    ? `${teamDetails.address.city}, ${teamDetails.address.country}`
    : "Unknown";

  const handleDeleteTeam = async () => {
    try {
      const message = await dispatch(deleteTeam(teamId)).unwrap();
      alert("Success: " + message);
      router.push("/(app)/(tabs)/home");
    } catch (error) {
      alert("Error deleting team");
    }
  };

  const handleJoinTeam = async () => {

    setJoining(true)
    if (requestSent) {
      Alert.alert('Information', 'You have already sent a join request to this team.');
      return;
    }
    
    if (!user._id || !teamId) {
      Alert.alert('Error', 'Missing user or team information');
      return;
    }
    
    try {
      const UserId = user?._id || "";
      console.log("sending join request----->", UserId, teamId);
      setJoining(true)
      await dispatch(sendTeamJoinRequest({ UserId, teamId }));
     
    } catch (err) {
      console.error('Failed to send request:', err);
     
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (teamId) {
      dispatch(fetchTeamDetails(teamId))
        .unwrap()
        .then(() => setRefreshing(false))
        .catch(() => setRefreshing(false));
    }
  }, [teamId, dispatch]);

  const handleInvitePress = (role: string) => {
    modalRef.current?.close();
    router.push(
      `/(app)/(team)/teams/${teamId}/InviteMembers?role=${role.toLowerCase()}` as RelativePathString
    );
  };

  const isAdmin = user?._id === teamDetails?.admin?.[0]?._id;

  const baseMenuItems = [
    {
      id: "members", 
      label: `Members                  [${teamDetails?.members?.length || 0}]`,
      logo: () => null,
      color: "white",
      onPress: () =>
        router.push(
          `/(app)/(team)/teams/${teamId}/members` as RelativePathString
        ),
    },
    {
      id: "leave",
      label: "Leave Team",
      logo: LeaveTeam,
      color: "red",
      onPress: handleDeleteTeam,
    },
  ];

  const adminMenuItems = [
    {
      id: "settings",
      label: "Settings",
      logo: SettingsIcon,
      color: "white",
      onPress: () =>
        router.push(
          `/(app)/(team)/teams/${teamId}/settings` as RelativePathString
        ),
    },
    {
      id: "invite",
      label: "Invite Members",
      logo: InviteMembers,
      color: "white",
      onPress: () => modalRef.current?.open(),
    },
  ];

  const menuItems = isAdmin ? [...adminMenuItems, ...baseMenuItems] : baseMenuItems;

  return (
    <View style={styles.container}>
      <CombinedDrawer menuItems={menuItems} teamId={teamId}>
        <TeamCard
        requestSent={teamDetails?.isRequested}
          teamName={teamDetails?.name || "Loading..."}
          sportCategory={teamDetails?.sport?.name || "Loading..."}
          captain={captain}
          viceCapt={viceCapt}
          location={location}
          teamLogo={teamDetails?.logo?.url || "https://picsum.photos/200/200"}
          sportLogo={teamDetails?.sport?.logo || "https://picsum.photos/200/200"}
          showJoinButton={!isMember && !isAdmin}
          onJoinPress={handleJoinTeam}
          joining={joining}
          // requestSent={requestSent}
        />

        <ScrollView
          ref={scrollViewRef}
          style={styles.squadContainer}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
              colors={["#fff"]}
              progressViewOffset={40}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="white" style={styles.loader} />
          ) : (
            <SubCategories teamDetails={teamDetails} />
          )}
        </ScrollView>
      </CombinedDrawer>

      <InviteModal
        modalRef={modalRef}
        roles={roles}
        isAdmin={isAdmin}
        onInvitePress={handleInvitePress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  squadContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loader: {
    marginTop: 20,
    alignSelf: "center",
  },
  modal: {
    backgroundColor: "#1C1D23",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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