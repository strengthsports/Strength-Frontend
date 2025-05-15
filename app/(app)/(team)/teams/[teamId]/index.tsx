import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
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
import {
  sendTeamJoinRequest,
  resetJoinStatus,
} from "~/reduxStore/slices/team/teamJoinSlice";
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
import { Team } from "~/types/team";

const { height } = Dimensions.get("window");

const TeamPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useLocalSearchParams();

  const teamId = params.teamId ? String(params.teamId) : "";
  const { user } = useSelector((state: RootState) => state.profile);
  const teamDetails = useSelector((state: RootState) => state.team.team);
  // console.log("Team ------>: ", teamDetails);
  const loading = useSelector((state: RootState) => state.team.loading);
  const [joining, setJoining] = useState(false);
  // const userId = useSelector((state: RootState) => state.auth.user?._id);

  // Safely access teamJoin state with fallback values
  const teamJoin = useSelector((state: RootState) => state.teamJoin);
  const joinError = teamJoin?.error || null;
  const joinSuccess = teamJoin?.success || false;

  // State to track if a request has been sent
  const [requestSent, setRequestSent] = useState(false);
  const [isTeamMember,setIsteamMember] = useState(false);

  const modalRef = useRef<Modalize>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Memoized team data
  const teamData = useMemo(
    () => ({
      name: teamDetails?.name || "Loading...",
      sportName: teamDetails?.sport?.name || "Loading...",
      logo: teamDetails?.logo?.url || "https://picsum.photos/200/200",
      sportLogo: teamDetails?.sport?.logo || "https://picsum.photos/200/200",
      membersCount: teamDetails?.members?.length || 0,
      isRequested: teamDetails?.isRequested || false,
    }),
    [teamDetails,teamId]
  );

  // Memoized captain and vice captain data
  const { captain, viceCapt } = useMemo(() => {
    const captainMember = teamDetails?.members?.find(
      (member: any) => member?.position?.toLowerCase() === "captain"
    );
    const viceCaptainMember = teamDetails?.members?.find(
      (member: any) => member?.position?.toLowerCase() === "vicecaptain"
    );

    return {
      captain: captainMember
        ? `${captainMember.user?.firstName || ""} ${
            captainMember.user?.lastName || ""
          }`.trim()
        : "Not Assigned",
      viceCapt: viceCaptainMember
        ? `${viceCaptainMember.user?.firstName || ""} ${
            viceCaptainMember.user?.lastName || ""
          }`.trim()
        : "Not assigned",
    };
  }, [teamDetails]);

  // Memoized location
  const location = useMemo(
    () =>
      teamDetails?.address
        ? `${teamDetails.address.city}, ${teamDetails.address.country}`
        : "Unknown",
    [teamDetails?.address]
  );

  // Memoized roles
  const roles = useMemo(
    () =>
      teamDetails?.sport?.playerTypes?.map(
        (playerType: any) => playerType.name
      ) || [],
    [teamDetails?.sport?.playerTypes]
  );

  

  // Memoized isAdmin check
  const isAdmin = useMemo(
    () => user?._id === teamDetails?.admin?.[0]?._id,
    [user?._id, teamDetails?.admin]
  );

  useEffect(() => {
    if (teamId) dispatch(fetchTeamDetails(teamId));
  }, [teamId, dispatch]);

  // Reset join status when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetJoinStatus());
    };
  }, [dispatch]);

  // Handle join success or error with alerts
  useEffect(() => {
    if (joinSuccess) {
      setRequestSent(true);
      setJoining(false);
      Alert.alert("Success", "Join request sent successfully!");
      dispatch(resetJoinStatus());
    }

    if (joinError) {
      setJoining(false);
      if (joinError.includes("already sent")) {
        setRequestSent(true);
        Alert.alert(
          "Information",
          "You have already sent a join request to this team."
        );
      } else {
        Alert.alert("Error", joinError);
      }
      dispatch(resetJoinStatus());
    }
  }, [joinSuccess, joinError, dispatch]);

  const handleDeleteTeam = useCallback(async () => {
    try {
      const message = await dispatch(deleteTeam(teamId)).unwrap();
      alert("Success: " + message);
      router.push("/(app)/(tabs)/home");
    } catch (error) {
      alert("Error deleting team");
    }
  }, [dispatch, teamId, router]);

  const handleJoinTeam = useCallback(async () => {
    setJoining(true);
    if (requestSent) {
      Alert.alert(
        "Information",
        "You have already sent a join request to this team."
      );
      setJoining(false);
      return;
    }

    if (!user?._id || !teamId) {
      Alert.alert("Error", "Missing user or team information");
      setJoining(false);
      return;
    }

    try {
      const UserId = user?._id || "";
      // console.log("sending join request----->", UserId, teamId);
      setJoining(true);
      await dispatch(sendTeamJoinRequest({ UserId, teamId }));
    } catch (err) {
      console.error("Failed to send request:", err);
      setJoining(false);
    }
  }, [dispatch, requestSent, teamId, user?._id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (teamId) {
      dispatch(fetchTeamDetails(teamId))
        .unwrap()
        .then(() => setRefreshing(false))
        .catch(() => setRefreshing(false));
    }
  }, [teamId, dispatch]);

  const handleInvitePress = useCallback(
    (role: string) => {
      modalRef.current?.close();
      router.push(
        `/(app)/(team)/teams/${teamId}/InviteMembers?role=${role}` as RelativePathString
      );
    },
    [router, teamId]
  );

  const isMember = useMemo(
    () =>
      teamDetails?.members?.some(
        (member: any) => member.user?._id === user?._id
      ),
    [teamDetails?.members, user?._id]
  );

  // Memoized menu items
  const menuItems = useMemo(() => {
    const baseMenuItems = [
      {
        id: "members",
        label: `Members`,
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

    if (isAdmin) {
      return [
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
        ...baseMenuItems,
      ];
    }

    return baseMenuItems;
  }, [isAdmin, teamData.membersCount, teamId, router, handleDeleteTeam]);

  return (
    <View style={styles.container}
   >
      <CombinedDrawer menuItems={menuItems} isAdmin={isAdmin} isMember={isMember} teamId={teamId} memberCount={teamData.membersCount}>
       

        <ScrollView
           showsVerticalScrollIndicator={false}
           refreshControl={
          <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor="#fff"
        colors={["#fff"]}
        progressViewOffset={40}
      />
    }
          ref={scrollViewRef}
          style={styles.squadContainer}
          contentContainerStyle={styles.scrollContent}
         
          // showsVerticalScrollIndicator={false}
        >
          {loading && !refreshing ? (
            <ActivityIndicator
              size="large"
              color="white"
              style={styles.loader}
            />
          ) : (
            <>
            <TeamCard
          requestSent={teamData.isRequested}
          teamName={teamData.name}
          sportCategory={teamData.sportName}
          captain={captain}
          viceCapt={viceCapt}
          location={location}
          teamLogo={teamData.logo}
          sportLogo={teamData.sportLogo}
          showJoinButton={!isMember && !isAdmin}
          onJoinPress={handleJoinTeam}
          joining={joining}
        />
            <SubCategories teamDetails={teamDetails} />
            </>
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
    backgroundColor:"black",
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

export default React.memo(TeamPage);
